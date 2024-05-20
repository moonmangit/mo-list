<template>
  <div>
    <section
      v-if="$route.fullPath !== '/dashboard'"
      class="pointer-events-none fixed inset-0 mx-auto max-w-full md:max-w-[500px]"
    >
      <section
        class="pointer-events-auto absolute inset-x-0 flex max-h-[100px] justify-around rounded-none border-t p-4 duration-500 md:rounded-full"
        :class="{
          'bottom-0  bg-white md:bottom-5 md:border': action === 'create',
          'bottom-4 !max-h-0 border-transparent bg-transparent !p-0':
            action === 'update',
        }"
      >
        <button
          class="controller-button"
          :class="{
            'exact-active': !$route.fullPath.includes('view=calendar'),
            'pointer-events-none opacity-0': action === 'update',
          }"
          @click="$emit('changeView')"
        >
          <Icon name="line-md:check-list-3-filled" />
        </button>
        <button
          class="controller-button"
          :class="{
            'exact-active': $route.fullPath.includes('view=calendar'),
            'pointer-events-none opacity-0': action === 'update',
          }"
          @click="$emit('changeView', 'calendar')"
        >
          <Icon name="line-md:calendar" />
        </button>
        <button
          class="absolute bottom-[50%] flex size-16 items-center justify-center rounded-full bg-primary text-white ring-primary/30 duration-300 hover:ring-8"
          :class="{
            group: action === 'update',
          }"
          @click="action === 'create' ? (active = true) : submitUpdate()"
        >
          <Icon
            v-if="action === 'create'"
            name="line-md:plus"
            class="text-4xl"
          ></Icon>
          <Icon
            v-if="action === 'update'"
            name="line-md:cloud-up-twotone"
            class="text-4xl"
          ></Icon>
          <!-- Update jobs dialog -->
          <div
            v-if="action === 'update'"
            :class="[
              'pointer-events-none absolute bottom-[calc(100%+1rem)] min-w-[min(300px,80vw)] rounded-xl border bg-white p-4 text-left text-sm text-slate-800 duration-300',
              {
                'opacity-0 group-hover:opacity-100': action === 'update',
              },
            ]"
          >
            <div class="space-y-2">
              <h1 class="text-center text-xs">Todo Changes</h1>
              <hr />
              <ul class="space-y-2 px-3">
                <li
                  v-for="job in updateJobs"
                  :key="job.tid"
                  class="flex flex-wrap items-center justify-between"
                >
                  <section>{{ job.title }}</section>
                  <section class="space-x-2">
                    <span>{{ job.from }}</span>
                    <Icon
                      class="text-neutral-400"
                      name="mdi:arrow-right"
                    ></Icon>
                    <span>{{ job.to }}</span>
                  </section>
                </li>
              </ul>
            </div>
            <span
              class="absolute -bottom-2 left-[calc(50%-(1.25rem/2))] mx-auto my-0 block size-5 rotate-45 border-b border-r bg-white"
            ></span>
          </div>
        </button>
        <button
          class="absolute bottom-3 right-[calc(50%-8rem)] rounded-full border border-transparent bg-white p-2 px-3 text-primary shadow-lg duration-300 hover:border-primary"
          :class="{
            'pointer-events-none -translate-x-5 opacity-0': action === 'create',
            'pointer-events-auto translate-x-0 opacity-100':
              action === 'update',
          }"
          @click.prevent="$emit('revert')"
        >
          Revert
        </button>
      </section>
    </section>

    <!-- Dialog -->
    <AppBottomDrawer
      v-model="active"
      :after-close="
        () => {
          form.resetForm();
        }
      "
    >
      <form
        class="flex max-h-[75dvh] flex-col gap-y-5 overflow-y-auto"
        @submit.prevent="submit()"
      >
        <section class="flex items-center gap-x-2">
          <input
            v-model="form.defineField('name')[0].value"
            type="text"
            class="h-full w-full flex-1 py-5 text-xl outline-none"
            :placeholder="todoPlaceholder"
          />
          <button
            type="submit"
            class="block aspect-square size-14 rounded-full bg-primary text-xl text-white"
          >
            <Icon name="solar:map-arrow-right-bold"></Icon>
          </button>
        </section>
        <!-- Project -->
        <template v-if="!query.project">
          <section>Project</section>
          <AppPillSelect
            v-model="form.defineField('projectId')[0].value!"
            :options="injected?.data.value?.projects || []"
            :get-key="(p) => p.id"
            :get-label="(p) => p.name"
          />
        </template>
        <!-- Label -->
        <template v-if="!query.label">
          <section>
            Label
            <span
              v-if="form.values.labelIds?.length"
              class="text-primary-content/50"
            >
              ({{ form.values.labelIds.length }} labels)
            </span>
          </section>
          <AppPillSelect
            v-model="form.defineField('labelIds')[0].value!"
            :options="injected?.data.value?.labels || []"
            :get-key="(p) => p.id"
            :get-label="(p) => p.name"
          ></AppPillSelect>
        </template>
        <!-- Date -->
        <section>
          Due Date
          <span
            v-if="form.values.dueDate"
            class="text-primary-content/50"
          >
            ({{ $dayjs(form.values.dueDate).fromNow() }})
          </span>
        </section>
        <DatePicker
          v-model="form.defineField('dueDate')[0].value"
          color="primary"
          :attributes="[
            {
              highlight: {
                fillMode: 'light',
              },
              dates: new Date(),
            },
          ]"
          :min-date="new Date()"
        />
      </form>
    </AppBottomDrawer>
  </div>
</template>

<script lang="ts" setup>
import { DatePicker } from "v-calendar";
import { todoGotSchema, todoModel } from "~/assets/models/todo/todo";
import "v-calendar/style.css";
import type { ListQuery } from "~/pages/list.vue";
import type { Provide as LayoutDefaultProvide } from "~/layouts/default.vue";

type UpdateJobStatus = "todo" | "doing" | "done";
type UpdateJob = {
  tid: string;
  title: string;
  from: UpdateJobStatus;
  to: UpdateJobStatus;
};
export type { UpdateJob };

const injected = inject<LayoutDefaultProvide>("layout");

const props = defineProps<{
  query: ListQuery;
  updateJobs: UpdateJob[];
}>();
const emits = defineEmits<{
  (e: "changeView", view?: ListQuery["view"]): void;
  (e: "afterSubmit"): void;
  (e: "revert"): void;
  (e: "afterUpdate"): void;
}>();

const action = computed(() => {
  return props.updateJobs.length > 0 ? "update" : "create";
});
const active = ref(false);
const form = useForm({
  validationSchema: toTypedSchema(todoGotSchema),
  initialValues: {
    name: "",
    dueDate: "",
    labelIds: [],
    projectId: props.query.project || "",
  },
});
const submit = form.handleSubmit(async (values, { resetForm }) => {
  await callWith(
    async () => {
      await todoModel.create(values);
      emits("afterSubmit");
      resetForm();
      active.value = false;
    },
    {
      loading: true,
    },
  );
});

async function submitUpdate() {
  await callWith(
    async () => {
      await todoModel.updateStatus(props.updateJobs);
      emits("afterUpdate");
    },
    {
      loading: true,
    },
  );
}

const todoPlaceholder = computed(() => {
  const base = "What's need to be done";
  if (props.query.project) {
    return `${base} in ${injected?.data.value?.projects.find((p) => p.id === props.query.project)?.name}`;
  } else if (props.query.label) {
    return `${base} with ${injected?.data.value?.labels.find((p) => p.id === props.query.label)?.name}`;
  } else {
    return base;
  }
});
</script>

<style scoped>
.controller-button {
  @apply text-4xl text-primary-content/30 duration-300;
  @apply hover:text-primary-content/50;

  &.exact-active {
    @apply text-primary;
  }
}

:deep(.vc-container) {
  @apply w-full border-none;
  * {
    @apply !duration-300;
  }
}

:deep(.vc-primary) {
  --vc-accent-50: oklch(var(--p) / 0.05);
  --vc-accent-100: oklch(var(--p) / 0.1);
  --vc-accent-200: oklch(var(--p) / 0.2);
  --vc-accent-300: oklch(var(--p) / 0.3);
  --vc-accent-400: oklch(var(--p));
  --vc-accent-500: oklch(var(--p));
  --vc-accent-600: oklch(var(--p));
  --vc-accent-700: oklch(var(--p));
  --vc-accent-800: oklch(var(--p));
  --vc-accent-900: oklch(var(--p));

  --vc-focus-ring: 0 0 0 2px oklch(var(--p) / 0.5);
  --vc-font-family: var(--font-sans);
  --vc-weekday-color: oklch(var(--p));
  --vc-header-arrow-hover-bg: oklch(var(--p) / 0.1);
}
:deep(.vc-title),
:deep(.vc-nav-title),
:deep(.vc-nav-item) {
  @apply font-light;
}
:deep(.vc-arrow),
:deep(.vc-nav-arrow) {
  @apply size-7 rounded-full;
}
:deep(.vc-nav-items) {
  @apply mt-2 gap-2;
}
</style>

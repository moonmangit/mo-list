<template>
  <div>
    <section
      v-if="$route.fullPath !== '/dashboard'"
      class="fixed inset-0 mx-auto max-w-full md:max-w-[500px]"
    >
      <section
        class="absolute inset-x-0 bottom-0 flex justify-around rounded-none border-t bg-white p-4 duration-300 md:bottom-5 md:rounded-full md:border"
      >
        <button
          class="controller-button"
          :class="{
            'exact-active': !$route.fullPath.includes('view=calendar'),
          }"
          @click="$emit('changeView')"
        >
          <Icon name="line-md:check-list-3-filled" />
        </button>
        <button
          class="controller-button"
          :class="{
            'exact-active': $route.fullPath.includes('view=calendar'),
          }"
          @click="$emit('changeView', 'calendar')"
        >
          <Icon name="line-md:calendar" />
        </button>
        <button
          class="absolute bottom-[50%] flex size-16 items-center justify-center rounded-full bg-primary text-white ring-primary/30 duration-300 hover:ring-8"
          @click="active = true"
        >
          <Icon
            name="line-md:plus"
            class="text-4xl"
          ></Icon>
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
        class="flex flex-col gap-y-5"
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

const injected = inject<LayoutDefaultProvide>("layout");

const props = defineProps<{
  query: ListQuery;
}>();
const emits = defineEmits<{
  (e: "changeView", view?: ListQuery["view"]): void;
  (e: "afterSubmit"): void;
}>();

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
  await todoModel.create(values);
  emits("afterSubmit");
  resetForm();
  active.value = false;
});

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

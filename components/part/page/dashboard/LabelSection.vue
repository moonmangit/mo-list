<template>
  <div>
    <ElNameSection
      title="Labels"
      :actions="{
        add: {
          icon: 'mdi:plus',
          action: () => {
            active = true;
          },
        },
      }"
      :always-open="labels.length === 0"
    >
      <div>
        <ul class="space-y-3">
          <li
            v-for="label in labels"
            :key="label.id"
          >
            <button
              class="project-card group"
              @click.prevent="navigateTo(`/list?label=${label.id}`)"
            >
              <AppContentWithIcon
                :content="`mdi:tag|${label.name}|mdi:chevron-right`"
                class="gap-x-4"
                :classes="[
                  'text-amber-500',
                  '',
                  'ml-auto group-hover:translate-x-2 duration-300',
                ]"
              />
            </button>
          </li>
          <li
            v-if="labels.length === 0"
            class="text-center text-neutral-400"
          >
            No label created yet.
          </li>
        </ul>
      </div>
    </ElNameSection>

    <!-- Dialog -->
    <AppBottomDrawer
      v-model="active"
      :after-close="() => {}"
    >
      <form
        class="flex items-center gap-x-2"
        @submit.prevent="submit()"
      >
        <input
          v-model="form.defineField('name')[0].value"
          type="text"
          class="h-full w-full flex-1 py-5 text-xl outline-none"
          placeholder="Label name ..."
        />
        <button
          type="submit"
          class="block aspect-square size-14 rounded-full bg-primary text-xl text-white"
          @click="active = false"
        >
          <Icon name="solar:map-arrow-right-bold"></Icon>
        </button>
      </form>
    </AppBottomDrawer>
  </div>
</template>

<script lang="ts" setup>
import type { UserDoc } from "~/assets/libs/user";
import { labelGotSchema, labelModel } from "~/assets/models/label";

defineProps<{
  labels: UserDoc["labels"];
}>();

const emits = defineEmits<{
  (e: "after-submit"): void;
}>();

const form = useForm({
  validationSchema: toTypedSchema(labelGotSchema),
  initialValues: {
    name: "",
  },
});
const active = ref(false);

const submit = form.handleSubmit(async (values, { resetForm }) => {
  await callWith(
    async () => {
      await labelModel.create(values);
      emits("after-submit");
      active.value = false;
      resetForm();
    },
    {
      loading: true,
    },
  );
});
</script>

<style></style>

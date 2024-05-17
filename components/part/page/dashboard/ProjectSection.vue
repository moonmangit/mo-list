<template>
  <div>
    <ElNameSection
      title="Projects"
      :actions="{
        add: {
          icon: 'mdi:plus',
          action: () => {
            active = true;
          },
        },
      }"
    >
      <div>
        <ul class="space-y-3">
          <li
            v-for="project in projects"
            :key="project.id"
          >
            <button
              class="project-card group"
              @click.prevent="navigateTo(`/list?project=${project.id}`)"
            >
              <AppContentWithIcon
                :content="`mdi:projector-screen|${project.name}|mdi:chevron-right`"
                class="gap-x-4"
                :classes="[
                  'text-blue-500',
                  '',
                  'ml-auto group-hover:translate-x-2 duration-300',
                ]"
              />
            </button>
          </li>
        </ul>
      </div>
    </ElNameSection>

    <!-- Project Dialog -->
    <AppBottomDrawer
      v-model="active"
      :after-close="() => {}"
    >
      <form
        class="flex items-center gap-x-2"
        @submit.prevent="submit"
      >
        <input
          v-model="form.defineField('name')[0].value"
          type="text"
          class="h-full w-full flex-1 py-5 text-xl outline-none"
          placeholder="Project name ..."
        />
        <button
          class="block aspect-square size-14 rounded-full bg-primary text-xl text-white"
          type="submit"
        >
          <Icon name="solar:map-arrow-right-bold"></Icon>
        </button>
      </form>
    </AppBottomDrawer>
  </div>
</template>

<script lang="ts" setup>
import type { UserDoc } from "~/assets/libs/user";
import { projectGotSchema, projectModel } from "~/assets/models/project";

defineProps<{
  projects: UserDoc["projects"];
}>();

const emits = defineEmits<{
  (e: "after-submit"): void;
}>();

const form = useForm({
  validationSchema: toTypedSchema(projectGotSchema),
  initialValues: {
    name: "",
  },
});
const active = ref(false);

const submit = form.handleSubmit(async (values, { resetForm }) => {
  await projectModel.create(values);
  emits("after-submit");
  active.value = false;
  resetForm();
});
</script>

<style></style>

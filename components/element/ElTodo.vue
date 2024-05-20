<template>
  <div
    class="flex w-full cursor-pointer items-center gap-x-4 rounded-xl bg-white p-4 duration-300 hover:shadow-lg"
    :class="{
      '!bg-transparent opacity-40 hover:!shadow-none': todo.status === 'done',
    }"
  >
    <input
      type="radio"
      class="radio-primary radio pointer-events-none"
      :checked="todo.status === 'done'"
      readonly
    />
    <section class="flex-1">
      <h1
        :class="{
          'line-through': todo.status === 'done',
        }"
      >
        {{ todo.name }}
      </h1>
      <p class="text-xs text-neutral/50">
        <span v-if="todo.dueDate">
          {{ $dayjs(todo.dueDate).fromNow() }}
        </span>
      </p>
    </section>
    <section>
      <ul class="flex flex-wrap justify-end gap-2">
        <li
          v-if="todo.projectId"
          class="tag tag--project"
        >
          {{ projectOfThisTodo?.name }}
        </li>
        <li
          v-for="labelId in todo.labelIds"
          :key="labelId"
          class="tag tag--label"
        >
          {{ labels.find((l) => l.id === labelId)?.name }}
        </li>
      </ul>
    </section>
  </div>
</template>

<script lang="ts" setup>
import type { LabelSaved } from "~/assets/models/label";
import type { ProjectSaved } from "~/assets/models/project";
import type { TodoSaved } from "~/assets/models/todo/todo";

type Props = {
  todo: TodoSaved;
  projects: ProjectSaved[];
  labels: LabelSaved[];
};
export type { Props as ElTodoProps };
const props = defineProps<Props>();

const projectOfThisTodo = computed(() => {
  return props.projects.find((p) => p.id === props.todo.projectId);
});
</script>

<style scoped>
.tag {
  @apply whitespace-nowrap rounded-full px-2 text-sm;
}
.tag--project {
  @apply bg-blue-500 text-white;
}
.tag--label {
  @apply bg-amber-500 text-white;
}
</style>

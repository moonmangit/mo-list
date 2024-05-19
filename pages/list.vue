<template>
  <div>
    <section class="pb-[150px]">
      <!-- Priority -->
      <template v-if="query.view === 'priority'">
        <ul class="space-y-4">
          <li
            v-for="(tg, tgk) in priorityViewTodos"
            :key="tgk"
            class="space-y-2"
          >
            <ElNameSection
              :title="priorityLabels[tgk]"
              class="w-full"
              always-open
              :hide-content="tg.length === 0"
            >
              <TransitionGroup
                name="list"
                tag="ul"
                class="space-y-3"
              >
                <ElTodo
                  v-for="todo in tg"
                  :key="todo.id"
                  :todo="todo"
                  :projects="injected?.data.value?.projects || []"
                  :labels="injected?.data.value?.labels || []"
                  @click="toggleTodoJob(todo.id)"
                />
              </TransitionGroup>
            </ElNameSection>
          </li>
        </ul>
      </template>
      <!-- Calendar -->
      <template v-else-if="query.view === 'calendar'"></template>
      <!-- Normal View -->
      <template v-else>
        <TransitionGroup
          name="list"
          tag="ul"
          class="space-y-3"
        >
          <ElTodo
            v-for="todo in filteredTodos"
            :key="todo.id"
            :todo="todo"
            :projects="injected?.data.value?.projects || []"
            :labels="injected?.data.value?.labels || []"
            @click="toggleTodoJob(todo.id)"
          ></ElTodo>
        </TransitionGroup>
      </template>
    </section>

    <PartPageListToolsBar
      :query="query"
      :update-jobs="updateStatusJobs"
      @change-view="changeView($event)"
      @after-submit="injected?.refresh()"
      @revert="revertJobs()"
      @after-update="afterUpdate()"
    />
  </div>
</template>

<script lang="ts" setup>
import type { TodoSaved } from "~/assets/models/todo/todo";
import type { UpdateJob } from "~/components/part/page/list/ToolsBar.vue";
import type { Provide as LayoutDefaultProvide } from "~/layouts/default.vue";

definePageMeta({
  validate({ query }) {
    const view = (query as any).view;
    const status = (query as any).status;
    if (view) {
      return ["calendar", "priority"].includes(view);
    }
    if (status) {
      return ["todo", "doing", "done"].includes(status);
    }
    return true;
  },
});

const injected = inject<LayoutDefaultProvide>("layout");
const todos = computed(() => {
  return injected?.data.value?.todos || [];
});
const filteredTodos = computed(() => {
  return todos.value
    .filter((todo) => {
      if (query.value.status && todo.status !== query.value.status)
        return false;
      if (query.value.label && !todo.labelIds.includes(query.value.label))
        return false;
      if (query.value.project && todo.projectId !== query.value.project)
        return false;
      return true;
    })
    .toSorted((a, b) => {
      // By status following 'todo', 'doing', 'done' and due date
      const statusOrder = ["todo", "doing", "done"];
      const statusA = statusOrder.indexOf(a.status);
      const statusB = statusOrder.indexOf(b.status);
      if (statusA !== statusB) return statusA - statusB;
      if (a.dueDate && b.dueDate)
        return Date.parse(a.dueDate) - Date.parse(b.dueDate);
      return 0;
    });
});
const updateStatusJobs = ref<UpdateJob[]>([]);
function toggleTodoJob(todoId: string) {
  const todoIndex = injected?.data.value?.todos.findIndex(
    (t) => t.id === todoId,
  );
  if (todoIndex === -1) return;
  const todo = injected?.data.value?.todos[todoIndex!];
  if (!todo) return;
  todo.status = todo.status === "done" ? "todo" : "done";
  // Update jobs if already exist in the list remove it
  const jobIndex = updateStatusJobs.value.findIndex((j) => j.tid === todoId);
  if (jobIndex !== -1) {
    updateStatusJobs.value.splice(jobIndex, 1);
  } else {
    updateStatusJobs.value.push({
      tid: todoId,
      title: todo.name,
      from: todo.status === "done" ? "todo" : "done",
      to: todo.status,
    });
  }
  // Disabled back to dashboard
  injected.disabledBackToDashboard.value = updateStatusJobs.value.length > 0;
}
function revertJobs() {
  updateStatusJobs.value.forEach((job) => {
    const todoIndex = injected?.data.value?.todos.findIndex(
      (t) => t.id === job.tid,
    );
    if (todoIndex === -1) return;
    const todo = injected?.data.value?.todos[todoIndex!];
    if (!todo) return;
    todo.status = job.from;
  });
  updateStatusJobs.value = [];
  if (injected) {
    injected.disabledBackToDashboard.value = false;
  }
}
function afterUpdate() {
  updateStatusJobs.value = [];
  if (injected) {
    injected.disabledBackToDashboard.value = false;
    injected.refresh();
  }
}

// Priority View
type Priorities = "today" | "tomorrow" | "thisWeek" | "nextWeek" | "upcoming";
const priorityLabels: Record<Priorities, string> = {
  today: "Today",
  tomorrow: "Tomorrow",
  thisWeek: "This Week",
  nextWeek: "Next Week",
  upcoming: "Upcoming",
};
const priorityViewTodos = computed<Record<Priorities, TodoSaved[]>>(() => {
  const today: TodoSaved[] = [];
  const tomorrow: TodoSaved[] = [];
  const thisWeek: TodoSaved[] = [];
  const nextWeek: TodoSaved[] = [];
  const upcoming: TodoSaved[] = [];
  const now = new Date();
  const todayDate = new Date(now);
  todayDate.setHours(0, 0, 0, 0);
  const tomorrowDate = new Date(todayDate);
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const thisWeekDate = new Date(todayDate);
  thisWeekDate.setDate(thisWeekDate.getDate() + (1 - thisWeekDate.getDay()));
  const nextWeekDate = new Date(thisWeekDate);
  nextWeekDate.setDate(nextWeekDate.getDate() + 7);
  todos.value.forEach((todo) => {
    if (todo.dueDate) {
      const dueDate = new Date(todo.dueDate);
      if (dueDate < todayDate) {
        today.push(todo);
      } else if (dueDate < tomorrowDate) {
        tomorrow.push(todo);
      } else if (dueDate < thisWeekDate) {
        thisWeek.push(todo);
      } else if (dueDate < nextWeekDate) {
        nextWeek.push(todo);
      } else {
        upcoming.push(todo);
      }
    } else {
      upcoming.push(todo);
    }
  });
  // sort each priority by status following 'todo', 'doing', 'done'
  const statusOrder = ["todo", "doing", "done"];
  [today, tomorrow, thisWeek, nextWeek, upcoming].forEach((priority) => {
    priority.sort((a, b) => {
      const statusA = statusOrder.indexOf(a.status);
      const statusB = statusOrder.indexOf(b.status);
      if (statusA !== statusB) return statusA - statusB;
      if (a.dueDate && b.dueDate)
        return Date.parse(a.dueDate) - Date.parse(b.dueDate);
      return 0;
    });
  });
  return { today, tomorrow, thisWeek, nextWeek, upcoming };
});

// Query
const route = useRoute();
type ListQuery = {
  view?: "calendar" | "priority";
  status?: "todo" | "doing" | "done";
  label?: string;
  project?: string;
};
const query = ref<ListQuery>({
  view: route.query.view as any,
  status: route.query.status as any,
  label: route.query.label as any,
  project: route.query.project as any,
});

function changeView(view: ListQuery["view"]) {
  if (query.value.view === "priority") return;

  query.value.view = view;
  navigateTo({ query: query.value });
}

export type { ListQuery };
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

/* Normal List */
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.list-leave-active {
  position: absolute;
}

/* List no done */
.list-no-done-move,
.list-no-done-enter-active,
.list-no-done-leave-active {
  transition: all 0.5s ease;
}
.list-no-done-enter-from,
.list-no-done-leave-to {
  opacity: 0;
}
.list-no-done-leave-active {
  position: absolute;
}
</style>

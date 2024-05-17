<template>
  <div>
    <section>
      <ul class="space-y-3">
        <li
          v-for="i in 10"
          :key="i"
          class="flex gap-x-4 rounded-xl bg-white p-4"
        >
          <input
            type="radio"
            name="fav_language"
            value="HTML"
          />
          <section>
            <h1>Todo title</h1>
            <p class="text-xs">Lorem ipsum dolor sit amet.</p>
          </section>
          <section></section>
        </li>
      </ul>
    </section>
    <PartPageListToolsBar
      :query="query"
      @change-view="changeView($event)"
      @after-submit="injected?.refresh()"
    />
  </div>
</template>

<script lang="ts" setup>
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
  query.value.view = view;
  navigateTo({ query: query.value });
}

export type { ListQuery };
</script>

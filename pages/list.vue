<template>
  <div>
    <PartPageListToolsBar
      :query="query"
      @change-view="changeView($event)"
    />
  </div>
</template>

<script lang="ts" setup>
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

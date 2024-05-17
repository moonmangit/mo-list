<template>
  <div class="this space-y-5">
    <section class="grid grid-cols-3 gap-2">
      <PartPageDashboardButtonProduct
        title="List"
        icon-name="line-md:check-list-3-filled"
        @click.prevent="navigateTo('/list')"
      />
      <PartPageDashboardButtonProduct
        title="calendar"
        icon-name="line-md:calendar"
        @click.prevent="navigateTo('/list?view=calendar')"
      />
      <PartPageDashboardButtonProduct
        title="Priority"
        icon-name="line-md:list-indented"
        @click.prevent="navigateTo('/list?view=priority')"
      />
    </section>
    <PartPageDashboardProjectSection
      :projects="injected.data.value?.projects || []"
      @after-submit="injected.refresh()"
    />
    <PartPageDashboardLabelSection
      :labels="injected.data.value?.labels || []"
      @after-submit="injected.refresh()"
    />
    <PartPageDashboardStatusSection />
  </div>
</template>

<script lang="ts" setup>
import type { Provide as LayoutDefaultProvide } from "~/layouts/default.vue";

const injected = inject<LayoutDefaultProvide>("layout")!;
</script>

<style scoped>
.this:deep(.project-card) {
  @apply w-full rounded-xl border bg-white p-5 px-7 text-lg duration-300;
}
</style>

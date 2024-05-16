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
      :after-close="() => {}"
    >
      <form class="flex flex-col gap-y-4">
        <section class="flex items-center gap-x-2">
          <input
            type="text"
            class="h-full w-full flex-1 py-5 text-xl outline-none"
            placeholder="What's need to be done ?"
          />
          <button
            class="block aspect-square size-14 rounded-full bg-primary text-xl text-white"
            @click="active = false"
          >
            <Icon name="solar:map-arrow-right-bold"></Icon>
          </button>
        </section>
        <section>Project</section>
        <section>Label</section>
        <section>Due Date</section>
      </form>
    </AppBottomDrawer>
  </div>
</template>

<script lang="ts" setup>
import type { ListQuery } from "~/pages/list.vue";

defineProps<{
  query: ListQuery;
}>();
defineEmits<{
  (e: "changeView", view?: ListQuery["view"]): void;
}>();

const active = ref(false);
</script>

<style scoped>
.controller-button {
  @apply text-4xl text-primary-content/30 duration-300;
  @apply hover:text-primary-content/50;

  &.exact-active {
    @apply text-primary;
  }
}
</style>

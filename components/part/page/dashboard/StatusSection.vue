<template>
  <div>
    <ElNameSection title="Status">
      <div>
        <ul class="flex flex-col gap-3">
          <li
            v-for="(config, status) in statusConfig"
            :key="status"
            class="h-full"
          >
            <button
              class="project-card group"
              @click.prevent="navigateTo(`/list?status=${status}`)"
            >
              <AppContentWithIcon
                :content="`mdi:circle|${config.label}|mdi:chevron-right`"
                class="gap-x-4"
                :classes="[
                  config.colorClass,
                  '',
                  'ml-auto group-hover:translate-x-2 duration-300',
                ]"
              />
            </button>
          </li>
        </ul>
      </div>
    </ElNameSection>
  </div>
</template>

<script lang="ts" setup>
type Status = "todo" | "done";
const statusConfig: Record<
  Status,
  {
    label: string;
    colorClass: string;
  }
> = {
  todo: {
    label: "To Do",
    colorClass: "text-red-500",
  },
  done: {
    label: "Done",
    colorClass: "text-blue-500",
  },
};
</script>

<style></style>

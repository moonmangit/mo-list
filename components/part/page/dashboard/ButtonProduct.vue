<template>
  <button
    class="group aspect-square space-y-3 rounded-xl border bg-white duration-300 hover:-translate-y-1"
  >
    <p class="text-lg font-bold capitalize">{{ title }}</p>
    <Icon
      :name="iconName"
      class="text-4xl text-primary"
    />
  </button>
</template>

<script lang="ts" setup>
defineProps<{
  title: string;
  iconName: string;
}>();
</script>

<style></style>

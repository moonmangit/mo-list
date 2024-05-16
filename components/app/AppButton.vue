<template>
  <button class="btn">
    <AppContentWithIcon
      class="gap-x-2"
      :content="content"
    />
  </button>
</template>

<script lang="ts" setup>
defineProps<{
  content: string;
}>();
</script>

<style></style>

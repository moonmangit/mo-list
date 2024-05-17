<template>
  <div class="group">
    <section class="label">
      <AppContentWithIcon
        :content="title"
        :classes="titleClasses"
      />
    </section>
    <slot></slot>
    <section
      v-if="error"
      class="label !text-error"
    >
      <AppContentWithIcon
        :content="error"
        :classes="errorClasses"
      />
    </section>
  </div>
</template>

<script lang="ts" setup>
type Props = {
  title: string;
  titleClasses?: string[];
  error?: string;
  errorClasses?: string[];
};

defineProps<Props>();

export type { Props as AppInputGroupProps };
</script>

<style scoped>
section.label {
  @apply text-sm text-neutral/70;
}
</style>

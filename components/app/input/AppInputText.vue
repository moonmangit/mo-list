<template>
  <AppInputGroup
    :title="$props.title"
    :error="$props.error"
    :title-classes="$props.titleClasses"
    :error-classes="$props.errorClasses"
  >
    <input
      v-model="modelValue"
      :type="type"
      :class="[$props.class, 'w-full']"
      v-bind="$attrs"
      :title="$props.description"
    />
  </AppInputGroup>
</template>

<script lang="ts" setup>
import type { InputHTMLAttributes } from "vue";
import type { AppInputGroupProps } from "./AppInputGroup.vue";

const modelValue = defineModel<string>({
  required: true,
});

type Props = AppInputGroupProps & {
  type: InputHTMLAttributes["type"];
  class?: string;
  description?: string;
};

defineProps<Props>();

export type { Props as AppInputTextProps };
</script>

<style></style>

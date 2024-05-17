<template>
  <ul class="pills">
    <li
      v-for="opt in options"
      :key="getKey(opt)"
      class="pills__wrapper"
    >
      <button
        class="pills__item"
        :class="{ active: isActive(opt) }"
        @click.prevent="select(opt)"
      >
        {{ getLabel(opt) }}
      </button>
    </li>
  </ul>
</template>

<script lang="ts" setup generic="Option extends {}">
const modelValue = defineModel<string | string[]>({
  required: true,
});
const props = defineProps<{
  options: Option[];
  getKey: (option: Option) => string;
  getLabel: (option: Option) => string;
  max?: number;
}>();

function select(opt: Option) {
  if (Array.isArray(modelValue.value)) {
    if (modelValue.value.includes(props.getKey(opt))) {
      modelValue.value = modelValue.value.filter(
        (v) => v !== props.getKey(opt),
      );
    } else {
      if (props.max && modelValue.value.length >= props.max) {
        return;
      }
      modelValue.value = [...modelValue.value, props.getKey(opt)];
    }
  } else {
    // Togglable
    modelValue.value =
      modelValue.value === props.getKey(opt) ? "" : props.getKey(opt);
  }
}

function isActive(opt: Option) {
  // Resovle active state by findIndex
  return Array.isArray(modelValue.value)
    ? modelValue.value.includes(props.getKey(opt))
    : modelValue.value === props.getKey(opt);
}
</script>

<style scoped>
.pills {
  @apply flex flex-wrap gap-2;
}
.pills__wrapper {
  @apply flex-1 basis-[70px];
}
.pills__item {
  @apply w-full whitespace-nowrap rounded-full border border-primary bg-transparent p-2 px-3 text-primary duration-300;
  @apply hover:bg-primary/20;
  @apply [&.active]:bg-primary [&.active]:text-white;
}
</style>

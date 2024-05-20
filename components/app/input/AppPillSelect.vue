<template>
  <ul class="pills">
    <li
      v-for="opt in filteredOptions"
      :key="getKey(opt)"
      class="pills__wrapper"
      :class="{
        disabled: disabledKeys?.includes(getKey(opt)),
      }"
    >
      <button
        class="pills__item"
        :class="{ active: isActive(opt) }"
        @click.prevent="select(opt)"
      >
        {{ getLabel(opt) }}
      </button>
    </li>
    <li
      v-if="filteredOptions.length === 0"
      class="text-neutral-400"
    >
      Nothing to select please create one
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
  disabledKeys?: string[];
  hideKeys?: string[];
}>();

const filteredOptions = computed(() =>
  props.options.filter((opt) => !props.hideKeys?.includes(props.getKey(opt))),
);

function select(opt: Option) {
  if (props.disabledKeys?.includes(props.getKey(opt))) {
    return;
  }

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
  @apply flex flex-wrap items-center gap-2;
}

.pills__wrapper.disabled {
  @apply pointer-events-none opacity-50;
}

.pills__item {
  @apply w-full whitespace-nowrap rounded-full border border-primary bg-transparent p-2 px-3 text-primary duration-300;
  @apply hover:bg-primary/20;
  @apply [&.active]:bg-primary [&.active]:text-white;
}
</style>

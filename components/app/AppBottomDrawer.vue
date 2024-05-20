<template>
  <div
    class="fixed inset-0 z-30 !m-0 flex items-center justify-center duration-300"
    :class="{
      'pointer-events-auto bg-black/70 backdrop-blur-sm ': modelValue,
      'pointer-events-none bg-transparent delay-300': !modelValue,
    }"
  >
    <div
      class="fixed inset-x-0 bottom-0 rounded-b-none rounded-t-2xl bg-white p-8 duration-300 md:inset-x-auto md:bottom-auto md:w-[min(600px,90dvw)] md:rounded-b-2xl"
      :class="{
        'translate-y-0 delay-300 md:opacity-100': modelValue,
        'translate-y-full md:translate-y-5 md:opacity-0 ': !modelValue,
      }"
    >
      <button
        v-if="afterClose"
        class="absolute bottom-[calc(100%+1rem)] right-4 size-10 rounded-full bg-white text-xl duration-700 md:right-0"
        :class="{
          'translate-y-0 opacity-100 delay-300': modelValue,
          'translate-y-10 opacity-0': !modelValue,
        }"
        @click="close()"
      >
        <Icon
          name="mdi:close"
          class="text-xl"
        ></Icon>
      </button>
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
const modelValue = defineModel<boolean>({
  required: true,
});

const props = defineProps<{
  afterClose?: () => void;
}>();

function close() {
  modelValue.value = false;
  nextTick(() => {
    props.afterClose?.();
  });
}
</script>

<style></style>

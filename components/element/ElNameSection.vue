<template>
  <section class="mb-4 block">
    <div class="flex items-center justify-between">
      <section class="text-lg font-bold">{{ title }}</section>
      <section class="space-x-2">
        <AppButton
          v-for="(act, actKey) in actions"
          :key="actKey"
          :content="(act as any).icon"
          class="btn-circle btn-ghost text-2xl"
          @click.prevent="(act as any).action()"
        />
        <AppButton
          v-if="!alwaysOpen"
          class="btn-circle btn-ghost text-2xl duration-300"
          content="mdi:chevron-down"
          :class="{
            'rotate-180': collapse,
            'rotate-0': !collapse,
          }"
          @click.prevent="collapse = !collapse"
        ></AppButton>
      </section>
    </div>
    <div
      v-if="!hideContent"
      class="overflow-hidden duration-500"
      :class="{
        'max-h-0 py-0': collapse && !alwaysOpen,
        'max-h-[500px] py-4 pt-2': !collapse || alwaysOpen,
      }"
    >
      <slot></slot>
    </div>
  </section>
</template>

<script lang="ts" setup generic="Action extends {}">
defineProps<{
  title: string;
  actions?: Record<
    keyof Action,
    {
      icon: string;
      action: () => void;
    }
  >;
  alwaysOpen?: boolean;
  hideContent?: boolean;
}>();

const collapse = ref(false);
</script>

<style scoped></style>

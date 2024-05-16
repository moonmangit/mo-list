<template>
  <span
    v-if="contents"
    class="flex flex-wrap items-center"
  >
    <template
      v-for="(ctn, i) in contents"
      :key="ctn.id"
    >
      <Icon
        v-if="isIcon(ctn)"
        :name="ctn.value"
        :class="classes?.[i]"
      />
      <span
        v-else
        :class="classes?.[i]"
        >{{ ctn.value }}</span
      >
    </template>
  </span>
</template>

<script lang="ts" setup>
const props = defineProps<{
  content: string;
  classes?: string[];
}>();

type ProcessedContent = {
  id: string;
  value: string;
};
const contents = computed<ProcessedContent[]>(() => {
  const splited = props.content.split("|");
  return splited.map((value) => ({
    id: randomStr(5),
    value,
  }));
});
const isIcon = computed(() => (ctn: ProcessedContent) => {
  const iconSets = ["solar", "mdi"];
  return iconSets.some((iconSet) => ctn.value.startsWith(`${iconSet}:`));
});
</script>

<style></style>

<template>
  <Transition name="fade">
    <div
      v-if="active"
      class="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 backdrop-blur-sm"
    >
      <div class="loader"></div>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
defineProps<{
  active: boolean;
}>();
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.loader {
  width: 50px;
  aspect-ratio: 1;
  border-radius: 50%;
  border: 8px solid #0000;
  border-right-color: oklch(var(--p) / 0.8);
  position: relative;
  animation: l24 1s infinite linear;
}
.loader:before,
.loader:after {
  content: "";
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  border: inherit;
  animation: inherit;
  animation-duration: 2s;
}
.loader:after {
  animation-duration: 4s;
}
@keyframes l24 {
  100% {
    transform: rotate(1turn);
  }
}
</style>

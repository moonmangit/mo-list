<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <ElBlockLoading :active="useBlockLoadingStore().$state.active" />
  </div>
</template>

<script lang="ts" setup>
useSeoMeta({
  title: "To-Do List App | Stay Organized and Productive",
  description:
    "Get the best to-do list app to manage tasks efficiently. Boost productivity and achieve your goals effortlessly.",
  ogTitle: "To-Do List App | Stay Organized and Productive",
  ogDescription:
    "Discover the best to-do list app designed to keep you organized and on track. Manage your tasks with ease and boost your productivity.",
  ogImage: "/favicon.png",
  ogUrl: "https://example.com/todolistapp",
  twitterTitle: "To-Do List App | Stay Organized and Productive",
  twitterDescription:
    "Efficiently manage your tasks and stay productive with the best to-do list app. Achieve goals and more.",
  twitterImage: "/favicon.png",
  twitterCard: "summary",
});

useHead({
  htmlAttrs: {
    lang: "en",
  },
  link: [
    {
      rel: "icon",
      type: "image/png",
      href: "/favicon.png",
    },
  ],
});
</script>

<style>
.page-enter-active,
.page-leave-active {
  @apply duration-300;
}
.page-enter-from,
.page-leave-to {
  @apply opacity-0;
}
</style>

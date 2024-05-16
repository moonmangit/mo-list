<template>
  <div class="min-h-screen bg-primary-content/5">
    <section
      class="sticky top-0 z-20 space-y-2 overflow-hidden bg-primary p-4 text-primary-content"
    >
      <div class="mx-auto flex max-w-[500px] justify-between">
        <button
          class="duration-2 group z-10 space-x-2 rounded-full bg-white/60 p-2 px-4 text-primary-content duration-300 hover:bg-white"
          @click="navigateTo('/dashboard')"
        >
          <Icon
            name="eva:chevron-left-fill"
            class="iblock-lg text-2xl"
          />
          <span class="iblock-lg">to Dashboard</span>
          <Icon
            name="eva:grid-fill"
            class="text-2xl"
          />
        </button>
        <button
          class="w-fit rounded-full bg-white/50 p-2 text-primary-content duration-300 hover:bg-white/100"
        >
          <Icon
            name="eva:more-horizontal-fill"
            class="text-2xl"
          />
        </button>
      </div>
      <div class="relative mx-auto max-w-[500px]">
        <p class="text-sm text-primary-content/70">Sunday, 1 Mar 24</p>
        <h1 class="text-xl capitalize text-white">{{ $route.name }}</h1>
        <div
          class="absolute -left-[120px] -top-4 aspect-square w-[300px] rounded-full bg-primary-content/10"
        ></div>
      </div>
    </section>
    <div class="mx-auto max-w-[500px] p-4">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style></style>

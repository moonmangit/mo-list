<template>
  <div class="flex h-screen w-screen items-center justify-center bg-white">
    <div class="space-y-8 p-8 text-center">
      <section>
        <div class="relative flex flex-col items-center p-2">
          <Icon
            name="solar:chat-square-check-bold"
            class="text-primary text-8xl"
          />
        </div>
        <h1 class="font-bold capitalize">Let's get started !</h1>
      </section>
      <form
        class="flex w-[min(300px,90dvw)] flex-col gap-3"
        @submit.prevent=""
      >
        <AppInputText
          v-model="email"
          title="Email"
          type="email"
          placeholder="Email"
          class="input input-primary"
        />
        <AppInputText
          v-model="email"
          title="Password"
          type="password"
          placeholder="Password"
          class="input input-primary"
        />
      </form>
      <section class="px-5">
        <AppButton
          class="btn-primary btn-block rounded-full"
          content="Sign up"
        />
      </section>
      <p>or Log in with</p>
      <section class="space-x-5">
        <button class="text-4xl">
          <Icon name="logos:facebook"></Icon>
        </button>
        <button class="text-4xl">
          <Icon name="logos:google-icon"></Icon>
        </button>
        <button class="text-4xl">
          <Icon name="logos:apple"></Icon>
        </button>
      </section>
      <p class="inline-block pt-8">
        Already have an account ?
        <NuxtLink
          to="/login"
          class="text-primary underline"
        >
          login
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: false,
});

const email = ref("");
</script>

<style></style>

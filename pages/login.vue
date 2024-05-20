<template>
  <div class="flex h-screen w-screen items-center justify-center bg-white">
    <div class="space-y-8 p-8 text-center">
      <section>
        <div class="relative flex flex-col items-center p-2">
          <Icon
            name="solar:chat-square-check-bold"
            class="text-8xl text-primary"
          />
        </div>
        <h1 class="font-bold capitalize">welcome back !</h1>
      </section>
      <form
        class="flex w-[min(300px,90dvw)] flex-col gap-3"
        @submit.prevent="submit()"
      >
        <AppInputText
          v-model="form.defineField('email')[0].value!"
          title="Email"
          type="email"
          placeholder="Email"
          class="input input-primary"
          :error="form.errors.value.email"
        />
        <AppInputText
          v-model="form.defineField('password')[0].value!"
          title="Password"
          type="password"
          placeholder="Password"
          class="input input-primary"
          :error="form.errors.value.password"
        />
        <section class="mt-4 px-5">
          <AppButton
            class="btn-primary btn-block rounded-full"
            content="Log in"
            type="submit"
          />
        </section>
      </form>
      <p>or Log in with</p>
      <section class="space-x-5">
        <button
          class="text-4xl"
          @click.prevent="withFacebook()"
        >
          <Icon name="logos:facebook"></Icon>
        </button>
        <button
          class="text-4xl"
          type="button"
          @click.prevent="withGoogle()"
        >
          <Icon name="logos:google-icon"></Icon>
        </button>
        <button
          class="text-4xl"
          type="button"
          @click.prevent="withGithub()"
        >
          <Icon name="logos:git-icon"></Icon>
        </button>
      </section>
      <p class="inline-block pt-8">
        Don't have an account yet ?
        <NuxtLink
          to="/register"
          class="text-primary underline"
          >Register</NuxtLink
        >
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { object, string } from "yup";

definePageMeta({
  layout: false,
});

const form = useForm({
  validationSchema: toTypedSchema(
    object({
      email: string().email().required(),
      password: string().required(),
    }),
  ),
  initialValues: {
    email: "",
    password: "",
  },
});
const submit = form.handleSubmit(async (values) => {
  await callWith(
    async () => {
      await useAuthStore().logInWithEmailPassword(
        values.email,
        values.password,
      );
    },
    {
      loading: true,
    },
  );
});
async function withGoogle() {
  await callWith(
    async () => {
      await useAuthStore().logInWithGoogle();
    },
    {
      loading: true,
    },
  );
}
async function withFacebook() {
  await callWith(
    async () => {
      await useAuthStore().logInWithFacebook();
    },
    {
      loading: true,
    },
  );
}
async function withGithub() {
  await callWith(
    async () => {
      await useAuthStore().logInWithGithub();
    },
    {
      loading: true,
    },
  );
}
</script>

<style></style>

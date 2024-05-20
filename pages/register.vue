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
        <h1 class="font-bold capitalize">Let's get started !</h1>
      </section>
      <form
        class="flex w-[min(300px,90dvw)] flex-col gap-3"
        @submit.prevent="register()"
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
          placeholder="●●●●●●●●"
          class="input input-primary"
          :error="form.errors.value.password"
        />
        <AppInputText
          v-model="form.defineField('rePassword')[0].value!"
          title="Re-enter Password"
          type="password"
          placeholder="●●●●●●●●"
          class="input input-primary"
          :error="form.errors.value.rePassword"
        />
        <section class="mt-4 px-5">
          <AppButton
            class="btn-primary btn-block rounded-full"
            content="Sign up"
          />
        </section>
      </form>
      <p>or Log in with</p>
      <section class="space-x-5">
        <button
          class="text-4xl"
          type="button"
          @click.prevent="withGoogle()"
        >
          <Icon name="logos:google-icon"></Icon>
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
import { createUserWithEmailAndPassword } from "firebase/auth";
import { object, string, ref as yupRef } from "yup";

definePageMeta({
  layout: false,
});

const form = useForm({
  validationSchema: toTypedSchema(
    object({
      email: string().email().required(),
      password: string().required(),
      rePassword: string().oneOf([yupRef("password")], "Passwords must match"),
    }),
  ),
  initialValues: {
    email: "",
    password: "",
  },
});

const register = form.handleSubmit((values) => {
  callWith(
    async () => {
      const { auth } = useNuxtApp().$fb;
      await createUserWithEmailAndPassword(auth, values.email, values.password);
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
</script>

<style></style>

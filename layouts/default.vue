<template>
  <div class="min-h-screen bg-primary-content/5">
    <!-- Navigator -->
    <section
      class="sticky top-0 z-20 space-y-2 bg-primary p-4 text-primary-content"
    >
      <div class="mx-auto flex max-w-[500px] justify-between">
        <!-- on List -->
        <template v-if="$route.path !== '/dashboard'">
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
        </template>
        <!-- on Dashboard -->
        <template v-else>
          <button
            class="relative"
            @click="openProfileMenu()"
          >
            <!-- Profile -->
            <section
              v-if="!useAuthStore().$state.data?.photoURL"
              class="relative z-[999] w-fit rounded-full p-2 text-primary-content duration-700"
              :class="{
                'bg-white': !profileMenuActive,
                'bg-transparent': profileMenuActive,
              }"
            >
              <Icon
                name="solar:user-bold-duotone"
                class="text-2xl"
              />
            </section>
            <div
              v-else
              class="relative z-[999]"
            >
              <img
                :src="useAuthStore().$state.data?.photoURL || ''"
                class="size-10 rounded-full object-cover"
                alt=""
              />
              <span
                class="absolute bottom-0 right-0 z-10 block size-3 rounded-full bg-error"
              />
            </div>
            <!-- Profile Menu -->
            <section
              ref="profileMenuEl"
              class="absolute -left-2 -top-2 z-[100] aspect-square max-h-[130px] rounded-[30px] bg-white duration-300"
              :class="{
                'w-[min(300px,calc(100dvw-2rem))] opacity-100':
                  profileMenuActive,
                'w-14 opacity-0': !profileMenuActive,
              }"
            >
              <div
                class="absolute left-14 right-0 top-0 flex h-14 flex-col items-start justify-center whitespace-nowrap text-left"
              >
                <h1>{{ useAuthStore().$state.data?.displayName }}</h1>
                <p class="w-full truncate pr-3 text-xs text-neutral/50">
                  {{ useAuthStore().$state.data?.email }}
                </p>
              </div>
              <div
                class="absolute inset-x-0 top-14 flex h-[calc(100%-3.5rem)] items-center justify-center px-5"
              >
                <AppButton
                  content="Sign out|mdi:logout"
                  class="btn-circle btn-ghost w-full duration-300"
                  :class="{
                    'opacity-0': !profileMenuActive,
                    'opacity-100': profileMenuActive,
                  }"
                  @click.prevent="logout()"
                />
              </div>
            </section>
            <!-- Profile Menu Backdrop -->
            <section
              class="pointer-events-none fixed inset-0 z-[90] bg-black/30 shadow-2xl backdrop-blur-sm duration-300"
              :class="{
                'opacity-0': !profileMenuActive,
                'opacity-100': profileMenuActive,
              }"
            ></section>
          </button>
          <button
            class="w-fit rounded-full bg-white/50 p-2 text-primary-content duration-300 hover:bg-white/100"
          >
            <Icon
              name="solar:asteroid-bold-duotone"
              class="text-2xl"
            />
          </button>
        </template>
      </div>
      <div class="relative mx-auto max-w-[500px]">
        <p class="text-sm text-primary-content/70">Sunday, 1 Mar 24</p>
        <h1 class="text-xl capitalize text-white">{{ pageTitle }}</h1>
      </div>
      <div class="absolute inset-0 !mt-0 overflow-hidden">
        <div class="absolute inset-0 mx-auto max-w-[500px]">
          <div
            class="absolute -left-[120px] -top-4 aspect-square w-[300px] rounded-full bg-primary-content/10"
          ></div>
        </div>
      </div>
    </section>
    <!-- View -->
    <div class="mx-auto max-w-[500px] p-4">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { doc, getDoc } from "firebase/firestore";
import type { UserDoc } from "~/assets/libs/user";

const { data, refresh } = useAsyncData<UserDoc>(async () => {
  const _data = (
    await getDoc(
      doc(useNuxtApp().$fb.db, `users/${useAuthStore().$state.data?.uid}`),
    )
  ).data() as any;

  return _data;
});
type Provide = {
  refresh: typeof refresh;
  data: typeof data;
};
provide<Provide>("layout", {
  refresh,
  data,
});
export type { Provide };

// Profile menu
const profileMenuActive = ref(false);
const profileMenuEl = ref<HTMLElement | null>(null);
onClickOutside(profileMenuEl, closeProfileMenu);
function openProfileMenu() {
  profileMenuActive.value = true;
}
function closeProfileMenu() {
  profileMenuActive.value = false;
}

// Logout
async function logout() {
  await useAuthStore().logout();
}

// Page title
const pageTitle = computed(() => {
  const { label, project } = useRoute().query;
  if (label) {
    return data.value?.labels.find((l) => l.id === label)?.name || "Label";
  } else if (project) {
    return (
      data.value?.projects.find((p) => p.id === project)?.name || "Project"
    );
  } else {
    return "List";
  }
});
</script>

<style scoped></style>

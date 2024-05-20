<template>
  <div class="min-h-screen bg-primary-content/5">
    <!-- Navigator -->
    <section
      class="sticky top-0 z-20 space-y-2 bg-primary p-4 text-primary-content"
    >
      <div class="mx-auto flex max-w-[500px] justify-between">
        <!-- on List Page -->
        <template v-if="$route.path !== '/dashboard'">
          <button
            class="duration-2 group z-10 space-x-2 rounded-full bg-white/60 p-2 px-4 text-primary-content duration-300 hover:bg-white"
            :class="{
              'pointer-events-none opacity-0': disabledBackToDashboard,
            }"
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
          <section class="space-x-4">
            <button
              v-if="$route.query.project || $route.query.label"
              class="relative z-10 w-fit rounded-full bg-white/50 p-2 text-primary-content duration-300 hover:bg-white/100"
              @click.prevent="deleteTag()"
            >
              <Icon
                name="solar:trash-bin-2-bold-duotone"
                class="text-2xl"
              />
            </button>
            <button
              class="relative z-10 w-fit rounded-full bg-white/50 p-2 text-primary-content duration-300 hover:bg-white/100"
              :class="{
                'pointer-events-none opacity-0': disabledBackToDashboard,
              }"
              @click.prevent="clearDoneTodos()"
            >
              <Icon
                name="solar:broom-bold-duotone"
                class="text-2xl"
              />
            </button>
          </section>
        </template>
        <!-- on Dashboard Page -->
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
                <h1 class="max-w-[20ch] truncate">
                  {{ useAuthStore().$state.data?.displayName }}
                </h1>
                <p class="max-w-[25ch] truncate pr-3 text-xs text-neutral/50">
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
              class="pointer-events-none fixed inset-0 z-[90] bg-black/70 shadow-2xl backdrop-blur-sm duration-300"
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
      <div
        class="relative mx-auto flex max-w-[500px] items-center justify-between"
      >
        <section>
          <p class="text-sm text-primary-content/70">
            {{
              new Date().toLocaleDateString("en-US", {
                weekday: "long",
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            }}
          </p>
          <h1 class="text-xl capitalize text-white">{{ pageTitle }}</h1>
        </section>
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
import { labelModel } from "~/assets/models/label";
import { projectModel } from "~/assets/models/project";
import { todoModel } from "~/assets/models/todo/todo";

const { data, refresh } = useAsyncData<UserDoc>("userdata", async () => {
  const _data = (
    await getDoc(
      doc(useNuxtApp().$fb.db, `users/${useAuthStore().$state.data?.uid}`),
    )
  ).data() as any;

  return _data;
});
const disabledBackToDashboard = ref(false);
type Provide = {
  refresh: typeof refresh;
  data: typeof data;
  disabledBackToDashboard: typeof disabledBackToDashboard;
};
provide<Provide>("layout", {
  refresh,
  data,
  disabledBackToDashboard,
});
export type { Provide };

// Delete
async function deleteTag() {
  if (!confirm("Are you sure you want to delete this?")) return;
  await callWith(
    async () => {
      const { project, label } = useRoute().query;
      if (project) {
        const toDeleteProject = data.value?.projects.find(
          (p) => p.id === project,
        );
        if (toDeleteProject) {
          await projectModel.delete(toDeleteProject);
        }
        await refresh();
        navigateTo("/dashboard");
      } else if (label) {
        const toDeleteLabel = data.value?.labels.find((l) => l.id === label);
        if (toDeleteLabel) {
          await labelModel.delete(toDeleteLabel);
        }
        await refresh();
        navigateTo("/dashboard");
      }
    },
    {
      loading: true,
    },
  );
}

// Clear
async function clearDoneTodos() {
  if (!confirm("Are you sure you want to clear all done todos?")) return;
  await callWith(
    async () => {
      const project = useRoute().query.project as string | undefined;
      await todoModel.clear(project);
      await refresh();
    },
    {
      loading: true,
    },
  );
}

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
  await callWith(
    async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await useAuthStore().logout();
    },
    {
      loading: true,
    },
  );
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

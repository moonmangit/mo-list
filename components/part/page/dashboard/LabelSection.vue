<template>
  <div>
    <ElNameSection
      title="Labels"
      :actions="{
        add: {
          icon: 'mdi:plus',
          action: () => {
            active = true;
          },
        },
      }"
    >
      <div>
        <ul class="space-y-3">
          <li
            v-for="label in ['2024', 'SelfDev', 'Subject', 'Shopping']"
            :key="label"
          >
            <button
              class="project-card group"
              @click.prevent="navigateTo(`/list?label=${label}`)"
            >
              <AppContentWithIcon
                :content="`${randomIn(['mdi:abacus', 'mdi:access-point', 'mdi:ab-testing'])}|${label}|mdi:chevron-right`"
                class="gap-x-4"
                :classes="[
                  randomIn([
                    'text-red-500',
                    'text-amber-500',
                    'text-emerald-500',
                    'text-blue-500',
                  ]),
                  '',
                  'ml-auto group-hover:translate-x-2 duration-300',
                ]"
              />
            </button>
          </li>
        </ul>
      </div>
    </ElNameSection>

    <!-- Dialog -->
    <AppBottomDrawer
      v-model="active"
      :after-close="() => {}"
    >
      <form class="flex items-center gap-x-2">
        <input
          type="text"
          class="h-full w-full flex-1 py-5 text-xl outline-none"
          placeholder="Label name ..."
        />
        <button
          class="block aspect-square size-14 rounded-full bg-primary text-xl text-white"
          @click="active = false"
        >
          <Icon name="solar:map-arrow-right-bold"></Icon>
        </button>
      </form>
    </AppBottomDrawer>
  </div>
</template>

<script lang="ts" setup>
const active = ref(false);
</script>

<style></style>

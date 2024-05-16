<template>
  <div>
    <ElNameSection
      title="Projects"
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
            v-for="project in ['E-commerce', 'Social Media', 'Shopping']"
            :key="project"
          >
            <button
              class="project-card group"
              @click.prevent="navigateTo(`/list?project=${project}`)"
            >
              <AppContentWithIcon
                :content="`${randomIn(['mdi:abacus', 'mdi:access-point', 'mdi:ab-testing'])}|${project}|mdi:chevron-right`"
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

    <!-- Project Dialog -->
    <AppBottomDrawer
      v-model="active"
      :after-close="() => {}"
    >
      <form class="flex items-center gap-x-2">
        <input
          type="text"
          class="h-full w-full flex-1 py-5 text-xl outline-none"
          placeholder="Project name ..."
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

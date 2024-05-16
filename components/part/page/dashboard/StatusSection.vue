<template>
  <div>
    <ElNameSection title="Status">
      <div>
        <ul class="flex flex-col gap-3">
          <li
            v-for="status in ['todo', 'doing', 'done']"
            :key="status"
            class="h-full"
          >
            <button
              class="project-card group"
              @click.prevent="navigateTo(`/list?status=${status}`)"
            >
              <AppContentWithIcon
                :content="`mdi:circle|${status}|mdi:chevron-right`"
                class="gap-x-4"
                :classes="[
                  randomIn([
                    'text-red-500',
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
  </div>
</template>

<script lang="ts" setup></script>

<style></style>

<script lang="ts" setup>
const rosemi = 'ROSEMI.GIF'
const socials = [...useSocial(), ...useSocial()]
const calculateRotation = (n: number) => (360 / socials.length) * (n + 1)

defineProps<{ show: boolean }>()
const showMenuItem = ref(false)
</script>

<template>
  <Transition
    @before-enter="showMenuItem = true"
    @before-leave="showMenuItem = false"
    name="header-menu"
  >
    <div
      v-show="show"
      class="header-menu fixed z-999 inset-0 backdrop-brightness-60 dark:backdrop-brightness-80"
    >
      <Body class="overflow-hidden" />
      <div class="absolute inset-0 flex items-center justify-center">
        <img
          @click="showMenuItem = !showMenuItem"
          class="absolute top-1/2 left-1/2 -m-24 h-48 w-48 md:(-m-32 h-64 w-64)"
          :src="rosemi"
          alt="ROSEMI"
        />
        <ul class="relative h-screen md:h-[calc(100%-64px)]">
          <template v-for="({ icon, url, title }, index) of socials">
            <Transition name="header-menu-item">
              <li
                v-if="showMenuItem"
                :style="{
                  transform: `rotate(${calculateRotation(
                    index
                  )}deg) translateX(var(--header-menu-item-radius)) rotate(${-calculateRotation(
                    index
                  )}deg)`,
                }"
                class="header-menu-item absolute top-1/2 left-1/2 -m-9 w-18 h-18 md:(-m-12 w-24 h-24)"
              >
                <NuxtLink
                  :title="title"
                  :to="url"
                  target="_blank"
                  class="inline-flex items-center justify-center w-18 h-18 md:(w-24 h-24) bg-body rounded-full hover:scale-90 children:hover:scale-120 dark:(shadow-cyan-2 children:hover:text-cyan-2)"
                >
                  <div :class="icon" class="w-9 h-9 md:(w-12 h-12)"></div>
                </NuxtLink>
              </li>
            </Transition>
          </template>
        </ul>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.header-menu {
  transition: transform 450ms cubic-bezier(0.08, 0.82, 0.17, 1),
    opacity 500ms var(--header-menu-opacity-fn, cubic-bezier(0.19, 1, 0.22, 1));
}

.header-menu-leave-active {
  --header-menu-opacity-fn: cubic-bezier(0.17, 0.84, 0.44, 1);
}

.header-menu-enter-from {
  opacity: 0;
  transform: scale(0.5);
}

.header-menu-leave-to {
  opacity: 0;
  transform: scale(1.5);
}

.header-menu-item {
  --header-menu-item-radius: 120px;
}

@media (min-width: 768px) {
  .header-menu-item {
    --header-menu-item-radius: 180px;
  }
}

.header-menu-item * {
  transition: transform 200ms cubic-bezier(0.645, 0.045, 0.355, 1),
    box-shadow 300ms cubic-bezier(0.79, 0.14, 0.15, 0.86);
}

.header-menu-item > *:hover {
  --box-shadow: 0px 0px 20px 10px var(--un-shadow-color, currentColor);
  -moz-box-shadow: var(--box-shadow);
  -webkit-box-shadow: var(--box-shadow);
  -ms-box-shadow: var(--box-shadow);
  box-shadow: var(--box-shadow);
}

.header-menu-item-enter-active,
.header-menu-item-leave-active {
  pointer-events: none;
  transition: opacity var(--header-menu-item-opacity-duration, 750ms)
      cubic-bezier(0.79, 0.14, 0.15, 0.86),
    transform var(--header-menu-item-transform-duration, 600ms)
      cubic-bezier(0.77, 0, 0.18, 1);
}

.header-menu-item-leave-active {
  --header-menu-item-opacity-duration: 300ms;
  --header-menu-item-transform-duration: 350ms;
}

.header-menu-item-enter-from,
.header-menu-item-leave-to {
  opacity: 0;
  transform: rotate(0deg) translateX(0) !important;
}
</style>

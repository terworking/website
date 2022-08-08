<script lang="ts" setup>
const socials = [...useSocial(), ...useSocial(), ...useSocial()]
const calculateRotation = (n: number) => (360 / socials.length) * (n + 1)

const rosemi = 'ROSEMI.GIF'
const showMenuItem = ref(false)
</script>

<template>
  <div
    class="fixed z-999 inset-0 backdrop-brightness-60 dark:backdrop-brightness-80"
  >
    <Body class="overflow-hidden" />
    <div class="absolute inset-0 flex items-center justify-center">
      <img
        @click="showMenuItem = !showMenuItem"
        class="absolute top-1/2 left-1/2 -m-24 h-48 w-48 md:-m-32 md:h-64 md:w-64"
        :src="rosemi"
        alt="ROSEMI"
      />
      <ul class="relative h-screen md:h-[calc(100%-64px)]">
        <template v-for="({ icon, url }, index) of socials">
          <Transition name="menu-item">
            <li
              v-if="showMenuItem"
              :style="{
                transform: `rotate(${calculateRotation(
                  index
                )}deg) translateX(var(--menu-item-radius)) rotate(${-calculateRotation(
                  index
                )}deg)`,
              }"
              class="menu-item absolute top-1/2 left-1/2 -m-9 w-18 h-18 md:-m-12 md:w-24 md:h-24"
            >
              <NuxtLink
                :to="url"
                target="_blank"
                class="inline-flex items-center justify-center w-18 h-18 md:w-24 md:h-24 space-x-2 bg-body rounded-full shadow-cyan-5 dark:shadow-cyan-2 hover:shadow-xl hover:scale-90 children:hover:scale-120 children:hover:text-cyan-5 dark:children:hover:text-cyan-2"
              >
                <div :class="icon" class="w-9 h-9 md:w-12 md:h-12"></div>
              </NuxtLink>
            </li>
          </Transition>
        </template>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.menu-item {
  --menu-item-radius: 120px;
  transition: var(--default-transition), opacity 300ms linear,
    transform 750ms cubic-bezier(0.19, 1, 0.22, 1);
}

@media (min-width: 768px) {
  .menu-item {
    --menu-item-radius: 180px;
  }
}

.menu-item * {
  transition: var(--default-transition),
    transform 200ms cubic-bezier(0.645, 0.045, 0.355, 1),
    box-shadow 300ms cubic-bezier(0.79, 0.14, 0.15, 0.86);
}

.menu-item-enter-active,
.menu-item-leave-active {
  pointer-events: none;
}

.menu-item-enter-from,
.menu-item-leave-to {
  opacity: 0;
  transform: rotate(0deg) translateX(0) !important;
}
</style>

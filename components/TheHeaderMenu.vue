<script lang="ts" setup>
const rosemi = 'ROSEMI.GIF'

defineProps<{ show: boolean }>()
const showMenuItem = ref(false)

const socials = useSocial()
const calculateRotation = (n: number) => (360 / socials.length) * (n + 1) + 56
const menuItemTransforms = computed(() =>
  Array.from({ length: socials.length }, (_, index) => {
    const rotation = calculateRotation(index)
    return `rotate(${rotation}deg) translateX(var(--header-menu-item-radius)) rotate(${-rotation}deg)`
  })
)

const headerMenu = ref<HTMLDivElement>()
const { elementX, elementY } = useMouseInElement(headerMenu, {
  touch: false,
})
const mouse = computed(() => {
  return { x: `${elementX.value}px`, y: `${elementY.value}px` }
})
</script>

<template>
  <Transition
    @before-enter="showMenuItem = true"
    @before-leave="showMenuItem = false"
    name="header-menu"
  >
    <div
      v-show="show"
      ref="headerMenu"
      class="header-menu fixed z-999 inset-0 backdrop-brightness-60 dark:backdrop-brightness-80"
    >
      <Body v-if="show" class="overflow-hidden" />
      <div
        :class="{
          active: $colorMode.value === 'dark' && (showMenuItem || show),
        }"
        class="flashlight-mask absolute inset-0 pointer-events-none"
      >
        <img
          @click="showMenuItem = !showMenuItem"
          class="absolute -z-1 absolute-center h-48 w-48 md:(h-64 w-64) pointer-events-auto"
          :src="rosemi"
          alt="ROSEMI"
          loading="lazy"
        />
        <ul>
          <li
            v-for="({ icon, url, title }, index) of socials"
            class="absolute absolute-center"
          >
            <Transition name="header-menu-item">
              <NuxtLink
                v-if="showMenuItem"
                :style="{ transform: menuItemTransforms[index] }"
                :title="title"
                :to="url"
                target="_blank"
                class="header-menu-item pointer-events-auto inline-flex items-center justify-center w-18 h-18 md:(w-24 h-24) bg-body shadow-current rounded-full hover:scale-90 children:hover:scale-120 dark:(text-cyan-2 shadow-cyan-2)"
              >
                <div
                  :class="icon"
                  class="header-menu-item w-9 h-9 md:(w-12 h-12)"
                ></div>
              </NuxtLink>
            </Transition>
          </li>
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

@media (min-width: 1024px) {
  .flashlight-mask::before {
    --at-apply: fixed w-full h-full;
    content: '';
    opacity: 0;
    transition: opacity 1500ms cubic-bezier(0.75, 0.5, 0.25, 1);
    background: radial-gradient(
      circle 30vmax at v-bind('mouse.x') v-bind('mouse.y'),
      rgba(255, 255, 255, 0.04) 16.6%,
      rgba(0, 0, 0, 0.76) 33.3%,
      rgba(0, 0, 0, 0.96) 66.7%
    );
  }

  .flashlight-mask.active::before {
    opacity: 1;
  }

  .header-menu-enter-from .flashlight-mask::before,
  .header-menu-leave-to .flashlight-mask::before {
    opacity: 0;
  }
}

.header-menu-item {
  --header-menu-item-radius: 120px;
}

@media (min-width: 768px) {
  .header-menu-item {
    --header-menu-item-radius: 180px;
  }
}

.header-menu-item {
  transition: transform 200ms cubic-bezier(0.645, 0.045, 0.355, 1),
    box-shadow 300ms cubic-bezier(0.79, 0.14, 0.15, 0.86);
}

.header-menu-item:hover,
.dark .header-menu-item {
  box-shadow: 0 0 var(--header-menu-item-shadow-blur, 20px)
    var(--header-menu-item-shadow-radius, 10px) var(--un-shadow-color);
}

.dark .header-menu-item:hover {
  --header-menu-item-shadow-blur: 160px;
  --header-menu-item-shadow-radius: 40px;
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

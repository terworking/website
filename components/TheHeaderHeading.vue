<script lang="ts" setup>
const {
  public: { headerHeading, headerParagraph },
} = useRuntimeConfig()

const show = ref(false)
onMounted(() => (show.value = true))
</script>

<template>
  <Transition name="header-heading">
    <div
      v-if="show"
      class="header-heading grid items-center absolute w-full px-1/16 top-3/4 bottom-0 font-semibold text-center md:(z-1 px-1/12 text-start text-cyan-2) pointer-events-none"
    >
      <div>
        <h1 class="text-3xl md:text-4xl">{{ headerHeading }}</h1>
        <p class="text-sm md:text-base">{{ headerParagraph }}</p>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.header-heading {
  transition: transform 750ms cubic-bezier(0.19, 1, 0.22, 1), opacity 500ms;
}

.header-heading-enter-from {
  opacity: 0.5;
  transform: scale(1.5);
}

@media (min-width: 768px) {
  .header-heading-enter-from {
    transform: translateX(250%);
  }

  .header-heading > * {
    text-shadow: 1px -1px 10px theme('colors.zinc.900'),
      -1px 1px 10px theme('colors.zinc.900');
  }
}
</style>

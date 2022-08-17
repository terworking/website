<script lang="ts" setup>
const {
  public: { headerHeading, headerParagraph },
} = useRuntimeConfig()
</script>

<template>
  <ClientOnly>
    <Transition appear name="header-heading">
      <div
        id="header-heading"
        class="absolute md:z-1 w-full px-1/16 md:px-1/12 top-4/5 text-center md:(text-start text-cyan-2) pointer-events-none"
      >
        <h1 class="text-3xl md:text-4xl">{{ headerHeading }}</h1>
        <p class="text-sm md:text-base">{{ headerParagraph }}</p>
      </div>
    </Transition>
  </ClientOnly>
</template>

<style scoped>
#header-heading {
  transition: transform 750ms cubic-bezier(0.19, 1, 0.22, 1), opacity 500ms;
}

.header-heading-enter-from {
  opacity: 0.5;
  transform: scale(1.5);
}

#header-heading > * {
  --at-apply: font-semibold;
}

@media (min-width: 768px) {
  .header-heading-enter-from {
    transform: translateX(250%);
  }

  #header-heading > * {
    text-shadow: 1px -1px 10px theme('colors.zinc.900'),
      -1px 1px 10px theme('colors.zinc.900');
  }
}
</style>

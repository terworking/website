<template>
  <main class="min-h-[calc(100vh-64px)]">
    <ClientOnly>
      <Transition appear name="default-layout-heading" mode="out-in">
        <h1
          :key="$route.path"
          class="py-6 lg:py-8 text-center font-semibold text-4xl md:text-5xl"
        >
          {{ $route.meta.title ?? 'Terworking' }}
        </h1>
      </Transition>
    </ClientOnly>
    <slot />
  </main>
</template>

<style scoped>
.default-layout-heading-enter-active {
  transition: transform 600ms cubic-bezier(0.19, 1, 0.22, 1);
}

.default-layout-heading-leave-active {
  transition: transform 200ms cubic-bezier(0.19, 1, 0.22, 1);
}

.default-layout-heading-enter-from {
  transform: rotate(12deg) translateX(-64px) translateY(-25%) scale(0);
}

.default-layout-heading-leave-to {
  transform: rotate(-12deg) translateX(64px) translateY(25%) scale(0);
}
</style>

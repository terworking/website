<template>
  <div>
    <ClientOnly>
      <Transition appear name="default-heading" mode="out-in">
        <h1
          :key="$route.path"
          class="default-heading py-6 lg:py-8 text-center font-semibold text-4xl md:text-5xl"
        >
          <slot name="heading" />
        </h1>
      </Transition>
    </ClientOnly>
    <Transition name="default-main" mode="out-in">
      <main :key="$route.path" class="default-main">
        <slot />
      </main>
    </Transition>
  </div>
</template>

<style scoped>
.default-heading-enter-active {
  transition: transform 600ms cubic-bezier(0.19, 1, 0.22, 1);
}

.default-heading-leave-active {
  transition: transform 200ms cubic-bezier(0.19, 1, 0.22, 1);
}

.default-heading-enter-from {
  transform: rotate(12deg) translateX(-64px) translateY(-25%) scale(0);
}

.default-heading-leave-to {
  transform: rotate(-12deg) translateX(64px) translateY(25%) scale(0);
}

.default-main {
  transition: opacity 200ms cubic-bezier(0.77, 0, 0.175, 1);
}

.default-main-enter-from,
.default-main-leave-to {
  opacity: 0;
}
</style>

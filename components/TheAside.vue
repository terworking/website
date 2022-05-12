<script setup lang="ts">
const aside = useAside();
const routes = useRoutes();
const socials = useTerworkingSocial();
</script>

<template>
  <aside class="fixed lg:static z-50 lg:z-0">
    <div class="h-full overflow-auto lg:overflow-visible pointer-events-none">
      <Transition name="fade">
        <div
          v-if="aside.visible"
          @click="aside.visible = false"
          class="lg:hidden fixed left-0 top-0 z-0 h-full w-full pointer-events-auto backdrop-filter backdrop-blur-sm"
        ></div>
      </Transition>
      <Transition name="slide-fade">
        <div
          v-if="aside.visible"
          class="lg:hidden fixed left-0 top-0 h-full w-72 bg-body border-r border-primary overflow-auto pointer-events-auto"
        >
          <div class="w-auto h-full overflow-auto">
            <div
              class="flex items-center justify-between h-$header-h w-full border-b border-primary sm:px-2"
            >
              <button
                aria-label="backButton"
                @click="aside.visible = false"
                class="i-tabler-arrow-left text-accent w-8 h-8"
              ></button>
              <div class="flex items-center justify-end">
                <template v-for="{ icon, kind, url } of socials">
                  <NuxtLink
                    class="text-accent"
                    :aria-label="`${kind.toLowerCase()}Link`"
                    :class="`i-${icon}`"
                    :to="url"
                    target="_blank"
                  />
                </template>
              </div>
            </div>
            <div
              class="flex flex-col border-b border-primary divide-y divide-black/10 dark:divide-white/10"
            >
              <template v-for="{ name, path } of routes" :key="path">
                <NuxtLink
                  class="list-disc capitalize font-bold text-lg p-3"
                  active-class="text-accent underline underline-dotted"
                  :to="path"
                >
                  {{ name }}
                </NuxtLink>
              </template>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </aside>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.3s ease-in-out, transform 0.5s ease-in-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
</style>

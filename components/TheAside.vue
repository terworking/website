<script setup lang="ts">
const aside = useAside();
const routes = useRoutes();
const { social } = useTerworking();
</script>

<template>
  <aside fixed z="50 lg:0" lg:static>
    <div h-full overflow="auto lg:visible" pointer-events-none>
      <Transition name="fade">
        <div
          v-if="aside.visible"
          @click="aside.visible = false"
          lg:hidden
          fixed
          left-0
          top-0
          z-0
          h-full
          w-full
          pointer-events-auto
          backdrop="filter blur-sm"
        ></div>
      </Transition>
      <Transition name="slide-fade">
        <div
          v-if="aside.visible"
          lg:hidden
          fixed
          left-0
          top-0
          h-full
          w-72
          bg-body
          border="r primary"
          overflow-auto
          pointer-events-auto
        >
          <div w-auto h-full overflow-auto>
            <div
              class="h-$header-h"
              flex
              items-center
              justify-between
              w-full
              border="b primary"
              sm:px-2
            >
              <button
                aria-label="backButton"
                @click="aside.visible = false"
                i-tabler-arrow-left
                text-accent
                w-8
                h-8
              ></button>
              <div flex items-center justify-end>
                <template v-for="{ icon, kind, url } of social">
                  <NuxtLink
                    text-accent
                    :aria-label="`${kind.toLowerCase()}Link`"
                    :class="`i-${icon}`"
                    :to="url"
                    target="_blank"
                  />
                </template>
              </div>
            </div>
            <div
              flex="~ col"
              border="b primary"
              divide="y black/10 dark:white/10"
            >
              <template v-for="{ name, path } of routes" :key="path">
                <NuxtLink
                  list-disc
                  capitalize
                  font-bold
                  text-lg
                  p-3
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

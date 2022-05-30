<script setup lang="ts">
const aside = useAside();
const routes = useRoutes();
const { social } = useTerworking();
</script>

<template>
  <aside fixed z="50 lg:0" lg:static>
    <div h-full overflow="auto lg:visible" pointer-events-none>
      <Transition name="aside-mask">
        <div
          v-if="aside.visible"
          lg:hidden
          fixed
          inset-0
          z-0
          pointer-events-auto
          backdrop="filter blur-sm"
          @click="aside.visible = false"
        ></div>
      </Transition>
      <Transition name="aside">
        <div
          v-if="aside.visible"
          lg:hidden
          fixed
          inset-0
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
                i-tabler-arrow-left
                text-accent
                w-8
                h-8
                @click="aside.visible = false"
              ></button>
              <div flex items-center justify-end>
                <template v-for="{ icon, kind, url } of social" :key="url">
                  <NuxtLink
                    text-accent
                    :aria-label="`${kind.toLowerCase()}Link`"
                    :class="icon"
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
.aside-mask-enter-active,
.aside-mask-leave-active {
  transition: opacity 0.5s ease;
}

.aside-mask-enter-from,
.aside-mask-leave-to {
  opacity: 0;
}

.aside-enter-active,
.aside-leave-active {
  transition: opacity 0.3s ease-in-out, transform 0.5s ease-in-out;
}

.aside-enter-from,
.aside-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
</style>

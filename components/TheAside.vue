<script setup lang="ts">
const aside = useAside();
const routes = useRoutes();
const { social } = useTerworking();
</script>

<template>
  <aside fixed z-100 lg:hidden>
    <div h-full overflow-auto>
      <Transition name="aside">
        <div
          v-if="aside.visible"
          id="aside-mask"
          fixed
          inset-0
          backdrop-blur-sm
          @click="aside.visible = false"
        >
          <Body overflow-hidden />
          <div
            id="aside"
            fixed
            inset-0
            w-72
            bg-body
            border="r primary"
            overflow-auto
          >
            <div w-auto h-full overflow-auto>
              <div
                class="h-$header-h"
                flex
                items-center
                justify-between
                w-full
                border="b primary"
                px-2
              >
                <button
                  aria-label="closeAside"
                  i-tabler-arrow-left
                  text-accent
                  w-8
                  h-8
                  @click="aside.visible = false"
                ></button>
                <div flex items-center>
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
              <nav
                flex="~ col"
                border="b primary"
                divide="y black/10 dark:white/10"
              >
                <template v-for="{ name, path } of routes" :key="path">
                  <NuxtLink
                    capitalize
                    font-bold
                    text-lg
                    p-3
                    :class="{
                      'text-accent underline underline-dotted':
                        $route.path === path ||
                        ($route.path.startsWith(path) && path !== '/'),
                    }"
                    :to="path"
                  >
                    {{ name }}
                  </NuxtLink>
                </template>
              </nav>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </aside>
</template>

<style scoped>
#aside-mask {
  transition-property: opacity;
  transition-timing-function: ease;
  transition-duration: 0.5s;
}

#aside {
  transition-property: opacity, transform;
  transition-timing-function: ease-in-out;
  transition-duration: 0.3s, 0.5s;
}

.aside-enter-from,
.aside-leave-to {
  opacity: 0;
}

.aside-enter-from #aside,
.aside-leave-to #aside {
  transform: translateX(-100%);
}
</style>

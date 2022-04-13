<script setup lang="ts">
import { Icon } from '@iconify/vue';
import IconArrowLeft from '@iconify-icons/tabler/arrow-left';
import IconGithub from '@iconify-icons/tabler/brand-github';
import IconInstagram from '@iconify-icons/tabler/brand-instagram';
import IconYoutube from '@iconify-icons/tabler/brand-youtube';

const aside = useAside();
const navigation = useNavigation();
const terworkingSocial = useTerworkingSocial();
</script>

<template>
  <aside class="fixed z-50 lg:z-0 lg:static">
    <div class="h-full overflow-auto pointer-events-none lg:overflow-visible">
      <Transition name="fade">
        <div
          v-if="aside.isOpen"
          @click="aside.isOpen = false"
          class="fixed top-0 left-0 z-0 w-full h-full pointer-events-auto backdrop-filter backdrop-blur-sm lg:hidden"
        ></div>
      </Transition>
      <Transition name="slide-fade">
        <div
          v-if="aside.isOpen"
          class="lg:hidden fixed top-0 left-0 h-full w-72 overflow-auto pointer-events-auto border-r border-slate-800/20 dark:border-white/20"
        >
          <div class="overflow-auto w-auto h-full bg-white dark:bg-slate-900">
            <div
              class="h-18 flex items-center justify-between w-full bg-neutral-50 dark:bg-gray-900 sm:px-2 border-b border-dashed border-slate-800/20 dark:border-white/20"
            >
              <button
                aria-label="backButton"
                @click="aside.isOpen = false"
                class="p-3"
              >
                <Icon :icon="IconArrowLeft" class="icon-btn w-8 h-8" />
              </button>
              <div class="flex items-center justify-end">
                <a
                  aria-label="githubLink"
                  :href="terworkingSocial.github"
                  rel="external nofollow noopener noreferrer"
                  target="_blank"
                  class="p-3"
                >
                  <Icon :icon="IconGithub" class="icon-btn" />
                </a>
                <a
                  aria-label="instagramLink"
                  :href="terworkingSocial.instagram"
                  rel="external nofollow noopener noreferrer"
                  target="_blank"
                  class="p-3"
                >
                  <Icon :icon="IconInstagram" class="icon-btn" />
                </a>
                <a
                  aria-label="youtubeLink"
                  :href="terworkingSocial.youtube"
                  rel="external nofollow noopener noreferrer"
                  target="_blank"
                  class="p-3"
                >
                  <Icon :icon="IconYoutube" class="icon-btn" />
                </a>
              </div>
            </div>
            <div
              class="grid divide-y divide-opacity-10 divide-slate-800/15 dark:divide-white/15 border-b border-opacity-10 border-slate-800/15 dark:border-white/15"
            >
              <template v-for="nav of navigation">
                <NuxtLink :to="nav.path">
                  <div class="p-3 font-bold text-lg">
                    {{ nav.name }}
                  </div>
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

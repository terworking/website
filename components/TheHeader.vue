<script setup lang="ts">
import { Icon } from '@iconify/vue';
import IconMenu from '@iconify-icons/tabler/align-justified';
import IconGithub from '@iconify-icons/tabler/brand-github';
import IconInstagram from '@iconify-icons/tabler/brand-instagram';
import IconYoutube from '@iconify-icons/tabler/brand-youtube';
import IconSun from '@iconify-icons/tabler/sun';
import IconMoon from '@iconify-icons/tabler/moon-stars';

const aside = useAside();
const navigation = useNavigation();
const terworkingSocial = useTerworkingSocial();

const colorMode = useColorMode();

const toggleColorMode = () => {
  if (colorMode.value === 'dark') {
    colorMode.preference = 'light';
  } else {
    colorMode.preference = 'dark';
  }
};
</script>

<template>
  <header
    class="h-18 sticky top-0 z-50 backdrop-blur-md border-b border-dashed border-slate-800/20 dark:border-white/20"
  >
    <div
      class="flex items-center h-full px-1 mx-auto max-w-7xl sm:px-3 lg:px-6"
    >
      <button
        aria-label="mobileMenu"
        @click="aside.isOpen = true"
        class="flex items-center justify-center w-12 h-12 lg:hidden"
      >
        <Icon :icon="IconMenu" class="icon-btn"></Icon>
      </button>
      <div class="flex flex-1 items-center justify-center lg:justify-start">
        <NuxtLink to="/">
          <AppLogo />
        </NuxtLink>
      </div>
      <nav class="items-center h-full gap-4 hidden lg:flex">
        <template v-for="nav of navigation">
          <NuxtLink :to="nav.path">
            {{ nav.name }}
          </NuxtLink>
        </template>
      </nav>
      <div class="flex items-center justify-end gap-1 lg:flex-1">
        <a
          aria-label="githubLink"
          :href="terworkingSocial.github"
          rel="external nofollow noopener noreferrer"
          target="_blank"
          class="p-3"
        >
          <Icon :icon="IconGithub" class="icon-btn hover:text-cyan-300" />
        </a>
        <a
          aria-label="instagramLink"
          :href="terworkingSocial.instagram"
          rel="external nofollow noopener noreferrer"
          target="_blank"
          class="hidden lg:block p-3"
        >
          <Icon :icon="IconInstagram" class="icon-btn" />
        </a>
        <a
          aria-label="youtubeLink"
          :href="terworkingSocial.youtube"
          rel="external nofollow noopener noreferrer"
          target="_blank"
          class="hidden lg:block p-3"
        >
          <Icon :icon="IconYoutube" class="icon-btn" />
        </a>
        <button
          aria-label="toggleColorMode"
          @click="toggleColorMode"
          class="p-3"
        >
          <Icon
            v-if="colorMode.value === 'light'"
            :icon="IconSun"
            class="icon-btn"
          />
          <Icon v-else :icon="IconMoon" class="icon-btn" />
        </button>
      </div>
    </div>
  </header>
</template>

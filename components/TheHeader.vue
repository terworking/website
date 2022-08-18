<template>
  <header
    :class="
      $route.path === '/'
        ? 'h-[calc(100vh-160px)] md:h-[calc(100vh-80px)] lg:h-screen'
        : 'h-64px'
    "
    class="relative overflow-hidden"
  >
    <template v-if="$route.path === '/'">
      <TheHeaderBanner />
      <TheHeaderHeading />
    </template>
    <TheHeaderTop />
  </header>
</template>

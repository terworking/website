<template>
  <div>
    <TheHeader />
    <main>
      <NuxtPage />
    </main>
  </div>
</template>

<style>
body {
  --at-apply: antialiased text-body bg-body;
}

* {
  transition-property: background-color, color, filter;
  transition-duration: 250ms, 150ms;
  transition-timing-function: cubic-bezier(0.6, -0.28, 0.735, 0.045),
    cubic-bezier(1, 0, 0, 1);
}
</style>

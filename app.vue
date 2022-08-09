<template>
  <div>
    <TheHeader />
    <main>
      <NuxtPage />
    </main>
  </div>
</template>

<style>
:root {
  --scrollbar-track-color: theme('colors.zinc.200');
  --scrollbar-thumb-color: theme('colors.black');
  --scrollbar-width: 6px;
}

@media (min-width: 768px) {
  :root {
    --scrollbar-width: 8px;
  }
}

.dark {
  --scrollbar-track-color: theme('colors.zinc.800');
  --scrollbar-thumb-color: theme('colors.cyan.200');
}

body {
  --at-apply: antialiased text-body bg-body;
  transition: color 150ms cubic-bezier(1, 0, 0, 1),
    background-color 250ms cubic-bezier(0.6, -0.28, 0.735, 0.045);
}

::-webkit-scrollbar {
  width: var(--scrollbar-width);
  height: var(--scrollbar-width);
}

::-webkit-scrollbar-track {
  background-color: var(--scrollbar-track-color);
  border-radius: 0.5rem;
}

::-webkit-scrollbar-thumb {
  box-shadow: 0px 0px 5px 5px var(--scrollbar-thumb-color);
  background-color: var(--scrollbar-thumb-color);
  border-radius: 0.5rem;
}

* {
  scrollbar-color: var(--scrollbar-thumb-color) var(--scrollbar-track-color);
}
</style>

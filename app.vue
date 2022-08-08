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
  --default-transition: color 150ms cubic-bezier(1, 0, 0, 1),
    background-color 250ms cubic-bezier(0.6, -0.28, 0.735, 0.045),
    filter 250ms cubic-bezier(0.6, -0.28, 0.735, 0.045),
    backdrop-filter 250ms cubic-bezier(0.6, -0.28, 0.735, 0.045);
}

body {
  --at-apply: antialiased text-body bg-body;
}

* {
  transition: var(--default-transition);
}
</style>

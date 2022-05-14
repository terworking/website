<template>
  <button
    inline-flex
    items-center
    justify-center
    w-full
    h-12
    font-semibold
    rounded-lg
    select-none
    disabled:pointer-events-none
    border="~ accent disabled:gray-400"
    bg="accent hover:transparent disabled:gray-400"
    text="white dark:black hover:body"
    transition-background-color="200 disabled:1000"
  >
    <slot></slot>
  </button>
</template>

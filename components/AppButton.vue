<template>
  <button
    items-center
    justify-center
    p="x-4 y-3"
    font-semibold
    select-none
    disabled:pointer-events-none
    border="~ accent disabled:gray-400 rounded-lg"
    bg="accent hover:transparent disabled:gray-400"
    text="white dark:black hover:body"
    transition-background-color="200 disabled:1000"
  >
    <slot></slot>
  </button>
</template>

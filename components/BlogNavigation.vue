<template>
  <nav>
    <ContentList v-slot="{ list }" path="/blog">
      <slot v-bind="Array.from(list)"></slot>
    </ContentList>
  </nav>
</template>

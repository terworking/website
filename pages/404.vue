<script lang="ts" setup>
import { defaultWindow } from '@vueuse/core'

definePageMeta({
  title: '404 ERROR',
  layout: false,
})

const {
  public: { notFoundTitle: notFoundHeading },
} = useRuntimeConfig()

const heading = ref<HTMLHeadingElement>()
const { width: headingWidth } = useElementSize(heading)

interface Quote {
  character: string
  show: string
  quote: string
}

const { data: quote, refresh: refreshData } = await useAsyncData<Quote>(
  '404-error-quote',
  () =>
    Math.random() < 0.5
      ? $fetch<{ data: Quote[] }>(
          'https://quotes.terworking.workers.dev/1'
        ).then(({ data }) => {
          const it = data[0]
          it.quote = it.quote.replaceAll('"', '`')
          return it
        })
      : $fetch<string>('/api/sudoers-insults').then((quote) => ({
          quote,
          show: 'sudo',
          character: 'sudoers',
        }))
)

const selection = ref<HTMLElement>()
const selectAllQuote = () => {
  if (selection.value !== undefined)
    defaultWindow?.getSelection()?.selectAllChildren(selection.value)
}

const refreshQuote = async () => {
  defaultWindow?.getSelection()?.empty()
  await refreshData()
}
</script>

<template>
  <div
    style="inset: -64px 0 0"
    class="absolute flex flex-col items-center justify-center text-center"
  >
    <h1 ref="heading" class="text-4xl md:text-6xl lg:text-7xl font-semibold">
      {{ notFoundHeading }}
    </h1>
    <figure
      ref="selection"
      title="single click to select; double click to refresh"
      :style="{ 'max-width': `${headingWidth}px` }"
      class="text-xs md:text-sm lg:text-base opacity-80 hover:opacity-100"
      @click="selectAllQuote"
      @dblclick="refreshQuote"
    >
      <blockquote class="italic">"{{ quote.quote }}"</blockquote>
      <figcaption class="font-semibold">
        --{{ quote.character }}, {{ quote.show }}
      </figcaption>
    </figure>
  </div>
</template>

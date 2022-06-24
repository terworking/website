<script setup lang="ts">
const headerSize = useHeaderSize();

const quoteContainer = ref<HTMLDivElement>();
const { width: quoteContainerWidth } = useElementSize(quoteContainer);
const maxCharPerLine = computed(
  () => quoteContainerWidth.value / 6 // <- approximate text-xs character size
);

type Quote = Record<'character' | 'quote' | 'show', string>;
const fetchedQuotes = useState<Quote[]>('footer-fetched-quotes', () => []);
const fetchedQuotesKeys = computed(() =>
  // ^ used to check for duplicates
  fetchedQuotes.value.map(({ quote }) => quote)
);
const filteredQuotes = computed(() =>
  fetchedQuotes.value.filter(({ quote }) =>
    // only pick quote that fits 2 lines (kinda)
    maxCharPerLine.value === 0 ? true : quote.length <= maxCharPerLine.value * 2
  )
);

const { data, refresh } = await useLazyAsyncData('footer-quote', async () => {
  let maybeQuote = filteredQuotes.value.pop();
  while (maybeQuote === undefined) {
    if (filteredQuotes.value.length === 0 && fetchedQuotes.value.length > 0) {
      // fallback in case of no quote is suitable
      maybeQuote = fetchedQuotes.value.at(-1);
      continue;
    }

    const candidate = await $fetch<{ data: Quote[] }>(
      'https://quotes.terworking.workers.dev/50' // fetch 50 quotes
    ).catch(() => ({ data: [] }));

    fetchedQuotes.value.push(
      ...candidate.data.filter(
        (
          { quote },
          index // don't add duplicates
        ) => !fetchedQuotesKeys.value.includes(quote, index + 1)
      )
    );
    maybeQuote = filteredQuotes.value.pop();
  }

  fetchedQuotes.value = fetchedQuotes.value.filter(
    // remove the quote after being used
    ({ quote }) => maybeQuote?.quote !== quote
  );
  return maybeQuote;
});

const clipboardContent = computed(
  () => `${data.value.quote} \n~${data.value.character}`
);
const { copied, copy } = useClipboard({
  copiedDuring: 3000,
  source: clipboardContent,
});

const quoteElement = ref();
const quoteCharacterElement = ref();
const quoteElementHovered = useElementHover(quoteElement);
const quoteCharacterElementHovered = useElementHover(quoteCharacterElement);

const { pointerType } = usePointer();
const tooltipClasses = computed(() => {
  if (
    pointerType.value === 'mouse' &&
    (quoteElementHovered.value || quoteCharacterElementHovered.value)
  ) {
    return 'hint--info hint--top hint--rounded';
  }
});
const tooltipContent = computed(() => {
  if (copied.value) return 'copied';

  const message: string[] = [];
  if (quoteCharacterElementHovered.value)
    message.push(`from ${data.value.show}`);
  message.push('left-click to refresh', 'right-click to copy');
  return message.join('; ');
});

// refresh the quote whenever route changes
watch(() => useRoute().path, refresh);

// fail safe to fix overflowing quote
const stop = watch(maxCharPerLine, () => {
  void nextTick(() => stop());

  return refresh();
});
</script>

<template>
  <footer
    :style="{ height: `${headerSize.height.rem}rem` }"
    px-6
    flex
    items-center
    justify-between
    border="t primary"
  >
    <div
      ref="quoteContainer"
      flex="~ col"
      justify-center
      items-center
      text-center
      w="1/2"
      select-none
      children-opacity="60 lg:hover:100"
      :class="tooltipClasses"
      :aria-label="tooltipContent"
      @click="() => refresh()"
      @auxclick="
        async (e) => {
          e.preventDefault();
          await copy();
        }
      "
      @contextmenu="(e) => e.preventDefault()"
    >
      <span ref="quoteElement" inline-flex text-xs>
        {{ data.quote }}
      </span>
      <span
        ref="quoteCharacterElement"
        inline-flex
        :class="data.quote.length > maxCharPerLine ? 'text-lg' : 'text-base'"
      >
        ~{{ data.character }}
      </span>
    </div>
    <span text="sm lg:base">© 2022 Terworking</span>
  </footer>
</template>

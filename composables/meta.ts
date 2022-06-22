import type { MaybeRef } from '@vueuse/shared';
import type { Article } from '~~/types/content';

interface HeadItems {
  description?: MaybeRef<string | undefined>;
  image?: MaybeRef<string | undefined>;
  title?: MaybeRef<string | undefined>;
  url?: MaybeRef<string | undefined>;
  [key: string]: MaybeRef<string | undefined>;
}

export const useSeoHead = reactify((items: HeadItems) => {
  const link = [] as Record<string, string>[];
  const meta = [] as Record<string, string>[];

  const description = unref(items.description);
  if (description !== undefined) {
    meta.push({ content: description, name: 'description' });
  }

  if (unref(items.image) !== undefined) {
    meta.push({ name: 'twitter:card', value: 'summary_large_image' });
  } else {
    meta.push({ name: 'twitter:card', value: 'summary' });
  }

  for (const [key, valueReference] of Object.entries(items)) {
    const value = unref(valueReference);
    if (value !== undefined) {
      meta.push(
        { content: value, property: `og:${key}` },
        { content: value, property: `twitter:${key}` }
      );

      if (key === 'url') link.push({ rel: 'canonical', href: value });
    }
  }

  return { link, meta };
});

export const useSeoArticleHead = reactify((article: Article) => {
  const meta = [] as Record<string, string>[];

  const pick = {
    author: 'author',
    created: 'published_time',
    modified: 'modified_time',
  };
  for (const [key, value] of Object.entries(article)) {
    if (key in pick && value !== undefined) {
      // @ts-expect-error see^
      meta.push({ content: value, property: `article:${pick[key]}` });
    }
  }

  return { meta };
});

export const useTitleTemplate = (title?: string) =>
  title !== undefined ? `${title} - Terworking` : 'Terworking';

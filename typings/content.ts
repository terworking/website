import type { ParsedContent } from '@nuxt/content/dist/runtime/types';

export interface Article extends ParsedContent {
  description: string;
  image?: string;
}

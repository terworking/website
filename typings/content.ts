import type { ParsedContent, NavItem } from '@nuxt/content/dist/runtime/types';

interface Extension {
  description?: string;
  image?: string;
}

export type Article = ParsedContent & Extension;

export type FlatNavigation = NavItem & Extension;

export interface Navigation extends FlatNavigation {
  children: Navigation[] | undefined;
}

import type { ParsedContent, NavItem } from '@nuxt/content/dist/runtime/types';

interface Extension {
  author?: string;
  comment?: boolean;
  created?: string;
  description?: string;
  image?: string;
  modified?: string;
}

export type Article = ParsedContent & Extension;

export type FlatNavigation = NavItem & Extension;

export interface Navigation extends FlatNavigation {
  children: Navigation[] | undefined;
}

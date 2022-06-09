/* eslint-disable @typescript-eslint/no-empty-interface */
interface Extension {
  hidden?: boolean;
  name?: string;
  weight?: number;
  title?: string;
}

declare module 'vue-router' {
  interface RouteMeta extends Extension {}
}

declare module '#app' {
  interface PageMeta extends Extension {}
}

export {};

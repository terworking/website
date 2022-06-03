import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    hidden?: boolean;
    name?: string;
    weight?: number;
    title?: string;
  }
}

import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    name?: string
    weight?: number
    title?: string
  }
}

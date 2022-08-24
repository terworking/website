export default defineNuxtRouteMiddleware(() => {
  const nuxtApp = useNuxtApp()
  nuxtApp.callHook('page:start')
})

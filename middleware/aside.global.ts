export default defineNuxtRouteMiddleware(() => {
  const aside = useAside();

  // close the aside everytime route changes
  aside.value.visible = false;
});

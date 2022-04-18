export const useRoutes = () => {
  const router = useRouter();

  return [...router.getRoutes()]
    .sort((a, b) => a.meta.weight || 0 - b.meta.weight || 0)
    .map((route) => {
      const name = route.meta.name || route.name;
      return { name, path: route.path };
    });
};

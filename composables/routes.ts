export const useRoutes = () => {
  const router = useRouter();

  return [...router.getRoutes()]
    .filter(({ meta }) => !(meta.hidden === true))
    .sort((a, b) => (a.meta.weight ?? 0) - (b.meta.weight ?? 0))
    .map((route) => ({
      name: route.meta.name ?? route.name,
      path: route.path,
    }));
};

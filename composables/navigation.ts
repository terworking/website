export const useNavigation = () => {
  return [
    {
      name: 'Birthday',
      path: '/birthday',
    },
    {
      name: 'About',
      path: '/about',
    },
  ].sort((a, b) => a.name.charCodeAt(0) - b.name.charCodeAt(0));
};

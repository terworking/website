export const useAside = () =>
  useState('aside', () => {
    return { isOpen: false };
  });

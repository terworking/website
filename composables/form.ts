export const useFormStatus = () => {
  const config = useRuntimeConfig();

  return {
    isOnSlowMode: config.public.formIsOnSlowMode !== '',
    isOpen: config.public.formIsOpen !== '',
  };
};

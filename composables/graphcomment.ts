import { GraphcommentParameters } from '~~/typings/graphcomment';

export const useGraphcomment = () => ({
  load: (identifier: string, theme?: string, target?: HTMLElement) => {
    const config = useRuntimeConfig();

    const graphcommentParameters = {
      graphcomment_id: config.public.graphcommentId,
      disable_ads: true,
      uid: identifier,
      theme,
      target,
    } as GraphcommentParameters;

    window.graphcomment(graphcommentParameters);
  },
});

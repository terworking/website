import type { GraphcommentParameters } from '~~/types/graphcomment';

declare global {
  interface Window {
    graphcomment: (graphcommentParameters: GraphcommentParameters) => void;
  }
}

export {};

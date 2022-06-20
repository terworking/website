import { GraphcommentParameters } from '~~/typings/graphcomment';

declare global {
  interface Window {
    graphcomment: (graphcommentParameters: GraphcommentParameters) => void;
  }
}

export {};

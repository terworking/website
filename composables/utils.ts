// https://stackoverflow.com/a/42769683
export const useRemToPx = (rem: number) =>
  rem * Number.parseFloat(getComputedStyle(document.documentElement).fontSize);

// https://stackoverflow.com/a/42769683
export const useRemToPx = (rem: number) =>
  rem * Number.parseFloat(getComputedStyle(document.documentElement).fontSize);

// https://stackoverflow.com/a/27149357
export const distribute = (length: number, value: number): number[] => {
  if (length <= 1) return [value];
  const half = Math.floor(length / 2);
  const distribution = Math.floor(Math.random() * value);
  return [
    ...distribute(half, distribution),
    ...distribute(length - half, value - distribution),
  ];
};

// https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
export const randomInt = (a = 1, b = 0) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

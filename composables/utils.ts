import type { FlatNavigation, Navigation } from '~~/types/content';

const headerSizeRem = 4.5;
export const useHeaderSize = () => ({
  height: { rem: headerSizeRem, px: useRemToPx(headerSizeRem) },
});

// https://stackoverflow.com/a/42769683
export const useRemToPx = (rem: number) => {
  try {
    return (
      rem *
      Number.parseFloat(getComputedStyle(document.documentElement).fontSize)
    );
  } catch {
    return 0;
  }
};

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

export const flattenContentNavigation = (data: Navigation[]) => {
  // https://stackoverflow.com/a/54245371
  const transform1 = ({ children = [], ...rest }: Navigation) => [
    { ...rest },
    ...transformAll(children),
  ];

  // https://stackoverflow.com/a/54245371
  const transformAll = (children: Navigation[] = []): FlatNavigation[] =>
    children.flatMap((c) => transform1(c));

  return transformAll(data);
};

// https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
export const randomInt = (a = 1, b = 0) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

// https://images.weserv.nl/docs/quick-reference.html
export const useImageProxy = (
  parameters: { url: string } & Record<string, string>
) => {
  const url = new URL('https://images.weserv.nl/');
  for (const [key, value] of Object.entries(parameters)) {
    url.searchParams.append(key, value);
  }
  return url.toString();
};

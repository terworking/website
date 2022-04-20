import type { FlatNavigation, Navigation } from '~~/types/content';
import type { ConvertibleToString } from '~~/types/utils';

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

// https://images.weserv.nl/docs/quick-reference.html
export const useImageProxy = (
  parameters: { url: string } & Record<string, ConvertibleToString>
) => {
  const url = new URL('https://images.weserv.nl/');
  for (const [key, value] of Object.entries(parameters)) {
    url.searchParams.append(key, value.toString());
  }
  return url.toString();
};

// https://github.com/semibran/wrap-around
export const wrapNumber = (n: number, max: number, min = 0) =>
  (n >= 0 ? n % max : ((n % max) + max) % max) + min;

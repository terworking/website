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

// https://images.weserv.nl/docs/quick-reference.html
export const useImageProxy = (
  parameters: { url: string } & Record<string, ConvertibleToString>
) => {
  const url = new URL('https://images.weserv.nl/');
  for (const [key, value] of Object.entries(parameters)) {
    if (key === 'filename') {
      url.searchParams.append(
        key,
        value // 'fix' the filename
          .toString()
          .replace(/[^\w.]/g, '') // remove all non-alphanumeric characters
          .replace(/\..*/, '') // remove file extension)
      );
    } else url.searchParams.append(key, value.toString());
  }
  return url.toString();
};

// https://github.com/semibran/wrap-around
export const wrapNumber = (n: number, max: number, min = 0) =>
  (n >= 0 ? n % max : ((n % max) + max) % max) + min;

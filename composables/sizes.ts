const headerSizeRem = 4.5;
export const useHeaderSize = () => ({
  height: { rem: headerSizeRem, px: useRemToPx(headerSizeRem) },
});

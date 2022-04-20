// https://github.com/semibran/wrap-around
export const wrapNumber = (n: number, max: number, min = 0) =>
  (n >= 0 ? n % max : ((n % max) + max) % max) + min;

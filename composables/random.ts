import Alea from 'alea';

import type { ConvertibleToString } from '~~/types/utils';

export const random = (...seeds: ConvertibleToString[]) => {
  return Alea(...seeds).next();
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

export const randomInt = (a = 1, b = 0, ...seeds: ConvertibleToString[]) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + random(...seeds) * (upper - lower + 1));
};

export const sample = <T>(array: T[], ...seeds: ConvertibleToString[]) => {
  return array[Math.floor(random(...seeds) * array.length)];
};

// https://bost.ocks.org/mike/shuffle/
export const shuffle = <T>(array: T[], ...seeds: ConvertibleToString[]) => {
  let m = array.length;

  // While there remain elements to shuffle…
  while (m > 0) {
    // Pick a remaining element…
    const index = Math.floor(random(...seeds) * m--);

    // And swap it with the current element.
    const t = array[m];
    array[m] = array[index];
    array[index] = t;
  }

  return array;
};

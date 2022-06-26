import Alea from 'alea';

import { ConvertibleToString } from '~~/types/utils';

export const random = (...seeds: ConvertibleToString[]) => {
  return Alea(...seeds).next();
};

export const randomInt = (a = 1, b = 0, ...seeds: ConvertibleToString[]) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + random(...seeds) * (upper - lower + 1));
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

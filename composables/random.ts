import seedrandom from 'seedrandom';

export const random = (seed = Date.now().toString()) => {
  return seedrandom.xorshift7(seed)();
};

// https://bost.ocks.org/mike/shuffle/
export const shuffle = <T>(array: T[], seed?: string) => {
  let m = array.length;

  // While there remain elements to shuffle…
  while (m > 0) {
    // Pick a remaining element…
    const index = Math.floor(random(seed) * m--);

    // And swap it with the current element.
    const t = array[m];
    array[m] = array[index];
    array[index] = t;
  }

  return array;
};

export const useShuffle = <T>(array: T[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
}

export const wrapNumber = (n: number, max: number, min = 0) =>
  (n >= 0 ? n % max : ((n % max) + max) % max) + min

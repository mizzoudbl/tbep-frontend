// https://en.wikipedia.org/wiki/Linear_congruential_generator#Parameters_in_common_use
const a = 1664525;
const c = 1013904223;
const m = 4294967296; // 2^32

export function lcgRandom() {
  let s = 1;
  return () => (s = (a * s + c) % m) / m;
}

export function jiggle(random: ReturnType<typeof lcgRandom>) {
  return (random() - 0.5) * 1e-6;
}

import crypto from 'crypto';
import seedrandom from 'seedrandom';

export function createRNG(seed) {
  return seedrandom(seed);
}

export function getRandomInt(max) {
  return crypto.randomInt(max);
}

export function randomInRange(rng, min, max) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

export function getRandomNumber(rng, min, max) {
  const range = max - min;
  return min + rng() * range;
}
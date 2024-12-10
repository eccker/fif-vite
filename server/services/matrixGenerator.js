import { randomInRange, getRandomNumber, createRNG } from '../utils/randomUtils.js';

export class MatrixGenerator {
  constructor(seed = 'default_seed') {
    this.rng = createRNG(seed);
  }

  hasMatch(firstHalf, secondHalf) {
    return firstHalf.some((num) => secondHalf.includes(num));
  }

  generateCombination(limit) {
    let numbers = new Set();
    while (numbers.size < 6) {
      numbers.add(randomInRange(this.rng, 1, limit));
    }
    const firstHalf = Array.from(numbers);
    
    numbers = new Set();
    while (numbers.size < 6) {
      numbers.add(randomInRange(this.rng, 1, limit));
    }
    const secondHalf = Array.from(numbers);

    return [...firstHalf, ...secondHalf];
  }

  generate(levels) {
    const matrix = [];
    const times = [];
    const MIN_TIME = 3;
    const MIN_RAN_TIME = 4;
    const INITIAL_MIN_TIME = 12;
    const INITIAL_RAN_TIME = 36;
    let minTime = INITIAL_MIN_TIME;
    let ranTime = INITIAL_RAN_TIME;

    for (let attempt = 1; attempt <= levels; attempt++) {
      const limit = attempt + 10;
      let requiredMatches = Math.round(((128 - (attempt / 2 - 1)) / 2) + 1);
      let currentMatches = 0;
      const combinationsWithMatch = [];
      const combinationsWithoutMatch = [];

      const MAX_SHUFFLES_PER_TRY = 256;
      while (combinationsWithMatch.length + combinationsWithoutMatch.length < MAX_SHUFFLES_PER_TRY) {
        let combination = this.generateCombination(limit);
        let firstHalf = combination.slice(0, 6);
        let secondHalf = combination.slice(6);

        if (currentMatches < requiredMatches) {
          if (this.hasMatch(firstHalf, secondHalf)) {
            combinationsWithMatch.push(combination);
            currentMatches++;
          }
        } else {
          if (limit > 12) {
            while (this.hasMatch(firstHalf, secondHalf)) {
              combination = this.generateCombination(limit);
              firstHalf = combination.slice(0, 6);
              secondHalf = combination.slice(6);
            }
          }
          combinationsWithoutMatch.push(combination);
        }
      }

      const allCombinations = [...combinationsWithMatch, ...combinationsWithoutMatch];
      for (let i = allCombinations.length - 1; i > 0; i--) {
        const j = Math.floor(this.rng() * (i + 1));
        [allCombinations[i], allCombinations[j]] = [allCombinations[j], allCombinations[i]];
      }

      matrix.push(allCombinations);
      const currentExpireTime = 1000 * getRandomNumber(this.rng, minTime, minTime + ranTime);
      times.push(currentExpireTime);

      minTime = Math.max(MIN_TIME, minTime - (INITIAL_MIN_TIME / 256));
      ranTime = Math.max(MIN_RAN_TIME, ranTime - (INITIAL_RAN_TIME / 256));
    }

    return { matrix, times };
  }
}
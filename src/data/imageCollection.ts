// import deckSamples from './deckSamples.json';
// import imageUrls from './imageUrls.json';

// export interface GameState {
//   topDeck: string[];
//   bottomDeck: string[];
//   timeLimit: number;
//   startTime: number;
//   currentSampleIndex: number;
//   currentSetIndex: number;
// }

// function getImageUrlsFromIndices(indices: number[]): string[] {
//   return indices.map(index => imageUrls.images[index]);
// }

// export function initializeGameState(): GameState {
//   return {
//     ...getNextDeck(0, 0),
//     timeLimit: deckSamples[0].timeLimit,
//     startTime: Date.now(),
//     currentSampleIndex: 0,
//     currentSetIndex: 0
//   };
// }

// export function getNextDeck(currentSetIndex: number, currentSampleIndex: number, moveToNextSet: boolean = false): Pick<GameState, 'topDeck' | 'bottomDeck' | 'currentSampleIndex' | 'currentSetIndex' | 'timeLimit'> {
//   let nextSetIndex = currentSetIndex;
//   let nextSampleIndex = currentSampleIndex;

//   if (moveToNextSet) {
//     // Move to next set (level) when match is found
//     nextSetIndex = (currentSetIndex + 1) % deckSamples.length;
//     nextSampleIndex = 0; // Reset sample index when moving to next set
//   } else {
//     // Stay in current set but move to next sample when New Cards is clicked
//     nextSampleIndex = (currentSampleIndex + 1) % deckSamples[nextSetIndex].samples.length;
//   }
  
//   const currentSample = deckSamples[nextSetIndex].samples[nextSampleIndex];
  
//   return {
//     topDeck: getImageUrlsFromIndices(currentSample.topDeck),
//     bottomDeck: getImageUrlsFromIndices(currentSample.bottomDeck),
//     currentSampleIndex: nextSampleIndex,
//     currentSetIndex: nextSetIndex,
//     timeLimit: deckSamples[nextSetIndex].timeLimit
//   };
// }
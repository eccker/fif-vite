import { imageCollection } from './imageCollection.js';

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

export function generateGameState() {
  // Select 6 random images
  const selectedImages = shuffleArray(imageCollection).slice(0, 6);
  
  // Create cards for both decks with the same images but different order
  const topDeck = selectedImages.map(imageUrl => ({
    id: generateId(),
    imageUrl
  }));

  const bottomDeck = shuffleArray([...selectedImages]).map(imageUrl => ({
    id: generateId(),
    imageUrl
  }));

  return {
    topDeck,
    bottomDeck,
    score: 0,
    matchedPairs: [],
    gameStatus: 'playing'
  };
}
export interface Card {
  id: string;
  imageUrl: string;
}

export interface GameState {
  topDeck: Card[];
  bottomDeck: Card[];
  score: number;
  matchedPairs: string[];
  gameStatus: 'waiting' | 'playing' | 'finished';
}
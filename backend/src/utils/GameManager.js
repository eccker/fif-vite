import { generateGameState } from './gameState.js';

export class GameManager {
  constructor() {
    this.currentGame = null;
  }

  getCurrentGame() {
    return this.currentGame;
  }

  startNewGame() {
    this.currentGame = generateGameState();
    return this.currentGame;
  }

  handleCardMatch(topCardId, bottomCardId) {
    if (!this.currentGame) return null;

    const topCard = this.currentGame.topDeck.find(card => card.id === topCardId);
    const bottomCard = this.currentGame.bottomDeck.find(card => card.id === bottomCardId);

    if (!topCard || !bottomCard) return null;

    if (topCard.imageUrl === bottomCard.imageUrl) {
      // Match found
      this.currentGame.matchedPairs.push(topCardId);
      this.currentGame.score += 100;

      // Check if game is finished
      if (this.currentGame.matchedPairs.length === this.currentGame.topDeck.length) {
        this.currentGame.gameStatus = 'finished';
      }
    }

    return this.currentGame;
  }
}
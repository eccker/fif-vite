export function handleMatchCards(topCardId, bottomCardId, gameState) {
  if (!gameState) return null;

  const topCard = gameState.topDeck.find(card => card.id === topCardId);
  const bottomCard = gameState.bottomDeck.find(card => card.id === bottomCardId);

  if (!topCard || !bottomCard) return null;

  if (topCard.imageUrl === bottomCard.imageUrl) {
    gameState.matchedPairs.push(topCardId);
    gameState.score += 100;

    if (gameState.matchedPairs.length === gameState.topDeck.length) {
      gameState.gameStatus = 'finished';
    }
  }

  return gameState;
}
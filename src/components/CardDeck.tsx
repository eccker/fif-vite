import React from 'react';
import { GameCard } from './GameCard';
import { useGame } from '../contexts/GameContext';

interface CardDeckProps {
  deckId: 'top' | 'bottom';
}

export function CardDeck({ deckId }: CardDeckProps) {
  const { gameState } = useGame();
  const cards = gameState?.[deckId === 'top' ? 'topDeck' : 'bottomDeck'] ?? [];

  return (
    <div className="w-full h-full px-4">
      <div className="grid grid-cols-3 grid-rows-2 gap-2 h-full">
        {cards.map((card, index) => (
          <GameCard 
            key={card.id} 
            imageUrl={card.imageUrl} 
            deckId={deckId}
            index={index}
            cardId={card.id}
          />
        ))}
      </div>
    </div>
  );
}
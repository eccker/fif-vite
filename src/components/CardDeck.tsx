import React from 'react';
import { GameCard } from './GameCard';

interface CardDeckProps {
  deckId: string;
  images: string[];
}

export function CardDeck({ deckId, images }: CardDeckProps) {
  return (
    <div className="w-full h-full px-4">
      <div className="grid grid-cols-3 grid-rows-2 gap-2 h-full">
        {images.map((image, index) => (
          <GameCard 
            key={`${deckId}-${image}-${index}`} 
            imageUrl={image} 
            deckId={deckId}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
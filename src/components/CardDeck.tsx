import React, { useState, useEffect } from 'react';
import { GameCard } from './GameCard';
import { imageCollection } from '../data/imageCollection';
import { getRandomImages } from '../utils/imageUtils';

interface CardDeckProps {
  deckId: string;
}

export function CardDeck({ deckId }: CardDeckProps) {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  useEffect(() => {
    setSelectedImages(getRandomImages(6, imageCollection));
  }, []);

  return (
    <div className="w-full h-full px-4">
      <div className="grid grid-cols-3 grid-rows-2 gap-2 h-full">
        {selectedImages.map((image, index) => (
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
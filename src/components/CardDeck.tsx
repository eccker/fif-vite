import React, { useState, useEffect } from 'react';
import { GameCard } from './GameCard';
import { imageCollection } from '../data/imageCollection';
import { getRandomImages } from '../utils/imageUtils';

export function CardDeck() {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  useEffect(() => {
    setSelectedImages(getRandomImages(6, imageCollection));
  }, []);

  return (
    <div className="w-full h-full max-w-[90vw] max-h-[70vh] px-2">
      <div className="grid grid-cols-3 grid-rows-2 gap-2 h-full">
        {selectedImages.map((image, index) => (
          <GameCard key={`${image}-${index}`} imageUrl={image} />
        ))}
      </div>
    </div>
  );
}
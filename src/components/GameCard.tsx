import React from 'react';

interface GameCardProps {
  imageUrl: string;
}

export function GameCard({ imageUrl }: GameCardProps) {
  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        <img
          src={imageUrl}
          alt="Game card"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    </div>
  );
}
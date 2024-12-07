import React from 'react';
import { Heart } from 'lucide-react';
import { useGameContext } from '../contexts/GameContext';

export function LivesIndicator() {
  const { lives } = useGameContext();
  
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 3 }).map((_, index) => (
        <Heart
          key={index}
          className={`w-6 h-6 transition-all duration-300 ${
            index < lives
              ? 'text-red-500 fill-red-500 scale-100'
              : 'text-gray-300 scale-90'
          }`}
        />
      ))}
    </div>
  );
}
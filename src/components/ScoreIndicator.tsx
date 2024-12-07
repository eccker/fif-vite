import React from 'react';
import { Medal } from 'lucide-react';
import { useGameContext } from '../contexts/GameContext';

export function ScoreIndicator() {
  const { score } = useGameContext();
  
  return (
    <div className="flex items-center gap-2 text-gray-600">
      <Medal className="w-5 h-5 text-blue-500" />
      <span className="font-semibold">{score.toLocaleString()}</span>
    </div>
  );
}
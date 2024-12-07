import React from 'react';
import { Trophy } from 'lucide-react';
import { useGameContext } from '../contexts/GameContext';

export function LevelIndicator() {
  const { gameState } = useGameContext();
  
  return (
    <div className="flex items-center gap-2 text-gray-600">
      <Trophy className="w-5 h-5 text-yellow-500" />
      <span>Level {gameState.currentSetIndex + 1}/5</span>
    </div>
  );
}
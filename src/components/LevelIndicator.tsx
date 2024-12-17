import React from 'react';
import { Trophy } from 'lucide-react';
import { useGameContext } from '../contexts/GameContext';
import { useSocket } from '../contexts/SocketContext';

export function LevelIndicator() {
  const { gameState } = useGameContext();
  const { gameData } = useSocket();
  
  if (!gameData) return null;
  
  return (
    <div className="flex items-center gap-2 text-gray-600">
      <Trophy className="w-5 h-5 text-yellow-500" />
      <span>Level {gameState.currentSetIndex + 1}/{gameData.deckSamples.length}</span>
    </div>
  );
}
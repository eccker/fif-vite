import { Trophy } from 'lucide-react';
import { useGameContext } from '../contexts/GameContext';
import { useAuth } from '../contexts/AuthContext';

export function LevelIndicator() {
  const { gameState } = useGameContext();
  const { user } = useAuth();
  const maxLevels = user?.isAnonymous ? 8 : 25;

  return (
    <div className="flex items-center gap-2 text-gray-600">
      <Trophy className="w-5 h-5 text-yellow-500" />
      <span>Level {gameState.currentSetIndex + 1}/{maxLevels}</span>
    </div>
  );
}
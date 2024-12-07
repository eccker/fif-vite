import React from 'react';
import { Trophy, Clock, Ban, ExternalLink } from 'lucide-react';
import { useGameContext } from '../contexts/GameContext';

interface ScoreBreakdownProps {
  level: number;
  elapsedTime: number;
  shuffles: number;
}

export function ScoreBreakdown({ level, elapsedTime, shuffles }: ScoreBreakdownProps) {
  const { gameState, matchedImageUrl } = useGameContext();
  const levelScore = level * 1000;
  const timeRatio = Math.max(0, (gameState.timeLimit - elapsedTime) / gameState.timeLimit);
  const timeScore = Math.floor(level * 1000 * timeRatio);
  const shufflePenalty = shuffles * 100;
  const totalScore = Math.max(0, levelScore + timeScore - shufflePenalty);

  const getBaseUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`;
    } catch {
      return url;
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-2 text-sm">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-1.5">Score Breakdown</h3>
      
      {matchedImageUrl && (
        <div className="mb-2 flex items-center gap-2">
          <div className="relative w-12 h-12 rounded-md overflow-hidden flex-none">
            <img 
              src={matchedImageUrl} 
              alt="Matched card"
              className="w-full h-full object-cover"
            />
          </div>
          <a 
            href={getBaseUrl(matchedImageUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
          >
            <span>View original</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
      
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1 min-w-0">
            <Trophy className="w-4 h-4 text-yellow-500 flex-none" />
            <span className="text-gray-600 dark:text-gray-300 truncate">Level {level}</span>
          </div>
          <span className="font-medium text-gray-900 dark:text-white flex-none">+{levelScore.toLocaleString()}</span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1 min-w-0">
            <Clock className="w-4 h-4 text-green-500 flex-none" />
            <span className="text-gray-600 dark:text-gray-300 truncate">Time ({Math.round(timeRatio * 100)}%)</span>
          </div>
          <span className="font-medium text-gray-900 dark:text-white flex-none">+{timeScore.toLocaleString()}</span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1 min-w-0">
            <Ban className="w-4 h-4 text-red-500 flex-none" />
            <span className="text-gray-600 dark:text-gray-300 truncate">Shuffles (×{shuffles})</span>
          </div>
          <span className="font-medium text-red-500 flex-none">-{shufflePenalty.toLocaleString()}</span>
        </div>

        <div className="pt-1 mt-1 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-900 dark:text-white truncate">Round Total</span>
            <span className="font-bold text-blue-600 dark:text-blue-400 flex-none">{totalScore.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
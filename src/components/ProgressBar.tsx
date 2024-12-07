import React from 'react';
import { useGameContext } from '../contexts/GameContext';
import { Shuffle } from 'lucide-react';

interface ProgressBarProps {
  timeLimit: number;
  startTime: number;
}

export function ProgressBar({ timeLimit, startTime }: ProgressBarProps) {
  const [progress, setProgress] = React.useState(100);
  const [timeLeft, setTimeLeft] = React.useState(timeLimit);
  const { setIsGameOver, isGameOver, isSuccess, isStarted, shuffleCount } = useGameContext();

  React.useEffect(() => {
    if (!isStarted) {
      setProgress(100);
      setTimeLeft(timeLimit);
      return;
    }

    const interval = setInterval(() => {
      if (isGameOver) {
        clearInterval(interval);
        return;
      }

      const elapsed = (Date.now() - startTime) / 1000;
      const remaining = Math.max(0, timeLimit - elapsed);
      const currentProgress = (remaining / timeLimit) * 100;
      
      setProgress(currentProgress);
      setTimeLeft(Math.ceil(remaining));

      if (remaining <= 0 && !isSuccess) {
        clearInterval(interval);
        setIsGameOver(true, false);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [timeLimit, startTime, setIsGameOver, isGameOver, isSuccess, isStarted]);

  const getProgressColor = () => {
    if (!isStarted) return 'bg-gray-300';
    if (progress > 66) return 'bg-green-500';
    if (progress > 33) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
        <div className="flex items-center gap-2">
          <span>Time remaining</span>
          <span>{timeLeft}s</span>
        </div>
        {isStarted && (
          <div className="flex items-center gap-1">
            <Shuffle className="w-4 h-4" />
            <span>×{shuffleCount}</span>
          </div>
        )}
      </div>
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-100 ${getProgressColor()}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
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
  const { setIsGameOver, isGameOver, isTimeUp, isSuccess, isStarted, shuffleCount } = useGameContext();

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10); // Get 2 digits of milliseconds
    return `${seconds}.${milliseconds.toString().padStart(2, '0')}s`;
  };

  const getProgressColor = () => {
    if (!isStarted) return 'bg-gray-300';
    if (progress > 66) return 'bg-green-500';
    if (progress > 33) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Reset progress when game is over
  React.useEffect(() => {
    if (isGameOver || isTimeUp) {
      setProgress(100);
      setTimeLeft(timeLimit);
    }
  }, [isGameOver, isTimeUp, timeLimit]);

  React.useEffect(() => {
    if (!isStarted || isGameOver || isTimeUp) {
      setProgress(100);
      setTimeLeft(timeLimit);
      return;
    }

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, timeLimit - elapsed);
      const currentProgress = (remaining / timeLimit) * 100;
      
      setProgress(currentProgress);
      setTimeLeft(remaining);

      if (remaining <= 0 && !isSuccess) {
        clearInterval(interval);
        setIsGameOver(true, false);
      }
    }, 16); // Update roughly every frame for smooth animation

    return () => clearInterval(interval);
  }, [timeLimit, startTime, setIsGameOver, isGameOver, isTimeUp, isSuccess, isStarted]);

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
        <div className="flex items-center gap-2">
          <span>Time remaining</span>
          <span>{formatTime(timeLeft)}</span>
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
          className={`h-full transition-all duration-[16ms] ${getProgressColor()}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
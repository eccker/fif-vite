import React from 'react';
import { Trophy, Clock, Heart, Medal } from 'lucide-react';
import { useGameContext } from '../contexts/GameContext';
import { ScoreBreakdown } from './ScoreBreakdown';
import { ContinueButton } from './ContinueButton';
import { SlideToTryAgain } from './SlideToTryAgain';
import { RetryButton } from './RetryButton';
import { useSocket } from '../contexts/SocketContext';
import { saveScore } from '../services/scoreService';

export function SuccessMessage() {
  const { isSuccess, isTimeUp, lives, gameState, score, shuffleCount, resetGame } = useGameContext();
  const { gameData } = useSocket();
  const isLastLevel = gameData && gameState.currentSetIndex >= gameData.deckSamples.length - 1;
  const elapsedTime = (Date.now() - gameState.startTime) / 1000;
  const [scoreSaved, setScoreSaved] = React.useState(false);

  React.useEffect(() => {
    const saveGameScore = async () => {
      if (!scoreSaved && (
        (isSuccess && isLastLevel) || 
        lives <= 0 || 
        (isTimeUp && lives <= 0)
      )) {
        const completed = isSuccess && isLastLevel;
        console.log('Saving score:', { score, completed });
        await saveScore(score, completed ?? false);
        setScoreSaved(true);
      }
    };
    
    saveGameScore();
  }, [isSuccess, isLastLevel, score, scoreSaved, lives, isTimeUp]);

  const handleComplete = () => {
    setScoreSaved(false);
    resetGame();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 bg-opacity-95 dark:bg-opacity-95 backdrop-blur-sm rounded-lg shadow-xl w-full max-w-sm">
        <div className="p-4">
          {isSuccess ? (
            <div>
              <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                {isLastLevel ? '🎉 Congratulations! 🎉' : 'Found It!'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 text-center">
                {isLastLevel 
                  ? 'Amazing! You\'ve completed all levels and mastered the game!' 
                  : 'Great job matching the images!'}
              </p>
              
              <ScoreBreakdown 
                level={gameState.currentSetIndex + 1}
                elapsedTime={elapsedTime}
                shuffles={shuffleCount}
              />

              <div className="flex justify-center items-center gap-2 mt-4">
                <Medal className="w-4 h-4 text-blue-500" />
                <span className="font-semibold text-sm text-gray-900 dark:text-white">
                  {isLastLevel ? 'Final Score' : 'Total Score'}: {score.toLocaleString()}
                </span>
              </div>
            </div>
          ) : lives > 0 ? (
            <div className={isTimeUp ? 'animate-fade-in' : ''}>
              <Clock className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1 text-center">
                Time's Up!
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 text-center">
                You didn't find the matching image in time
              </p>
              <div className="flex justify-center items-center gap-2">
                <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {lives} lives remaining
                </span>
              </div>
            </div>
          ) : (
            <div>
              <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1 text-center">
                Game Over!
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 text-center">
                You've run out of lives
              </p>
              <div className="flex justify-center items-center gap-2">
                <Medal className="w-4 h-4 text-blue-500" />
                <span className="font-semibold text-sm text-gray-900 dark:text-white">
                  Final Score: {score.toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          {isSuccess ? (
            isLastLevel ? (
              <SlideToTryAgain onComplete={handleComplete} />
            ) : (
              <ContinueButton onClick={handleComplete} />
            )
          ) : lives > 0 ? (
            <RetryButton onClick={handleComplete} />
          ) : (
            <SlideToTryAgain onComplete={handleComplete} />
          )}
        </div>
      </div>
    </div>
  );
}
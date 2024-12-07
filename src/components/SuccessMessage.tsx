import React from 'react';
import { Trophy, Clock, Heart, Medal } from 'lucide-react';
import { useGameContext } from '../contexts/GameContext';
import { ScoreBreakdown } from './ScoreBreakdown';
import { ContinueButton } from './ContinueButton';
import { SlideToTryAgain } from './SlideToTryAgain';
import { RetryButton } from './RetryButton';

export function SuccessMessage() {
  const { isSuccess, lives, gameState, score, shuffleCount, resetGame, startGame } = useGameContext();
  const isLastLevel = gameState.currentSetIndex === 4;
  const elapsedTime = (Date.now() - gameState.startTime) / 1000;

  const handleNewGame = () => {
    resetGame();
    startGame();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl w-full max-w-sm">
        <div className="p-4">
          {isSuccess ? (
            <div>
              <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <h2 className="text-lg font-bold text-gray-900 mb-1 text-center">
                {isLastLevel ? 'Congratulations!' : 'Found It!'}
              </h2>
              <p className="text-sm text-gray-600 mb-4 text-center">
                {isLastLevel 
                  ? 'You completed all levels!' 
                  : 'Great job matching the images!'}
              </p>
              
              <ScoreBreakdown 
                level={gameState.currentSetIndex + 1}
                elapsedTime={elapsedTime}
                shuffles={shuffleCount}
              />

              <div className="flex justify-center items-center gap-2 mt-4">
                <Medal className="w-4 h-4 text-blue-500" />
                <span className="font-semibold text-sm">Total Score: {score.toLocaleString()}</span>
              </div>
            </div>
          ) : lives > 0 ? (
            <div>
              <Clock className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <h2 className="text-lg font-bold text-gray-900 mb-1 text-center">Time's Up!</h2>
              <p className="text-sm text-gray-600 mb-4 text-center">You didn't find the matching image in time</p>
              <div className="flex justify-center items-center gap-2">
                <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                <span className="text-sm text-gray-600">{lives} lives remaining</span>
              </div>
            </div>
          ) : (
            <div>
              <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <h2 className="text-lg font-bold text-gray-900 mb-1 text-center">Game Over!</h2>
              <p className="text-sm text-gray-600 mb-4 text-center">You've run out of lives</p>
              <div className="flex justify-center items-center gap-2">
                <Medal className="w-4 h-4 text-blue-500" />
                <span className="font-semibold text-sm">Final Score: {score.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-200">
          {isSuccess ? (
            isLastLevel ? (
              <SlideToTryAgain onComplete={handleNewGame} />
            ) : (
              <ContinueButton onClick={handleNewGame} />
            )
          ) : lives > 0 ? (
            <RetryButton onClick={handleNewGame} />
          ) : (
            <SlideToTryAgain onComplete={handleNewGame} />
          )}
        </div>
      </div>
    </div>
  );
}
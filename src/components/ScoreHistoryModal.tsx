import React, { useEffect, useState } from 'react';
import { X, Trophy, Clock } from 'lucide-react';
import { getUserScores, GameScore } from '../services/scoreService';
import { handleFirebaseError } from '../utils/errorHandling';

interface ScoreHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ScoreHistoryModal({ isOpen, onClose }: ScoreHistoryModalProps) {
  const [scores, setScores] = useState<GameScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      loadScores();
    }
  }, [isOpen]);

  const loadScores = async () => {
    setLoading(true);
    try {
      const userScores = await getUserScores();
      console.log('Fetched scores:', userScores);
      setScores(userScores);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load scores';
      setError(message);
      console.error('Error loading scores:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Score History</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          {error ? (
            <div className="text-center py-8">
              <p className="text-red-600 dark:text-red-400">{error}</p>
              <button
                onClick={() => {
                  setError(null);
                  loadScores();
                }}
                className="mt-4 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Try Again
              </button>
            </div>
          ) : loading ? (
            <div className="text-center py-8 min-h-[50vh] flex flex-col items-center justify-center">
              <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Loading scores...</p>
            </div>
          ) : scores.length === 0 ? (
            <div className="text-center py-8 min-h-[50vh] flex flex-col items-center justify-center">
              <p className="text-gray-600 dark:text-gray-400">No scores yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {scores.map((score, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
                >
                  <div className="flex items-center gap-3">
                    {score.completed === true ? (
                      <Trophy className="w-5 h-5 text-green-500" />
                    ) : (
                      <Clock className="w-5 h-5 text-red-500" />
                    )}
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {score.score.toLocaleString()} points
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(score.timestamp)}
                      </p>
                    </div>
                  </div>
                  <div className={`text-sm ${score.completed === true ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {score.completed === true ? 'Completed' : 'Game Over'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useSocket } from '../contexts/SocketContext';

interface ImagePreloaderProps {
  onComplete: () => void;
}

export function ImagePreloader({ onComplete }: ImagePreloaderProps) {
  const [progress, setProgress] = useState(0);
  const { gameData } = useSocket();

  useEffect(() => {
    if (!gameData) return;

    let loadedCount = 0;
    const totalImages = gameData.imageUrls.images.length;

    const preloadImage = (url: string) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.src = url;
        img.onload = () => {
          loadedCount++;
          setProgress(Math.floor((loadedCount / totalImages) * 100));
          resolve();
        };
        img.onerror = () => {
          loadedCount++;
          setProgress(Math.floor((loadedCount / totalImages) * 100));
          resolve();
        };
      });
    };

    Promise.all(gameData.imageUrls.images.map(preloadImage))
      .then(() => {
        onComplete();
      });
  }, [gameData, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-indigo-600 dark:text-indigo-400 animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Loading Game Assets
        </h2>
        <div className="w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-600 dark:bg-indigo-400 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
          {progress}% Complete
        </p>
      </div>
    </div>
  );
}
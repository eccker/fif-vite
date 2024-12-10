import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import imageUrls from '../data/imageUrls.json';

interface ImagePreloaderProps {
  onComplete: () => void;
  children: React.ReactNode;
}

export function ImagePreloader({ onComplete, children }: ImagePreloaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let loadedCount = 0;
    const totalImages = imageUrls.images.length;

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

    Promise.all(imageUrls.images.map(preloadImage))
      .then(() => {
        setIsLoading(false);
        onComplete();
      });
  }, [onComplete]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
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

  return <>{children}</>;
}
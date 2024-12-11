import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message: string;
  subMessage?: string;
}

export function LoadingState({ message, subMessage }: LoadingStateProps) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {message}
        </h2>
        {subMessage && (
          <p className="text-gray-600 dark:text-gray-300">
            {subMessage}
          </p>
        )}
      </div>
    </div>
  );
}
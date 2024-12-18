import React from 'react';
import { LogIn } from 'lucide-react';

interface AuthRequiredProps {
  onAuthClick: () => void;
}

export function AuthRequired({ onAuthClick }: AuthRequiredProps) {
  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        <LogIn className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Sign In to Play
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Please sign in or create an account to start playing Find It First. You can also play as a guest!
        </p>
        <button
          onClick={onAuthClick}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-lg font-semibold transition-colors duration-300 shadow-lg hover:shadow-xl"
        >
          <LogIn className="w-5 h-5" />
          Sign In to Play
        </button>
      </div>
    </div>
  );
}
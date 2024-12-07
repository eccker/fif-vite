import React from 'react';
import { RefreshCw } from 'lucide-react';

interface RetryButtonProps {
  onClick: () => void;
}

export function RetryButton({ onClick }: RetryButtonProps) {
  return (
    <button 
      onClick={onClick}
      className="group flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full text-base font-semibold transition-all duration-300 shadow-lg hover:shadow-xl w-full"
    >
      <RefreshCw className="w-5 h-5 transition-transform group-hover:rotate-180" />
      Try Again
    </button>
  );
}
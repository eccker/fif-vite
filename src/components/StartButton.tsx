import React from 'react';
import { Play } from 'lucide-react';

interface StartButtonProps {
  onClick: () => void;
}

export function StartButton({ onClick }: StartButtonProps) {
  return (
    <button 
      onClick={onClick}
      className="group flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full text-base font-semibold transition-all duration-300 shadow-lg hover:shadow-xl w-full"
    >
      <Play className="w-5 h-5 transition-transform group-hover:scale-110" />
      Start Game
    </button>
  );
}
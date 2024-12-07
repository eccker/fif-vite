import React from 'react';
import { Square } from 'lucide-react';

interface StopButtonProps {
  onClick: () => void;
}

export function StopButton({ onClick }: StopButtonProps) {
  return (
    <button 
      onClick={onClick}
      className="group flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-base font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
    >
      <Square className="w-5 h-5 transition-transform group-hover:scale-110" />
      Stop Game
    </button>
  );
}
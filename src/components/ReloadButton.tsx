import React from 'react';
import { Shuffle } from 'lucide-react';

interface ReloadButtonProps {
  onClick: () => void;
}

export function ReloadButton({ onClick }: ReloadButtonProps) {
  return (
    <button 
      onClick={onClick}
      className="group flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full text-base font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
    >
      <Shuffle className="w-5 h-5 transition-transform group-hover:rotate-180" />
      Shuffle
    </button>
  );
}
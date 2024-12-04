import React from 'react';
import { Play } from 'lucide-react';

interface PlayButtonProps {
  url: string;
}

export function PlayButton({ url }: PlayButtonProps) {
  const handleClick = () => {
    window.location.href = url;
  };

  return (
    <button 
      onClick={handleClick}
      className="group flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full text-base font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
    >
      <Play className="w-5 h-5 transition-transform group-hover:scale-110" />
      Play Now
    </button>
  );
}
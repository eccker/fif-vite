import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ContinueButtonProps {
  onClick: () => void;
}

export function ContinueButton({ onClick }: ContinueButtonProps) {
  return (
    <button 
      onClick={onClick}
      className="group flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full text-base font-semibold transition-all duration-300 shadow-lg hover:shadow-xl w-full"
    >
      <span>Continue</span>
      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
    </button>
  );
}
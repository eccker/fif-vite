import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

interface SlideToTryAgainProps {
  onComplete: () => void;
}

export function SlideToTryAgain({ onComplete }: SlideToTryAgainProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const sliderWidth = useRef(0);

  useEffect(() => {
    if (containerRef.current) {
      sliderWidth.current = containerRef.current.clientWidth - 64; // 64px is button width
    }
  }, []);

  const handleStart = (clientX: number) => {
    setIsDragging(true);
    startXRef.current = clientX - position;
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    
    const newPosition = Math.max(0, Math.min(sliderWidth.current, clientX - startXRef.current));
    setPosition(newPosition);

    if (newPosition >= sliderWidth.current * 0.9) {
      setIsDragging(false);
      setPosition(sliderWidth.current);
      onComplete();
    }
  };

  const handleEnd = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    if (position < sliderWidth.current * 0.9) {
      setPosition(0);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative h-12 bg-gray-100 rounded-full overflow-hidden touch-none select-none"
    >
      <div 
        className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none"
      >
        <span>Slide to try again</span>
        <ArrowRight className="w-5 h-5 ml-2" />
      </div>
      
      <div
        className="absolute inset-y-0 left-0 bg-green-100 transition-all duration-200"
        style={{ width: `${(position / sliderWidth.current) * 100}%` }}
      />

      <div
        className="absolute inset-y-0 left-0 w-16 flex items-center justify-center bg-green-600 rounded-full cursor-grab active:cursor-grabbing shadow-lg transition-transform duration-200"
        style={{ 
          transform: `translateX(${position}px)`,
          transition: isDragging ? 'none' : 'transform 0.2s ease-out'
        }}
        onMouseDown={(e) => handleStart(e.clientX)}
        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
        onMouseMove={(e) => handleMove(e.clientX)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        onMouseUp={handleEnd}
        onTouchEnd={handleEnd}
        onMouseLeave={handleEnd}
      >
        <ArrowRight className="w-6 h-6 text-white" />
      </div>
    </div>
  );
}
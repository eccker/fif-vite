import React, { useState, useRef, useEffect } from 'react';

interface GameCardProps {
  imageUrl: string;
}

interface Position {
  x: number;
  y: number;
}

export function GameCard({ imageUrl }: GameCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const startPosRef = useRef<Position>({ x: 0, y: 0 });
  const dragStartPosRef = useRef<Position>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - dragStartPosRef.current.x;
      const deltaY = e.clientY - dragStartPosRef.current.y;

      setPosition({
        x: startPosRef.current.x + deltaX,
        y: startPosRef.current.y + deltaY,
      });
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        setPosition({ x: 0, y: 0 });
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!cardRef.current) return;

    e.preventDefault();
    setIsDragging(true);
    
    const rect = cardRef.current.getBoundingClientRect();
    startPosRef.current = position;
    dragStartPosRef.current = { x: e.clientX, y: e.clientY };
  };

  return (
    <div className="relative w-full h-full">
      <div
        ref={cardRef}
        onMouseDown={handleMouseDown}
        className={`absolute inset-0 rounded-lg overflow-hidden shadow-lg cursor-grab active:cursor-grabbing transition-all duration-300 ${
          isDragging ? 'shadow-2xl scale-105 z-50' : 'hover:shadow-xl'
        }`}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out',
          touchAction: 'none',
          userSelect: 'none'
        }}
      >
        <img
          src={imageUrl}
          alt="Game card"
          className="w-full h-full object-cover pointer-events-none"
          loading="lazy"
        />
      </div>
    </div>
  );
}
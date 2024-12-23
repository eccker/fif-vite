import React, { useRef, useEffect } from 'react';
import { useDragContext } from '../contexts/DragContext';
import { useGameContext } from '../contexts/GameContext';
import { useDraggable } from '../hooks/useDraggable';

interface GameCardProps {
  imageUrl: string;
  deckId: string;
  index: number;
}

export function GameCard({ imageUrl, deckId, index }: GameCardProps) {
  const [isHighlighted, setIsHighlighted] = React.useState(false);
  const [isMatching, setIsMatching] = React.useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const cardId = `${deckId}-${index}`;
  
  const { isGameOver, isStarted } = useGameContext();
  const { 
    draggedCard,
    draggedImageUrl,
    mousePosition,
    hoveredCard,
    setHoveredCard,
    isDragging: isGlobalDragging 
  } = useDragContext();

  const { isDragging, position, handlers } = useDraggable(cardId, imageUrl);

  useEffect(() => {
    if (!cardRef.current || isGameOver || !isStarted || !isGlobalDragging) return;

    const rect = cardRef.current.getBoundingClientRect();
    if (draggedCard && draggedCard !== cardId) {
      const isUnder = mousePosition.x >= rect.left && 
                     mousePosition.x <= rect.right && 
                     mousePosition.y >= rect.top && 
                     mousePosition.y <= rect.bottom;
      
      if (isUnder) {
        setHoveredCard({ id: cardId, imageUrl });
      } else if (hoveredCard?.id === cardId) {
        setHoveredCard(null);
      }
      
      setIsHighlighted(isUnder);
      setIsMatching(isUnder && draggedImageUrl === imageUrl);
    } else {
      setIsHighlighted(false);
      setIsMatching(false);
    }
  }, [mousePosition, draggedCard, cardId, draggedImageUrl, imageUrl, hoveredCard?.id, setHoveredCard, isGameOver, isStarted, isGlobalDragging]);

  const getHighlightClasses = () => {
    if (isDragging) {
      if (hoveredCard) {
        return `ring-4 ${hoveredCard.imageUrl === draggedImageUrl ? 'ring-green-500' : 'ring-red-500'} ring-opacity-75`;
      }
      return 'ring-4 ring-blue-500 ring-opacity-75';
    }
    if (isHighlighted) {
      return `ring-4 ${isMatching ? 'ring-green-500' : 'ring-red-500'} ring-opacity-75`;
    }
    return '';
  };

  const getCursorClass = () => {
    if (isGameOver || !isStarted) return 'cursor-not-allowed';
    return 'cursor-grab active:cursor-grabbing';
  };

  return (
    <div className="relative w-full h-full">
      <div
        ref={cardRef}
        {...(!isGameOver && isStarted ? handlers : {})}
        className={`absolute inset-0 rounded-lg overflow-hidden shadow-lg transition-all duration-300 ${
          isDragging ? 'shadow-2xl scale-105 z-50' : 'hover:shadow-xl'
        } ${getHighlightClasses()} ${getCursorClass()}`}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          transition: isDragging ? 'none' : 'all 0.3s ease-out',
          touchAction: 'none',
          userSelect: 'none'
        }}
      >
        <img
          src={imageUrl}
          alt="Game card"
          className={`w-full h-full object-cover pointer-events-none transition-all duration-300 ${
            !isStarted ? 'blur-sm brightness-75' : ''
          }`}
          loading="lazy"
          draggable={false}
        />
      </div>
    </div>
  );
}
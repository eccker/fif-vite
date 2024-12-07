import { useState, useRef, useEffect } from 'react';
import { useDragContext } from '../contexts/DragContext';
import { useGameContext } from '../contexts/GameContext';

interface Position {
  x: number;
  y: number;
}

export function useDraggable(cardId: string, imageUrl: string) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const startPosRef = useRef<Position>({ x: 0, y: 0 });
  const dragStartPosRef = useRef<Position>({ x: 0, y: 0 });
  const hasDraggedRef = useRef(false);
  const startTimeRef = useRef(0);

  const { 
    setDraggedCard, 
    setDraggedImageUrl,
    setMousePosition,
    setHoveredCard,
    hoveredCard,
    draggedImageUrl,
    setIsDragging: setGlobalIsDragging
  } = useDragContext();

  const { setIsGameOver, isGameOver } = useGameContext();

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    
    const deltaX = clientX - dragStartPosRef.current.x;
    const deltaY = clientY - dragStartPosRef.current.y;
    
    // Consider it a drag if moved more than 5 pixels in any direction
    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
      hasDraggedRef.current = true;
      setGlobalIsDragging(true);
    }

    setPosition({
      x: startPosRef.current.x + deltaX,
      y: startPosRef.current.y + deltaY,
    });

    setMousePosition({ x: clientX, y: clientY });
  };

  const handleEnd = () => {
    if (isDragging) {
      const dragDuration = Date.now() - startTimeRef.current;
      
      // Only consider it a match if:
      // 1. The user actually dragged (not just clicked)
      // 2. There's a hovered card
      // 3. The images match
      // 4. The drag lasted more than 100ms
      if (hasDraggedRef.current && 
          hoveredCard && 
          draggedImageUrl === hoveredCard.imageUrl &&
          dragDuration > 100) {
        setIsGameOver(true, true, draggedImageUrl);
      }
      
      setIsDragging(false);
      setGlobalIsDragging(false);
      setPosition({ x: 0, y: 0 });
      setDraggedCard(null);
      setDraggedImageUrl(null);
      setHoveredCard(null);
      hasDraggedRef.current = false;
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleEnd);
      window.addEventListener('touchcancel', handleEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
      window.removeEventListener('touchcancel', handleEnd);
    };
  }, [isDragging, hoveredCard, draggedImageUrl]);

  const handleStart = (clientX: number, clientY: number) => {
    if (isGameOver) return;
    
    setIsDragging(true);
    setDraggedCard(cardId);
    setDraggedImageUrl(imageUrl);
    
    startPosRef.current = position;
    dragStartPosRef.current = { x: clientX, y: clientY };
    hasDraggedRef.current = false;
    startTimeRef.current = Date.now();
  };

  return {
    isDragging,
    position,
    handlers: {
      onMouseDown: (e: React.MouseEvent) => {
        e.preventDefault();
        handleStart(e.clientX, e.clientY);
      },
      onTouchStart: (e: React.TouchEvent) => {
        e.preventDefault();
        const touch = e.touches[0];
        handleStart(touch.clientX, touch.clientY);
      }
    }
  };
}
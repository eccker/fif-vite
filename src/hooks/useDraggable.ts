import { useState, useRef, useEffect } from 'react';
import { useDragContext } from '../contexts/DragContext';

interface Position {
  x: number;
  y: number;
}

export function useDraggable(cardId: string, imageUrl: string) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const startPosRef = useRef<Position>({ x: 0, y: 0 });
  const dragStartPosRef = useRef<Position>({ x: 0, y: 0 });

  const { 
    setDraggedCard, 
    setDraggedImageUrl,
    setMousePosition,
    setHoveredCard 
  } = useDragContext();

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;

    const deltaX = clientX - dragStartPosRef.current.x;
    const deltaY = clientY - dragStartPosRef.current.y;

    setPosition({
      x: startPosRef.current.x + deltaX,
      y: startPosRef.current.y + deltaY,
    });

    setMousePosition({ x: clientX, y: clientY });
  };

  const handleEnd = () => {
    if (isDragging) {
      setIsDragging(false);
      setPosition({ x: 0, y: 0 });
      setDraggedCard(null);
      setDraggedImageUrl(null);
      setHoveredCard(null);
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
  }, [isDragging]);

  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setDraggedCard(cardId);
    setDraggedImageUrl(imageUrl);
    
    startPosRef.current = position;
    dragStartPosRef.current = { x: clientX, y: clientY };
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
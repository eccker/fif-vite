import React, { createContext, useContext, useState } from 'react';

interface Position {
  x: number;
  y: number;
}

interface HoveredCard {
  id: string;
  imageUrl: string;
}

interface DragContextType {
  draggedCard: string | null;
  setDraggedCard: (id: string | null) => void;
  draggedImageUrl: string | null;
  setDraggedImageUrl: (url: string | null) => void;
  mousePosition: Position;
  setMousePosition: (position: Position) => void;
  hoveredCard: HoveredCard | null;
  setHoveredCard: (card: HoveredCard | null) => void;
  isDragging: boolean;
  setIsDragging: (value: boolean) => void;
}

const DragContext = createContext<DragContextType | undefined>(undefined);

export function DragProvider({ children }: { children: React.ReactNode }) {
  const [draggedCard, setDraggedCard] = useState<string | null>(null);
  const [draggedImageUrl, setDraggedImageUrl] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState<Position>({ x: 0, y: 0 });
  const [hoveredCard, setHoveredCard] = useState<HoveredCard | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <DragContext.Provider 
      value={{ 
        draggedCard, 
        setDraggedCard,
        draggedImageUrl,
        setDraggedImageUrl,
        mousePosition, 
        setMousePosition,
        hoveredCard,
        setHoveredCard,
        isDragging,
        setIsDragging
      }}
    >
      {children}
    </DragContext.Provider>
  );
}

export function useDragContext() {
  const context = useContext(DragContext);
  if (context === undefined) {
    throw new Error('useDragContext must be used within a DragProvider');
  }
  return context;
}
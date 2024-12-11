import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface GameData {
  deckSamples: any[];
  imageUrls: { images: string[] };
  currentLevel: number;
}

interface SocketContextType {
  socket: Socket | null;
  gameData: GameData | null;
  isGenerating: boolean;
  requestNewGame: () => void;
  requestNextLevel: (currentLevel: number) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    console.log('[SocketContext:useEffect] Initializing socket connection');
    const newSocket = io('https://finditfirst.xyz', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    newSocket.on('connect', () => {
      console.log('[SocketContext:socket.connect] Socket connected');
      setSocket(newSocket);
      setIsGenerating(true);
      newSocket.emit('requestNewGame');
    });

    newSocket.on('connect_error', (error) => {
      console.error('[SocketContext:socket.connect_error] Connection error:', error);
    });

    return () => {
      console.log('[SocketContext:useEffect] Cleaning up socket connection');
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    console.log('[SocketContext:useEffect] Setting up socket event listeners');
    
    socket.on('gameData', (data: GameData) => {
      console.log('[SocketContext:socket.gameData] Received game data');
      setGameData(data);
      setIsGenerating(false);
    });

    socket.on('nextLevelData', (data) => {
      console.log('[SocketContext:socket.nextLevelData] Received next level data');
      if (data) {
        setGameData(prev => prev ? {
          ...prev,
          currentLevel: data.level,
          deckSamples: [...prev.deckSamples.slice(0, data.level), data.levelData]
        } : null);
      }
    });

    socket.on('error', (error) => {
      console.error('[SocketContext:socket.error] Socket error:', error);
      setIsGenerating(false);
    });

    return () => {
      console.log('[SocketContext:useEffect] Removing socket event listeners');
      socket.off('gameData');
      socket.off('nextLevelData');
      socket.off('error');
    };
  }, [socket]);

  const requestNewGame = () => {
    if (socket?.connected) {
      console.log('[SocketContext:requestNewGame] Requesting new game');
      setIsGenerating(true);
      setGameData(null);
      socket.emit('requestNewGame');
    } else {
      console.warn('[SocketContext:requestNewGame] Socket not connected');
    }
  };

  const requestNextLevel = (currentLevel: number) => {
    if (socket?.connected) {
      console.log('[SocketContext:requestNextLevel] Requesting next level:', currentLevel);
      socket.emit('requestNextLevel', currentLevel);
    } else {
      console.warn('[SocketContext:requestNextLevel] Socket not connected');
    }
  };

  return (
    <SocketContext.Provider value={{ socket, gameData, isGenerating, requestNewGame, requestNextLevel }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}
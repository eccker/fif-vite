import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { GameState } from '../types/game';

interface GameContextType {
  gameState: GameState | null;
  isConnected: boolean;
  startGame: () => void;
  matchCards: (topCardId: string, bottomCardId: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [gameState, setGameState] = useState<GameState | null>(null);

  useEffect(() => {
    const newSocket = io('wss://wss.finditfirst.xyz');
    
    newSocket.on('connect', () => {
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('gameState', (state: GameState) => {
      setGameState(state);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const startGame = () => {
    socket?.emit('startGame');
  };

  const matchCards = (topCardId: string, bottomCardId: string) => {
    socket?.emit('matchCards', { topCardId, bottomCardId });
  };

  return (
    <GameContext.Provider value={{ gameState, isConnected, startGame, matchCards }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
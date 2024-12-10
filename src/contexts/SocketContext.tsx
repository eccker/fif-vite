import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  gameData: any;
  requestNewGame: () => void;
  requestNextLevel: (currentLevel: number) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [gameData, setGameData] = useState(null);

  useEffect(() => {
    const newSocket = io('https://finditfirst.xyz');
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('gameData', (data) => {
      setGameData(data);
    });

    socket.on('nextLevelData', (data) => {
      // Handle next level data
      console.log('Next level data received:', data);
    });

    return () => {
      socket.off('gameData');
      socket.off('nextLevelData');
    };
  }, [socket]);

  const requestNewGame = () => {
    if (socket) {
      socket.emit('requestNewGame');
    }
  };

  const requestNextLevel = (currentLevel: number) => {
    if (socket) {
      socket.emit('requestNextLevel', currentLevel);
    }
  };

  return (
    <SocketContext.Provider value={{ socket, gameData, requestNewGame, requestNextLevel }}>
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
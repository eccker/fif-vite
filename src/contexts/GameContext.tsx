import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSocket } from './SocketContext';

interface GameState {
  topDeck: string[];
  bottomDeck: string[];
  timeLimit: number;
  startTime: number;
  currentSampleIndex: number;
  currentSetIndex: number;
}

interface GameContextType {
  gameState: GameState;
  isGameOver: boolean;
  isSuccess: boolean;
  isStarted: boolean;
  isLoading: boolean;
  lives: number;
  score: number;
  shuffleCount: number;
  matchedImageUrl: string | null;
  setIsGameOver: (value: boolean, success?: boolean, matchedUrl?: string) => void;
  resetGame: () => void;
  loadNewCards: () => void;
  startGame: () => void;
  stopGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);
const INITIAL_LIVES = 3;

function initializeGameState(): GameState {
  return {
    topDeck: [],
    bottomDeck: [],
    timeLimit: 0,
    startTime: Date.now(),
    currentSampleIndex: 0,
    currentSetIndex: 0
  };
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const { gameData, requestNewGame, isGenerating } = useSocket();
  const [gameState, setGameState] = useState<GameState>(initializeGameState());
  const [isGameOver, setIsGameOverState] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [score, setScore] = useState(0);
  const [shuffleCount, setShuffleCount] = useState(0);
  const [matchedImageUrl, setMatchedImageUrl] = useState<string | null>(null);
  const [nextState, setNextState] = useState<Partial<GameState> | null>(null);

  useEffect(() => {
    setIsLoading(!gameData || isGenerating);
  }, [gameData, isGenerating]);

  useEffect(() => {
    if (gameData) {
      console.log('[GameContext:useEffect] Initializing game with received data');
      const currentSample = gameData.deckSamples[0].samples[0];
      const imageUrls = gameData.imageUrls.images;
      
      setGameState({
        topDeck: currentSample.topDeck.map((index: number) => imageUrls[index]),
        bottomDeck: currentSample.bottomDeck.map((index: number) => imageUrls[index]),
        timeLimit: gameData.deckSamples[0].timeLimit,
        startTime: Date.now(),
        currentSampleIndex: 0,
        currentSetIndex: 0
      });
    }
  }, [gameData]);

  const calculateScore = (level: number, elapsedTime: number, currentShuffles: number) => {
    const levelScore = level * 1000;
    const timeRatio = Math.max(0, (gameState.timeLimit - elapsedTime) / gameState.timeLimit);
    const timeScore = Math.floor(level * 1000 * timeRatio);
    const shufflePenalty = currentShuffles * 100;
    return Math.max(0, levelScore + timeScore - shufflePenalty);
  };

  const handleGameOver = (value: boolean, success: boolean = false, matchedUrl?: string) => {
    if (!value || isGameOver) return;
    
    setIsGameOverState(value);
    setIsSuccess(success);
    setMatchedImageUrl(matchedUrl || null);
    
    if (success) {
      const elapsedTime = Date.now() - gameState.startTime;
      const roundScore = calculateScore(gameState.currentSetIndex + 1, elapsedTime, shuffleCount);
      setScore(prevScore => prevScore + roundScore);
      
      if (gameState.currentSetIndex === gameData!.deckSamples.length - 1) {
        setIsStarted(false);
      } else {
        const nextSample = gameData!.deckSamples[gameState.currentSetIndex + 1].samples[0];
        const imageUrls = gameData!.imageUrls.images;
        setNextState({
          topDeck: nextSample.topDeck.map((index: number) => imageUrls[index]),
          bottomDeck: nextSample.bottomDeck.map((index: number) => imageUrls[index]),
          timeLimit: gameData!.deckSamples[gameState.currentSetIndex + 1].timeLimit,
          startTime: Date.now(),
          currentSampleIndex: 0,
          currentSetIndex: gameState.currentSetIndex + 1
        });
      }
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      if (newLives <= 0) {
        setIsStarted(false);
      }
      setNextState({
        ...gameState,
        startTime: Date.now()
      });
    }
  };

  const resetGame = () => {
    if (lives <= 0 || (isSuccess && gameState.currentSetIndex === gameData!.deckSamples.length - 1)) {
      setLives(INITIAL_LIVES);
      setScore(0);
      const currentSample = gameData!.deckSamples[0].samples[0];
      const imageUrls = gameData!.imageUrls.images;
      setGameState({
        topDeck: currentSample.topDeck.map((index: number) => imageUrls[index]),
        bottomDeck: currentSample.bottomDeck.map((index: number) => imageUrls[index]),
        timeLimit: gameData!.deckSamples[0].timeLimit,
        startTime: Date.now(),
        currentSampleIndex: 0,
        currentSetIndex: 0
      });
    } else if (nextState) {
      setGameState(state => ({
        ...state,
        ...nextState
      }));
      setNextState(null);
    } else {
      setGameState(state => ({
        ...state,
        startTime: Date.now()
      }));
    }
    setShuffleCount(0);
    setIsGameOverState(false);
    setIsSuccess(false);
    setMatchedImageUrl(null);
  };

  const loadNewCards = () => {
    if (isGameOver || !isStarted || !gameData) return;
    
    setShuffleCount(count => count + 1);
    const nextSampleIndex = (gameState.currentSampleIndex + 1) % gameData.deckSamples[gameState.currentSetIndex].samples.length;
    const nextSample = gameData.deckSamples[gameState.currentSetIndex].samples[nextSampleIndex];
    const imageUrls = gameData.imageUrls.images;
    
    setGameState(state => ({
      ...state,
      topDeck: nextSample.topDeck.map((index: number) => imageUrls[index]),
      bottomDeck: nextSample.bottomDeck.map((index: number) => imageUrls[index]),
      currentSampleIndex: nextSampleIndex
    }));
  };

  const startGame = () => {
    setGameState(state => ({
      ...state,
      startTime: Date.now(),
    }));
    setIsStarted(true);
    setIsGameOverState(false);
    setIsSuccess(false);
    setShuffleCount(0);
    setMatchedImageUrl(null);
  };

  const stopGame = () => {
    setIsLoading(true);
    setIsStarted(false);
    setIsGameOverState(false);
    setIsSuccess(false);
    setLives(INITIAL_LIVES);
    setScore(0);
    setShuffleCount(0);
    setMatchedImageUrl(null);
    setNextState(null);
    requestNewGame();
  };

  return (
    <GameContext.Provider value={{ 
      gameState, 
      isGameOver,
      isSuccess,
      isStarted,
      isLoading,
      lives,
      score,
      shuffleCount,
      matchedImageUrl,
      setIsGameOver: handleGameOver,
      resetGame,
      loadNewCards,
      startGame,
      stopGame
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
}
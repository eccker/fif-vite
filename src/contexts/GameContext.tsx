import React, { createContext, useContext, useState } from 'react';
import { initializeGameState, type GameState, getNextDeck } from '../data/imageCollection';
import deckSamples from '../data/deckSamples.json';

interface GameContextType {
  gameState: GameState;
  isGameOver: boolean;
  isSuccess: boolean;
  isStarted: boolean;
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
const MAX_LEVEL = deckSamples.length;

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gameState, setGameState] = useState<GameState>(initializeGameState());
  const [isGameOver, setIsGameOver] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [score, setScore] = useState(0);
  const [shuffleCount, setShuffleCount] = useState(0);
  const [matchedImageUrl, setMatchedImageUrl] = useState<string | null>(null);
  const [nextState, setNextState] = useState<Partial<GameState> | null>(null);

  const calculateScore = (level: number, elapsedTime: number, currentShuffles: number) => {
    const levelScore = level * 1000;
    const timeRatio = Math.max(0, (gameState.timeLimit - elapsedTime) / gameState.timeLimit);
    const timeScore = Math.floor(level * 1000 * timeRatio);
    const shufflePenalty = currentShuffles * 100;
    return Math.max(0, levelScore + timeScore - shufflePenalty);
  };

  const handleGameOver = (value: boolean, success: boolean = false, matchedUrl?: string) => {
    if (!value || isGameOver) return;
    
    setIsGameOver(value);
    setIsSuccess(success);
    setMatchedImageUrl(matchedUrl || null);
    
    if (success) {
      const elapsedTime = (Date.now() - gameState.startTime) / 1000;
      const roundScore = calculateScore(gameState.currentSetIndex + 1, elapsedTime, shuffleCount);
      setScore(prevScore => prevScore + roundScore);
      
      if (gameState.currentSetIndex === MAX_LEVEL - 1) {
        setIsStarted(false);
      } else {
        const next = getNextDeck(gameState.currentSetIndex, gameState.currentSampleIndex, true);
        setNextState(next);
      }
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      if (newLives <= 0) {
        setIsStarted(false);
      }
    }
  };

  const resetGame = () => {
    if (lives <= 0 || gameState.currentSetIndex === MAX_LEVEL - 1) {
      setLives(INITIAL_LIVES);
      setScore(0);
      const newState = initializeGameState();
      setGameState(newState);
    } else if (nextState) {
      setGameState(state => ({
        ...state,
        ...nextState,
        startTime: Date.now()
      }));
      setNextState(null);
    } else {
      setGameState(state => ({
        ...state,
        startTime: Date.now()
      }));
    }
    setShuffleCount(0);
    setIsGameOver(false);
    setIsSuccess(false);
    setMatchedImageUrl(null);
  };

  const loadNewCards = () => {
    if (isGameOver || !isStarted) return;
    
    setShuffleCount(count => count + 1);
    setGameState(state => {
      const nextState = getNextDeck(state.currentSetIndex, state.currentSampleIndex, false);
      return {
        ...state,
        ...nextState
      };
    });
  };

  const startGame = () => {
    setGameState(state => ({
      ...state,
      startTime: Date.now(),
    }));
    setIsStarted(true);
    setIsGameOver(false);
    setIsSuccess(false);
    setShuffleCount(0);
    setMatchedImageUrl(null);
  };

  const stopGame = () => {
    setIsStarted(false);
    setIsGameOver(false);
    setIsSuccess(false);
    setLives(INITIAL_LIVES);
    setScore(0);
    setShuffleCount(0);
    setMatchedImageUrl(null);
    setNextState(null);
    setGameState(initializeGameState());
  };

  return (
    <GameContext.Provider value={{ 
      gameState, 
      isGameOver,
      isSuccess,
      isStarted,
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
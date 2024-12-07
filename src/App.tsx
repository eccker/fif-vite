import React from 'react';
import { CardDeck } from './components/CardDeck';
import { ReloadButton } from './components/ReloadButton';
import { StartButton } from './components/StartButton';
import { StopButton } from './components/StopButton';
import { ProgressBar } from './components/ProgressBar';
import { SuccessMessage } from './components/SuccessMessage';
import { LivesIndicator } from './components/LivesIndicator';
import { LevelIndicator } from './components/LevelIndicator';
import { ScoreIndicator } from './components/ScoreIndicator';
import { Menu } from './components/Menu';
import { Layout } from './components/Layout';
import { DragProvider } from './contexts/DragContext';
import { GameProvider, useGameContext } from './contexts/GameContext';
import { ThemeProvider } from './contexts/ThemeContext';

function GameContent() {
  const { 
    gameState, 
    isGameOver, 
    isStarted,
    startGame,
    stopGame,
    loadNewCards
  } = useGameContext();

  return (
    <Layout>
      <Menu />
      <header className="flex-none text-center mb-2">
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Find It First</h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300">Find a match before time expires</p>
        <div className="mt-2 px-4 max-w-md mx-auto space-y-2">
          <div className="flex justify-center items-center gap-4">
            <LivesIndicator />
            <LevelIndicator />
            <ScoreIndicator />
          </div>
          <ProgressBar 
            timeLimit={gameState.timeLimit}
            startTime={gameState.startTime}
          />
        </div>
      </header>

      <main className="flex-1 flex flex-col justify-between gap-4 relative">
        <section className="flex-1">
          <CardDeck deckId="top" images={gameState.topDeck} />
        </section>
        
        <section className="flex-1">
          <CardDeck deckId="bottom" images={gameState.bottomDeck} />
        </section>

        {isGameOver && <SuccessMessage />}
      </main>

      <footer className="flex-none flex justify-center gap-4 pt-2">
        {!isGameOver && (
          isStarted ? (
            <>
              <StopButton onClick={stopGame} />
              <ReloadButton onClick={loadNewCards} />
            </>
          ) : (
            <StartButton onClick={startGame} />
          )
        )}
      </footer>
    </Layout>
  );
}

function App() {
  return (
    <ThemeProvider>
      <GameProvider>
        <DragProvider>
          <GameContent />
        </DragProvider>
      </GameProvider>
    </ThemeProvider>
  );
}

export default App;
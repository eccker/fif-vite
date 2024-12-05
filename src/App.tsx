import React, { useEffect } from 'react';
import { CardDeck } from './components/CardDeck';
import { PlayButton } from './components/PlayButton';
import { Layout } from './components/Layout';
import { DragProvider } from './contexts/DragContext';
import { GameProvider } from './contexts/GameContext';
import { useGame } from './contexts/GameContext';
import { RotateCw } from 'lucide-react';

function GameContent() {
  const { gameState, startGame, isConnected } = useGame();

  useEffect(() => {
    if (isConnected && (!gameState || gameState.gameStatus === 'waiting')) {
      startGame();
    }
  }, [isConnected, gameState, startGame]);

  return (
    <>
      <header className="flex-none text-center mb-2">
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Find It First</h1>
          {gameState && (
            <button
              onClick={startGame}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              title="Restart game"
            >
              <RotateCw className="w-6 h-6 text-gray-600" />
            </button>
          )}
        </div>
        <p className="text-lg text-gray-600">A simple but fun game</p>
        {gameState && (
          <p className="text-xl font-semibold text-indigo-600 mt-1">
            Score: {gameState.score}
          </p>
        )}
      </header>

      <main className="flex-1 flex flex-col justify-between gap-4">
        <section className="flex-1">
          <CardDeck deckId="top" />
        </section>
        
        <section className="flex-1">
          <CardDeck deckId="bottom" />
        </section>
      </main>

      <footer className="flex-none flex justify-center pt-2">
        <PlayButton url="https://dapp.finditfirst.xyz" />
      </footer>
    </>
  );
}

function App() {
  return (
    <GameProvider>
      <DragProvider>
        <Layout>
          <GameContent />
        </Layout>
      </DragProvider>
    </GameProvider>
  );
}

export default App;
import React from 'react';
import { CardDeck } from './components/CardDeck';
import { PlayButton } from './components/PlayButton';
import { Layout } from './components/Layout';
import { DragProvider } from './contexts/DragContext';

function App() {
  return (
    <DragProvider>
      <Layout>
        <header className="flex-none text-center mb-2">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Find It First</h1>
          </div>
          <p className="text-lg text-gray-600">A simple but fun game</p>
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
      </Layout>
    </DragProvider>
  );
}

export default App;
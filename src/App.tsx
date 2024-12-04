import React from 'react';
import { CardDeck } from './components/CardDeck';
import { PlayButton } from './components/PlayButton';

function App() {
  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
      <header className="flex-none text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Find It First</h1>
        <p className="text-lg text-gray-600">A simple but fun game</p>
      </header>

      <main className="flex-1 flex items-center justify-center my-2">
        <CardDeck />
      </main>

      <footer className="flex-none flex justify-center pb-2">
        <PlayButton url="https://dapp.finditfirst.xyz" />
      </footer>
    </div>
  );
}

export default App;
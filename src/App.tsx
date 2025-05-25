import React from 'react';
import DominoGame from './components/DominoGame';

function App() {
  return (
    <div className="min-h-screen bg-green-800">
      <header className="bg-green-900 shadow-lg py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-white">Domino Game</h1>
        </div>
      </header>
      <main>
        <DominoGame />
      </main>
    </div>
  );
}

export default App;
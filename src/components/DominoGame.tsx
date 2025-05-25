import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Domino, GameState } from '../types';

const DOMINO_WIDTH = 100;
const DOMINO_HEIGHT = 200;

const initialDominoes: Domino[] = Array.from({ length: 28 }, (_, i) => {
  const top = Math.floor(i / 7);
  const bottom = (i % 7) + (top + 1);
  return {
    id: `${top}-${bottom}`,
    top,
    bottom,
    image: `/src/data/img/${top}${bottom}.jpg`,
    position: { x: 0, y: 0 }
  };
});

const shuffleDominoes = (dominoes: Domino[]): Domino[] => {
  const shuffled = [...dominoes];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const DominoGame: React.FC = () => {
  const [showRules, setShowRules] = useState(false);
  const [gameState, setGameState] = useState<GameState>(() => {
    const shuffled = shuffleDominoes(initialDominoes);
    return {
      players: [
        { id: 'player1', dominoes: shuffled.slice(0, 7), score: 0 },
        { id: 'player2', dominoes: shuffled.slice(7, 14), score: 0 }
      ],
      boardDominoes: [],
      boneyard: shuffled.slice(14),
      currentPlayer: 0,
      gameStatus: 'playing',
      message: "Player 1's turn"
    };
  });

  const isValidMove = (domino: Domino): boolean => {
    if (gameState.boardDominoes.length === 0) {
      return true;
    }

    const firstDomino = gameState.boardDominoes[0];
    const lastDomino = gameState.boardDominoes[gameState.boardDominoes.length - 1];

    return (
      domino.top === firstDomino.top ||
      domino.top === lastDomino.bottom ||
      domino.bottom === firstDomino.top ||
      domino.bottom === lastDomino.bottom
    );
  };

  const calculateScore = (dominoes: Domino[]): number => {
    return dominoes.reduce((sum, domino) => sum + domino.top + domino.bottom, 0);
  };

  const drawFromBoneyard = () => {
    if (gameState.boneyard.length === 0) {
      setGameState(prev => ({
        ...prev,
        message: "No more dominoes in the boneyard!",
      }));
      return;
    }

    const [drawnDomino, ...remainingBoneyard] = gameState.boneyard;
    const updatedPlayers = [...gameState.players];
    updatedPlayers[gameState.currentPlayer].dominoes.push(drawnDomino);

    setGameState(prev => ({
      ...prev,
      players: updatedPlayers,
      boneyard: remainingBoneyard,
      message: `${prev.currentPlayer === 0 ? 'Player 1' : 'Player 2'} drew a domino`,
    }));
  };

  const checkGameEnd = () => {
    const currentPlayer = gameState.players[gameState.currentPlayer];
    
    if (currentPlayer.dominoes.length === 0) {
      const opponentScore = calculateScore(gameState.players[1 - gameState.currentPlayer].dominoes);
      const updatedPlayers = [...gameState.players];
      updatedPlayers[gameState.currentPlayer].score += opponentScore;

      setGameState(prev => ({
        ...prev,
        players: updatedPlayers,
        gameStatus: 'ended',
        message: `Player ${gameState.currentPlayer + 1} wins! Score: ${opponentScore} points`,
      }));
      return true;
    }

    if (gameState.boneyard.length === 0 && !gameState.players.some(player => 
      player.dominoes.some(domino => isValidMove(domino)))) {
      const scores = gameState.players.map(player => calculateScore(player.dominoes));
      const winner = scores[0] <= scores[1] ? 0 : 1;
      
      setGameState(prev => ({
        ...prev,
        gameStatus: 'ended',
        message: `Game blocked! Player ${winner + 1} wins with fewer points!`,
      }));
      return true;
    }

    return false;
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const currentPlayer = gameState.players[gameState.currentPlayer];
    
    if (source.droppableId !== currentPlayer.id) {
      setGameState(prev => ({
        ...prev,
        message: "Not your turn!"
      }));
      return;
    }

    const [movedDomino] = currentPlayer.dominoes.splice(source.index, 1);

    if (!isValidMove(movedDomino)) {
      currentPlayer.dominoes.splice(source.index, 0, movedDomino);
      setGameState(prev => ({
        ...prev,
        message: "Invalid move! Numbers must match."
      }));
      return;
    }

    if (destination.droppableId === 'board') {
      const updatedBoard = [...gameState.boardDominoes];
      updatedBoard.splice(destination.index, 0, movedDomino);

      if (!checkGameEnd()) {
        setGameState(prev => ({
          ...prev,
          boardDominoes: updatedBoard,
          currentPlayer: 1 - prev.currentPlayer,
          message: `Player ${2 - prev.currentPlayer}'s turn`,
        }));
      }
    } else {
      const destPlayer = gameState.players.find(p => p.id === destination.droppableId);
      if (destPlayer) {
        destPlayer.dominoes.splice(destination.index, 0, movedDomino);
      }
    }
  };

  return (
    <div className="min-h-screen bg-green-800 p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-white text-2xl">Classic Domino Game</h2>
        <div className="flex gap-4">
          <button
            onClick={drawFromBoneyard}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            disabled={gameState.gameStatus === 'ended'}
          >
            Draw from Boneyard ({gameState.boneyard.length})
          </button>
          <button
            onClick={() => setShowRules(!showRules)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {showRules ? 'Hide Rules' : 'Show Rules'}
          </button>
        </div>
      </div>

      <div className="bg-green-700 rounded-lg p-4 mb-8">
        <p className="text-white text-lg">{gameState.message}</p>
        <div className="flex justify-between mt-2">
          <p className="text-white">Player 1 Score: {gameState.players[0].score}</p>
          <p className="text-white">Player 2 Score: {gameState.players[1].score}</p>
        </div>
      </div>

      {showRules && (
        <div className="bg-white rounded-lg p-6 mb-8 shadow-lg">
          <h3 className="text-xl font-bold mb-4">Classic Domino Rules</h3>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-lg mb-2">Setup:</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>The game is played with 28 dominoes</li>
                <li>Each player draws 7 dominoes to start</li>
                <li>Remaining dominoes form the "boneyard" (draw pile)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-2">Gameplay:</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>Player with the highest double domino plays first</li>
                <li>Players take turns placing matching dominoes</li>
                <li>Matching numbers must touch when placing dominoes</li>
                <li>If a player cannot play, they must draw from the boneyard</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-2">Winning:</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>First player to play all their dominoes wins</li>
                <li>If no one can play, the player with the lowest pip count wins</li>
                <li>Points are counted based on remaining dominoes in opponents' hands</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="mb-8">
          <h2 className="text-white text-2xl mb-4">Game Board</h2>
          <Droppable droppableId="board" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="min-h-[220px] bg-green-900 p-4 rounded-lg flex gap-2"
              >
                {gameState.boardDominoes.map((domino, index) => (
                  <Draggable key={domino.id} draggableId={domino.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="w-[100px] h-[200px] bg-white rounded-lg shadow-lg"
                        style={{
                          backgroundImage: `url(${domino.image})`,
                          backgroundSize: 'cover',
                          ...provided.draggableProps.style
                        }}
                      />
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>

        {gameState.players.map((player, playerIndex) => (
          <div key={player.id} className="mb-8">
            <h2 className="text-white text-2xl mb-4">
              Player {playerIndex + 1} {gameState.currentPlayer === playerIndex && '(Current Turn)'}
            </h2>
            <Droppable droppableId={player.id} direction="horizontal">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="min-h-[220px] bg-green-700 p-4 rounded-lg flex gap-2"
                >
                  {player.dominoes.map((domino, index) => (
                    <Draggable key={domino.id} draggableId={domino.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="w-[100px] h-[200px] bg-white rounded-lg shadow-lg"
                          style={{
                            backgroundImage: `url(${domino.image})`,
                            backgroundSize: 'cover',
                            ...provided.draggableProps.style
                          }}
                        />
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </DragDropContext>
    </div>
  );
};

export default DominoGame;
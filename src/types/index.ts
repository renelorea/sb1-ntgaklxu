export interface Domino {
  id: string;
  top: number;
  bottom: number;
  image: string;
  position: {
    x: number;
    y: number;
  };
}

export interface Player {
  id: string;
  dominoes: Domino[];
  score: number;
}

export interface GameState {
  players: Player[];
  boardDominoes: Domino[];
  boneyard: Domino[];
  currentPlayer: number;
  gameStatus: 'playing' | 'ended';
  message: string;
}
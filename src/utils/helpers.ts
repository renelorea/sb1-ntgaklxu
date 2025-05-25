import { Card } from '../types';

// Generate random initial positions for cards
export const generateRandomPosition = (
  containerWidth: number,
  containerHeight: number,
  cardWidth: number,
  cardHeight: number
) => {
  const maxX = containerWidth - cardWidth;
  const maxY = containerHeight - cardHeight;
  
  return {
    x: Math.max(0, Math.floor(Math.random() * maxX)),
    y: Math.max(0, Math.floor(Math.random() * maxY))
  };
};

// Create a grid layout for the cards
export const createGridLayout = (
  cards: Card[],
  containerWidth: number,
  cardWidth: number,
  cardHeight: number,
  gapX = 20,
  gapY = 20
): Card[] => {
  const cardsPerRow = Math.max(1, Math.floor(containerWidth / (cardWidth + gapX)));
  
  return cards.map((card, index) => {
    const row = Math.floor(index / cardsPerRow);
    const col = index % cardsPerRow;
    
    return {
      ...card,
      position: {
        x: col * (cardWidth + gapX),
        y: row * (cardHeight + gapY)
      }
    };
  });
};

// Shuffle array using Fisher-Yates algorithm
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
};

// Get a random color from a predefined palette
export const getRandomColor = (): string => {
  const colors = [
    '#3B82F6', // blue
    '#10B981', // emerald
    '#F59E0B', // amber
    '#EF4444', // red
    '#8B5CF6', // violet
    '#EC4899', // pink
    '#14B8A6', // teal
    '#F97316', // orange
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
};
import React, { useState, useEffect, useCallback } from 'react';
import DominoCard from './DominoCard';
import { Card } from '../types';
import { useDragDrop } from '../hooks/useDragDrop';
import { getRandomQuestionsAnswers } from '../data/questionsAnswers';
import { createGridLayout, generateRandomPosition, shuffleArray } from '../utils/helpers';

interface DominoDeckProps {
  cardCount?: number;
  containerWidth: number;
  containerHeight: number;
}

const CARD_WIDTH = 200;
const CARD_HEIGHT = 280;

const DominoDeck: React.FC<DominoDeckProps> = ({
  cardCount = 30,
  containerWidth,
  containerHeight,
}) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [layoutMode, setLayoutMode] = useState<'grid' | 'random' | 'stack'>('grid');
  const [draggedCard, setDraggedCard] = useState<number | null>(null);
  
  // Generate initial cards
  useEffect(() => {
    const randomQA = getRandomQuestionsAnswers(cardCount);
    
    const newCards: Card[] = randomQA.map((qa, index) => ({
      id: index + 1,
      question: qa.question,
      answer: qa.answer,
      isFlipped: false,
      position: generateRandomPosition(
        containerWidth,
        containerHeight,
        CARD_WIDTH,
        CARD_HEIGHT
      ),
    }));
    
    setCards(createGridLayout(newCards, containerWidth, CARD_WIDTH, CARD_HEIGHT));
  }, [cardCount, containerWidth, containerHeight]);
  
  // Handle card flipping
  const handleFlipCard = useCallback((id: number) => {
    setCards(prevCards => 
      prevCards.map(card => 
        card.id === id ? { ...card, isFlipped: !card.isFlipped } : card
      )
    );
  }, []);
  
  // Handle card position update after drag
  const handleCardPositionUpdate = useCallback((updatedCard: Card) => {
    setCards(prevCards => 
      prevCards.map(card => 
        card.id === updatedCard.id ? { ...card, position: updatedCard.position } : card
      )
    );
  }, []);
  
  // Set up drag and drop
  const { dragState, handleDragStart, setupDragListeners, containerRef } = useDragDrop(
    cards,
    { onDragEnd: handleCardPositionUpdate }
  );
  
  // Set up event listeners for drag and drop
  useEffect(() => {
    const cleanup = setupDragListeners();
    return cleanup;
  }, [setupDragListeners]);
  
  // Update dragged card
  useEffect(() => {
    setDraggedCard(dragState.draggedCardId);
  }, [dragState.draggedCardId]);
  
  // Apply different layouts
  const applyLayout = useCallback((mode: 'grid' | 'random' | 'stack') => {
    setLayoutMode(mode);
    
    switch (mode) {
      case 'grid':
        setCards(prevCards => 
          createGridLayout(prevCards, containerWidth, CARD_WIDTH, CARD_HEIGHT)
        );
        break;
      case 'random':
        setCards(prevCards => 
          prevCards.map(card => ({
            ...card,
            position: generateRandomPosition(
              containerWidth,
              containerHeight,
              CARD_WIDTH,
              CARD_HEIGHT
            ),
          }))
        );
        break;
      case 'stack':
        setCards(prevCards => 
          prevCards.map((card, index) => ({
            ...card,
            position: {
              x: containerWidth / 2 - CARD_WIDTH / 2 + index * 2,
              y: containerHeight / 2 - CARD_HEIGHT / 2 + index * 2,
            },
          }))
        );
        break;
    }
  }, [containerWidth, containerHeight]);
  
  // Shuffle questions and answers
  const shuffleCards = useCallback(() => {
    const randomQA = getRandomQuestionsAnswers(cardCount);
    setCards(prevCards => {
      const newCards = prevCards.map((card, index) => ({
        ...card,
        question: randomQA[index].question,
        answer: randomQA[index].answer,
        isFlipped: false,
      }));
      
      return layoutMode === 'grid' 
        ? createGridLayout(newCards, containerWidth, CARD_WIDTH, CARD_HEIGHT)
        : newCards;
    });
  }, [cardCount, containerWidth, layoutMode]);
  
  // Flip all cards back
  const resetCards = useCallback(() => {
    setCards(prevCards => 
      prevCards.map(card => ({ ...card, isFlipped: false }))
    );
  }, []);
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-center space-x-4 mb-4 p-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          onClick={() => applyLayout('grid')}
        >
          Grid Layout
        </button>
        <button
          className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors"
          onClick={() => applyLayout('random')}
        >
          Random Layout
        </button>
        <button
          className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
          onClick={() => applyLayout('stack')}
        >
          Stack Layout
        </button>
        <button
          className="px-4 py-2 bg-violet-500 text-white rounded-md hover:bg-violet-600 transition-colors"
          onClick={shuffleCards}
        >
          Shuffle Questions
        </button>
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          onClick={resetCards}
        >
          Reset Flips
        </button>
      </div>
      
      <div 
        ref={containerRef}
        className="relative flex-grow bg-gray-50 rounded-lg overflow-hidden"
        style={{ width: containerWidth, height: containerHeight }}
      >
        {cards.map(card => (
          <DominoCard
            key={card.id}
            card={card}
            onFlip={handleFlipCard}
            onDragStart={handleDragStart}
            isDragging={dragState.isDragging && dragState.draggedCardId === card.id}
            dragOffset={dragState.isDragging && dragState.draggedCardId === card.id ? dragState.currentOffset : null}
            isDraggable={layoutMode !== 'stack'}
          />
        ))}
      </div>
      
      <div className="p-4 text-center text-sm text-gray-500">
        Click a card to flip it, drag to rearrange. Use the buttons above to change layouts.
      </div>
    </div>
  );
};

export default DominoDeck;
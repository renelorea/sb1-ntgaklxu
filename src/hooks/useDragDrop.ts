import { useState, useCallback, useRef } from 'react';
import { Card } from '../types';

interface UseDragDropOptions {
  onDragEnd?: (card: Card) => void;
}

interface DragState {
  isDragging: boolean;
  draggedCardId: number | null;
  startPosition: { x: number; y: number } | null;
  currentOffset: { x: number; y: number } | null;
}

export const useDragDrop = (cards: Card[], options?: UseDragDropOptions) => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedCardId: null,
    startPosition: null,
    currentOffset: null,
  });
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  const handleDragStart = useCallback((id: number, event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    
    let clientX: number, clientY: number;
    
    if ('touches' in event) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }
    
    const card = cards.find(c => c.id === id);
    if (!card) return;
    
    setDragState({
      isDragging: true,
      draggedCardId: id,
      startPosition: { 
        x: clientX - card.position.x, 
        y: clientY - card.position.y 
      },
      currentOffset: { x: 0, y: 0 },
    });
  }, [cards]);
  
  const handleDragMove = useCallback((event: MouseEvent | TouchEvent) => {
    if (!dragState.isDragging || dragState.draggedCardId === null || !dragState.startPosition) {
      return;
    }
    
    let clientX: number, clientY: number;
    
    if ('touches' in event) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }
    
    setDragState(prevState => ({
      ...prevState,
      currentOffset: {
        x: clientX - prevState.startPosition!.x,
        y: clientY - prevState.startPosition!.y,
      },
    }));
  }, [dragState]);
  
  const handleDragEnd = useCallback(() => {
    if (dragState.isDragging && dragState.draggedCardId !== null && dragState.currentOffset) {
      const updatedCard = cards.find(c => c.id === dragState.draggedCardId);
      if (updatedCard && options?.onDragEnd) {
        const newCard = {
          ...updatedCard,
          position: {
            x: dragState.currentOffset.x,
            y: dragState.currentOffset.y,
          },
        };
        options.onDragEnd(newCard);
      }
    }
    
    setDragState({
      isDragging: false,
      draggedCardId: null,
      startPosition: null,
      currentOffset: null,
    });
  }, [cards, dragState, options]);
  
  // Setup and cleanup event listeners
  const setupDragListeners = useCallback(() => {
    window.addEventListener('mousemove', handleDragMove);
    window.addEventListener('touchmove', handleDragMove);
    window.addEventListener('mouseup', handleDragEnd);
    window.addEventListener('touchend', handleDragEnd);
    
    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('touchmove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [handleDragMove, handleDragEnd]);
  
  return {
    dragState,
    handleDragStart,
    setupDragListeners,
    containerRef,
  };
};
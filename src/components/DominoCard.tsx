import React, { useState } from 'react';
import { Card as CardType } from '../types';

interface DominoCardProps {
  card: CardType;
  onFlip: (id: number) => void;
  onDragStart: (id: number, event: React.MouseEvent | React.TouchEvent) => void;
  isDragging: boolean;
  dragOffset: { x: number; y: number } | null;
  isDraggable: boolean;
}

const DominoCard: React.FC<DominoCardProps> = ({
  card,
  onFlip,
  onDragStart,
  isDragging,
  dragOffset,
  isDraggable,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleMouseDown = (event: React.MouseEvent) => {
    if (isDraggable) {
      onDragStart(card.id, event);
    }
  };
  
  const handleTouchStart = (event: React.TouchEvent) => {
    if (isDraggable) {
      onDragStart(card.id, event);
    }
  };
  
  const handleClick = () => {
    onFlip(card.id);
  };
  
  const cardStyle: React.CSSProperties = {
    position: 'absolute',
    width: '200px',
    height: '280px',
    transform: `${card.isFlipped ? 'rotateY(180deg)' : ''} ${
      isHovered && !isDragging ? 'translateY(-10px)' : ''
    }`,
    transformStyle: 'preserve-3d',
    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: isDraggable ? 'grab' : 'pointer',
    zIndex: isDragging ? 10 : 1,
    left: isDragging && dragOffset ? `${dragOffset.x}px` : `${card.position.x}px`,
    top: isDragging && dragOffset ? `${dragOffset.y}px` : `${card.position.y}px`,
  };
  
  const cardFaceStyle: React.CSSProperties = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: isHovered
      ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    transition: 'box-shadow 0.3s ease',
  };
  
  const frontFaceStyle: React.CSSProperties = {
    ...cardFaceStyle,
    backgroundColor: '#3B82F6',
    color: 'white',
    backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.1) 75%, transparent 75%, transparent)',
    backgroundSize: '10px 10px',
    transform: 'rotateY(0deg)',
  };
  
  const backFaceStyle: React.CSSProperties = {
    ...cardFaceStyle,
    backgroundColor: '#10B981',
    color: 'white',
    backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.1) 75%, transparent 75%, transparent)',
    backgroundSize: '10px 10px',
    transform: 'rotateY(180deg)',
  };
  
  const dotsStyle: React.CSSProperties = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    padding: '24px',
    pointerEvents: 'none',
  };
  
  const dotStyle: React.CSSProperties = {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  };
  
  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onClick={handleClick}
    >
      <div style={frontFaceStyle}>
        <div style={dotsStyle}>
          <div style={dotStyle} />
          <div style={dotStyle} />
        </div>
        <div style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '16px' }}>
          Question
        </div>
        <div style={{ textAlign: 'center', fontSize: '1rem' }}>{card.question}</div>
      </div>
      
      <div style={backFaceStyle}>
        <div style={dotsStyle}>
          <div style={dotStyle} />
          <div style={dotStyle} />
          <div style={dotStyle} />
        </div>
        <div style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '16px' }}>
          Answer
        </div>
        <div style={{ textAlign: 'center', fontSize: '1rem' }}>{card.answer}</div>
      </div>
    </div>
  );
};

export default DominoCard;
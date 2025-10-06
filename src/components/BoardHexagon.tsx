import React, { useState, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import Hexagon from './Hexagon';
import { ItemTypes } from '@/lib/dnd';
import type { Tile } from '@/context/GameContext';

interface DraggableItem {
  color: string;
  sideLength: number;
  tile: Tile;
  handIndex: number;
}

interface BoardHexagonProps {
  sideLength: number;
  color: string | null;
  word?: string;
  onDrop: (item: DraggableItem) => void;
  isOccupied: boolean;
}

const BoardHexagon: React.FC<BoardHexagonProps> = ({ sideLength, color, word, onDrop, isOccupied }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [justDropped, setJustDropped] = useState(false);

  const [{ isOver, canDropNow }, drop] = useDrop(() => ({
    accept: ItemTypes.HEXAGON,
    drop: (item: DraggableItem) => {
      onDrop(item);
      setIsSpinning(true);
      setJustDropped(true);
    },
    canDrop: () => !isOccupied,
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDropNow: !!monitor.canDrop(),
    }),
  }), [isOccupied, onDrop]);

  useEffect(() => {
    if (justDropped) {
      const timer = setTimeout(() => {
        setIsSpinning(false);
        setJustDropped(false);
      }, 500); // Match the animation duration
      return () => clearTimeout(timer);
    }
  }, [justDropped]);

  const baseColor = "text-gray-300 dark:text-gray-700";
  const overlayClass = isOver && canDropNow ? 'opacity-50' : 'opacity-100';

  return (
    <div 
      ref={drop} 
      className={overlayClass}
    >
      <div className={isSpinning ? "animate-spin" : ""} style={{ animationDuration: '0.5s' }}>
        <Hexagon 
          sideLength={sideLength} 
          className={`${color || baseColor} transition-colors`} 
          word={word}
        />
      </div>
    </div>
  );
};

export default BoardHexagon;
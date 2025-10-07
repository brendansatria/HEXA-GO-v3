import React, { useState, useEffect, useRef } from 'react';
import { useDrop } from 'react-dnd';
import Hexagon from './Hexagon';
import { ItemTypes } from '@/lib/dnd';
import type { Tile } from '@/context/GameContext';
import { Check, X } from 'lucide-react';

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
  showFeedback?: boolean;
  isMatch?: boolean;
}

const BoardHexagon: React.FC<BoardHexagonProps> = ({ 
  sideLength, 
  color, 
  word, 
  onDrop, 
  isOccupied,
  showFeedback = false,
  isMatch = false
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [justDropped, setJustDropped] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  useEffect(() => {
    // Clear any existing timeout when component unmounts
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

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
        {showFeedback && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-full bg-white bg-opacity-80 flex items-center justify-center"
                 style={{ width: sideLength, height: sideLength }}>
              {isMatch ? (
                <Check className="text-green-500" size={sideLength * 0.5} />
              ) : (
                <X className="text-red-500" size={sideLength * 0.5} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardHexagon;
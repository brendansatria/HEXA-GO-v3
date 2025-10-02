import React from 'react';
import { useDrop } from 'react-dnd';
import Hexagon from './Hexagon';
import { ItemTypes } from '@/lib/dnd';

interface DraggableItem {
  color: string;
  sideLength: number;
}

interface BoardHexagonProps {
  sideLength: number;
  color: string;
  onDrop: (item: DraggableItem) => void;
  currentPlayerColor: string;
  isOccupied: boolean;
}

const BoardHexagon: React.FC<BoardHexagonProps> = ({ sideLength, color, onDrop, currentPlayerColor, isOccupied }) => {
  const [{ isOver, canDropNow }, drop] = useDrop(() => ({
    accept: ItemTypes.HEXAGON,
    drop: (item: DraggableItem) => onDrop(item),
    canDrop: (item: DraggableItem) => item.color === currentPlayerColor && !isOccupied,
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDropNow: !!monitor.canDrop(),
    }),
  }), [currentPlayerColor, isOccupied]);

  const baseColor = "text-gray-300 dark:text-gray-700";
  const hoverColor = "hover:text-blue-500 dark:hover:text-blue-400";
  
  const overlayClass = isOver && canDropNow ? 'opacity-50' : 'opacity-100';

  return (
    <div ref={drop} className={overlayClass}>
      <Hexagon 
        sideLength={sideLength} 
        className={`${color || baseColor} ${hoverColor} transition-colors`} 
      />
    </div>
  );
};

export default BoardHexagon;
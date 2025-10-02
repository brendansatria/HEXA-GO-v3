import React from 'react';
import { useDrop } from 'react-dnd';
import Hexagon from './Hexagon';
import { ItemTypes } from '@/lib/dnd';

interface BoardHexagonProps {
  sideLength: number;
  color: string;
  onDrop: (item: { color: string }) => void;
}

const BoardHexagon: React.FC<BoardHexagonProps> = ({ sideLength, color, onDrop }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.HEXAGON,
    drop: (item: { color: string }) => onDrop(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const baseColor = "text-gray-300 dark:text-gray-700";
  const hoverColor = "hover:text-blue-500 dark:hover:text-blue-400";
  
  const overlayClass = isOver ? 'opacity-50' : 'opacity-100';

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
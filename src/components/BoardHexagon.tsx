import React from 'react';
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
  const [{ isOver, canDropNow, draggedItem }, drop] = useDrop(() => ({
    accept: ItemTypes.HEXAGON,
    drop: (item: DraggableItem) => onDrop(item),
    canDrop: () => !isOccupied,
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDropNow: !!monitor.canDrop(),
      draggedItem: monitor.getItem<DraggableItem>(),
    }),
  }), [isOccupied, onDrop]);

  const baseColor = "text-gray-300 dark:text-gray-700";
  const gooScale = isOver && canDropNow ? 0.6 : 0;

  return (
    <div ref={drop} className="relative">
      <Hexagon 
        sideLength={sideLength} 
        className={`${color || baseColor} transition-colors`} 
        word={word}
      />
      {draggedItem && (
        <div
          className="absolute inset-0 flex items-center justify-center transition-transform duration-200 ease-out pointer-events-none"
          style={{ transform: `scale(${gooScale})` }}
        >
          <div
            className={`w-1/2 h-1/2 rounded-full ${draggedItem.color.replace('text-', 'bg-')}`}
          />
        </div>
      )}
    </div>
  );
};

export default BoardHexagon;
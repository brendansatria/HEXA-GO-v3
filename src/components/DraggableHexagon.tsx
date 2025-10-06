import React from 'react';
import { useDrag } from 'react-dnd';
import Hexagon from './Hexagon';
import { ItemTypes } from '@/lib/dnd';
import { cn } from '@/lib/utils';
import { Tile } from '@/context/GameContext';

interface DraggableHexagonProps {
  sideLength: number;
  color: string;
  tile: Tile;
  handIndex: number;
}

const DraggableHexagon: React.FC<DraggableHexagonProps> = ({ sideLength, color, tile, handIndex }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.HEXAGON,
    item: { color, sideLength, tile, handIndex },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [color, sideLength, tile, handIndex]);

  return (
    <div
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className={cn("cursor-grab transition-transform duration-200 ease-in-out hover:scale-110 hover:animate-float")}
    >
      <Hexagon sideLength={sideLength} className={color} word={tile.word} />
    </div>
  );
};

export default DraggableHexagon;
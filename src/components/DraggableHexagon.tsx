import React from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
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
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: ItemTypes.HEXAGON,
    item: { color, sideLength, tile, handIndex },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [color, sideLength, tile, handIndex]);

  React.useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  return (
    <div
      ref={drag}
      style={{ opacity: isDragging ? 0 : 1 }}
      className={cn("cursor-grab")}
    >
      <Hexagon sideLength={sideLength} className={color} word={tile.word} />
    </div>
  );
};

export default DraggableHexagon;
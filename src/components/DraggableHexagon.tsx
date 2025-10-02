import React from 'react';
import { useDrag } from 'react-dnd';
import Hexagon from './Hexagon';
import { ItemTypes } from '@/lib/dnd';

interface DraggableHexagonProps {
  sideLength: number;
  color: string;
}

const DraggableHexagon: React.FC<DraggableHexagonProps> = ({ sideLength, color }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.HEXAGON,
    item: { color },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="cursor-grab"
    >
      <Hexagon sideLength={sideLength} className={color} />
    </div>
  );
};

export default DraggableHexagon;
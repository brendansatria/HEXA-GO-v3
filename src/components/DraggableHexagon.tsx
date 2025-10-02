import React from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import Hexagon from './Hexagon';
import { ItemTypes } from '@/lib/dnd';
import { cn } from '@/lib/utils';

interface DraggableHexagonProps {
  sideLength: number;
  color: string;
}

const DraggableHexagon: React.FC<DraggableHexagonProps> = ({ sideLength, color }) => {
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: ItemTypes.HEXAGON,
    item: { color, sideLength },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), []);

  React.useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  return (
    <div
      ref={drag}
      style={{ opacity: isDragging ? 0 : 1 }}
      className={cn("cursor-grab")}
    >
      <Hexagon sideLength={sideLength} className={color} />
    </div>
  );
};

export default DraggableHexagon;
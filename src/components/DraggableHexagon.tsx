import React from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import Hexagon from './Hexagon';
import { ItemTypes } from '@/lib/dnd';
import { cn } from '@/lib/utils';

interface DraggableHexagonProps {
  sideLength: number;
  color: string;
  disabled?: boolean;
}

const DraggableHexagon: React.FC<DraggableHexagonProps> = ({ sideLength, color, disabled = false }) => {
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: ItemTypes.HEXAGON,
    item: { color, sideLength },
    canDrag: !disabled,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  React.useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  return (
    <div
      ref={drag}
      style={{ opacity: isDragging ? 0 : 1 }}
      className={cn(
        "cursor-grab",
        { "opacity-40 cursor-not-allowed grayscale": disabled }
      )}
    >
      <Hexagon sideLength={sideLength} className={color} />
    </div>
  );
};

export default DraggableHexagon;
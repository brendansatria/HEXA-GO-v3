import React, { useEffect } from 'react';
import { useDrag, DragPreviewImage } from 'react-dnd';
import Hexagon from './Hexagon';
import { ItemTypes } from '@/lib/dnd';

interface DraggableHexagonProps {
  sideLength: number;
  color: string;
}

const DraggableHexagon: React.FC<DraggableHexagonProps> = ({ sideLength, color }) => {
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: ItemTypes.HEXAGON,
    item: { color },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // Use an empty image as the drag preview
  const emptyImage = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

  return (
    <>
      <DragPreviewImage connect={preview} src={emptyImage} />
      <div
        ref={drag}
        style={{ opacity: isDragging ? 0.5 : 1 }}
        className="cursor-grab"
      >
        <Hexagon sideLength={sideLength} className={color} />
      </div>
    </>
  );
};

export default DraggableHexagon;
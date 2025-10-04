import React from 'react';
import { useDragLayer, XYCoord } from 'react-dnd';
import { ItemTypes } from '@/lib/dnd';
import type { Tile } from '@/context/GameContext';

const layerStyles: React.CSSProperties = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
};

function getItemStyles(currentOffset: XYCoord | null): React.CSSProperties {
  if (!currentOffset) {
    return {
      display: 'none',
    };
  }
  const { x, y } = currentOffset;
  const transform = `translate(${x}px, ${y}px)`;
  return {
    transform,
    WebkitTransform: transform,
  };
}

interface DraggedItem {
  color: string;
  sideLength: number;
  tile: Tile;
}

const CustomDragLayer: React.FC = () => {
  const { itemType, isDragging, item, currentOffset } = useDragLayer(
    (monitor) => ({
      item: monitor.getItem<DraggedItem>(),
      itemType: monitor.getItemType(),
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging(),
    }),
  );

  function renderItem() {
    switch (itemType) {
      case ItemTypes.HEXAGON:
        if (item && item.sideLength && item.color) {
          const size = item.sideLength * 1.8;
          const bgColor = item.color.replace('text-', 'bg-');
          return (
            <div
              className={`flex items-center justify-center rounded-full text-white font-bold ${bgColor}`}
              style={{
                width: size,
                height: size,
                fontSize: `${item.sideLength / 4.5}px`,
              }}
            >
              {item.tile.word}
            </div>
          );
        }
        return null;
      default:
        return null;
    }
  }

  if (!isDragging) {
    return null;
  }

  return (
    <div style={layerStyles}>
      <div style={getItemStyles(currentOffset)}>
        {renderItem()}
      </div>
    </div>
  );
};

export default CustomDragLayer;
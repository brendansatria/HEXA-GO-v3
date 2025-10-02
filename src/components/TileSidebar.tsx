import React from 'react';
import DraggableHexagon from './DraggableHexagon';

const TILE_COLORS = [
  'text-red-500',
  'text-green-500',
  'text-blue-500',
  'text-yellow-500',
];

const TileSidebar = () => {
  return (
    <div className="p-4 border-r border-gray-200 dark:border-gray-800 flex flex-col items-center space-y-4 bg-gray-50 dark:bg-gray-900">
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Tiles</h2>
      {TILE_COLORS.map((color, index) => (
        <DraggableHexagon key={index} sideLength={50} color={color} />
      ))}
    </div>
  );
};

export default TileSidebar;
import React from 'react';
import DraggableHexagon from './DraggableHexagon';
import { Tile } from '@/context/GameContext';

interface TileSidebarProps {
  currentPlayerColor: string;
  hand: (Tile | null)[];
}

const TileSidebar: React.FC<TileSidebarProps> = ({ currentPlayerColor, hand }) => {
  return (
    <div className="p-4 border-r border-gray-200 dark:border-gray-800 flex flex-col items-center space-y-4 bg-gray-50 dark:bg-gray-900">
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Your Tiles</h2>
      <div className="grid grid-cols-2 gap-4">
        {hand.map((tile, index) => (
          <div key={index} className="w-[100px] h-[100px] flex items-center justify-center">
            {tile ? (
              <DraggableHexagon
                sideLength={40}
                color={currentPlayerColor}
                tile={tile}
                handIndex={index}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 dark:bg-gray-800 rounded-md" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TileSidebar;
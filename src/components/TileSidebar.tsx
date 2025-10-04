import React from 'react';
import DraggableHexagon from './DraggableHexagon';
import { Tile } from '@/context/GameContext';

interface TileSidebarProps {
  currentPlayerColor: string;
  hand: (Tile | null)[];
  feedback: string[];
}

const TileSidebar: React.FC<TileSidebarProps> = ({ currentPlayerColor, hand, feedback }) => {
  return (
    <div className="p-4 border-l border-gray-200 dark:border-gray-800 flex flex-col bg-gray-50 dark:bg-gray-900 w-72 shrink-0">
      <div className="flex-grow">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 text-center">Your Tiles</h2>
        <div className="grid grid-cols-2 gap-4 place-items-center">
          {hand.map((tile, index) => (
            <div key={index} className="w-[120px] h-[120px] flex items-center justify-center">
              {tile ? (
                <DraggableHexagon
                  sideLength={50}
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
      
      <div className="mt-8 w-full">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2 text-center">Feedback</h3>
        <div className="p-3 border rounded-lg bg-white dark:bg-gray-800 min-h-[120px] text-sm text-gray-700 dark:text-gray-300 space-y-1">
          {feedback.length > 0 ? (
            feedback.map((msg, index) => (
              <p key={index}>- {msg}</p>
            ))
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-center italic text-gray-500">Place a tile to see feedback.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TileSidebar;
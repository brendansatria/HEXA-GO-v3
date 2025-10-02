import React from 'react';
import DraggableHexagon from './DraggableHexagon';
import { TEAMS } from '@/lib/teams';

const TileSidebar: React.FC = () => {
  return (
    <div className="p-4 border-r border-gray-200 dark:border-gray-800 flex flex-col items-center space-y-4 bg-gray-50 dark:bg-gray-900">
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Tiles</h2>
      {TEAMS.map((team) => (
        <DraggableHexagon
          key={team.name}
          sideLength={50}
          color={team.color}
        />
      ))}
    </div>
  );
};

export default TileSidebar;
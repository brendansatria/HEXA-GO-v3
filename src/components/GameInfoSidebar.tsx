import React from 'react';
import TurnIndicator from './TurnIndicator';
import HowToPlayDialog from './HowToPlayDialog';
import { Team } from '@/lib/teams';

interface Score extends Team {
  score: number;
}

interface GameInfoSidebarProps {
  round: number;
  currentPlayerName: string;
  scores: Score[];
}

const GameInfoSidebar: React.FC<GameInfoSidebarProps> = ({ round, currentPlayerName, scores }) => {
  return (
    <div className="p-4 border-r border-gray-200 dark:border-gray-800 flex flex-col bg-gray-50 dark:bg-gray-900 w-80 shrink-0 space-y-8">
      <TurnIndicator round={round} currentPlayerName={currentPlayerName} scores={scores} />
      <div className="flex justify-center">
        <HowToPlayDialog />
      </div>
    </div>
  );
};

export default GameInfoSidebar;
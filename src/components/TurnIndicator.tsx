import React from 'react';
import { Team } from '@/lib/teams';

interface Score extends Team {
  score: number;
}

interface TurnIndicatorProps {
  round: number;
  currentPlayerName: string;
  scores: Score[];
}

const TurnIndicator: React.FC<TurnIndicatorProps> = ({ round, currentPlayerName, scores }) => {
  return (
    <div className="w-full max-w-4xl p-4 mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-center text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
        Round {round}: {currentPlayerName}'s Turn
      </h2>
      <div className="flex justify-around items-center">
        {scores.map((item) => (
          <div key={item.name} className="flex flex-col items-center">
            <div className="flex items-center mb-1">
              <span className={`w-3 h-3 rounded-full mr-2 ${item.bgColor}`}></span>
              <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300">{item.name}</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{item.score}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TurnIndicator;
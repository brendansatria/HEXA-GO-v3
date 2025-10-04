import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">
          Round {round}: {currentPlayerName}'s Turn
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {scores.map((item) => (
            <div key={item.name} className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
              <div className="flex items-center justify-center mb-2">
                <span className={`w-4 h-4 rounded-full mr-2 ${item.bgColor}`}></span>
                <h3 className="text-lg font-semibold">{item.name}</h3>
              </div>
              <p className="text-3xl font-bold">{item.score}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TurnIndicator;
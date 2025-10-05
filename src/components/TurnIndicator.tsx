import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Team } from '@/lib/teams';
import { cn } from '@/lib/utils';

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
    <Card className="w-full">
      <CardHeader className="p-4">
        <CardTitle className="text-center text-xl font-bold">
          Round {round}:<br/>{currentPlayerName}'s Turn
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-2 text-center">
          {scores.map((item) => {
            const isCurrentTurn = item.name === currentPlayerName;
            return (
              <div 
                key={item.name} 
                className={cn(
                  "p-2 rounded-lg bg-gray-100",
                  isCurrentTurn && "animate-pulse-light dark:animate-pulse-dark"
                )}
              >
                <div className="flex items-center justify-center mb-1">
                  <span className={`w-3 h-3 rounded-full mr-2 ${item.bgColor}`}></span>
                  <h3 className="text-sm font-semibold">{item.name}</h3>
                </div>
                <p className="text-2xl font-bold">{item.score}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default TurnIndicator;
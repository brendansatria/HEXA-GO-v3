import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TeamScore {
  team: string;
  score: number;
  color: string;
}

const Scoreboard = () => {
  // For now, scores are static. This can be updated later.
  const scores: TeamScore[] = [
    { team: 'Team 1', score: 0, color: 'bg-red-500' },
    { team: 'Team 2', score: 0, color: 'bg-green-500' },
    { team: 'Team 3', score: 0, color: 'bg-blue-500' },
    { team: 'Team 4', score: 0, color: 'bg-yellow-500' },
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">Scoreboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {scores.map((item) => (
            <div key={item.team} className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
              <div className="flex items-center justify-center mb-2">
                <span className={`w-4 h-4 rounded-full mr-2 ${item.color}`}></span>
                <h3 className="text-lg font-semibold">{item.team}</h3>
              </div>
              <p className="text-3xl font-bold">{item.score}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Scoreboard;
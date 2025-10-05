import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy } from 'lucide-react';
import { Team } from '@/lib/teams';
import { Tile } from '@/context/GameContext';

interface Score extends Team {
  score: number;
}

const Result = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const scores: Score[] = location.state?.scores || [];
  const tiles: Tile[] = location.state?.tiles || [];

  const handlePlayAgain = () => {
    if (tiles && tiles.length > 0) {
      localStorage.setItem('lastGameTiles', JSON.stringify(tiles));
    }
    navigate('/');
  };

  if (scores.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl mb-4">No game data found.</h1>
        <a href="/">
          <Button>Go to Home</Button>
        </a>
      </div>
    );
  }

  const sortedScores = [...scores].sort((a, b) => b.score - a.score);
  const maxScore = sortedScores.length > 0 ? sortedScores[0].score : 0;

  const allTags = new Set<string>();
  tiles.forEach(tile => {
    if (tile.tag1 && tile.tag1.trim() !== '') allTags.add(tile.tag1.trim());
    if (tile.tag2 && tile.tag2.trim() !== '') allTags.add(tile.tag2.trim());
    if (tile.tag3 && tile.tag3.trim() !== '') allTags.add(tile.tag3.trim());
  });
  const uniqueTags = Array.from(allTags).sort();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold">Game Over!</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedScores.map((team, index) => {
              const isWinner = team.score === maxScore && maxScore > 0;
              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg flex justify-between items-center transition-all ${isWinner ? 'bg-yellow-100 dark:bg-yellow-900 border-2 border-yellow-400 shadow-lg' : 'bg-gray-50 dark:bg-gray-800'}`}
                >
                  <div className="flex items-center">
                    <span className={`w-4 h-4 rounded-full mr-3 ${team.bgColor}`}></span>
                    <span className="font-semibold text-lg">{team.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-bold text-xl mr-3">{team.score}</span>
                    {isWinner && <Trophy className="h-6 w-6 text-yellow-500" />}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
        {uniqueTags.length > 0 && (
          <CardFooter className="flex-col items-start pt-4 border-t">
            <h3 className="text-md font-semibold mb-3 text-gray-700 dark:text-gray-300">Tags in this Game</h3>
            <div className="flex flex-wrap gap-2">
              {uniqueTags.map(tag => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </CardFooter>
        )}
      </Card>
      <Button size="lg" onClick={handlePlayAgain} className="mt-8">
        Play Again
      </Button>
    </div>
  );
};

export default Result;
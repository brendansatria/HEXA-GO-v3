import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/Button';
import { useState, useEffect } from 'react';
import { useGame, Tile } from '@/context/GameContext';

const Start = () => {
  const navigate = useNavigate();
  const { setTiles } = useGame();
  const [hasHistory, setHasHistory] = useState(false);

  useEffect(() => {
    const lastGameTiles = localStorage.getItem('lastGameTiles');
    if (lastGameTiles) {
      setHasHistory(true);
    }
  }, []);

  const handleInstantPlay = () => {
    const lastGameTilesJSON = localStorage.getItem('lastGameTiles');
    if (lastGameTilesJSON) {
      const lastTiles: Tile[] = JSON.parse(lastGameTilesJSON);
      setTiles(lastTiles);
      navigate('/play');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <img src="/hexago_logo.png" alt="Hexa Go! Logo" className="mb-12 w-full max-w-2xl" />
        <div className="flex space-x-6">
          <Link to="/setup">
            <Button size="lg" className="px-8 py-6 text-lg bg-[#3C435D] hover:bg-[#32374a]">Create</Button>
          </Link>
          <Button
            size="lg"
            className="px-8 py-6 text-lg bg-[#316283] hover:bg-[#25485e] text-white"
            onClick={handleInstantPlay}
            disabled={!hasHistory}
          >
            Instant Play
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Start;
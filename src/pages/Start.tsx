import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/Button';
import { useState, useEffect } from 'react';
import { useGame, Tile } from '@/context/GameContext';
import logopart1 from '@/assets/logopart_1.png';
import logopart2 from '@/assets/logopart_2.png';
import logopart3 from '@/assets/logopart_3.png';
import designByImage from '@/assets/design-by-logo.png';

const Start = () => {
  const navigate = useNavigate();
  const { setTiles } = useGame();
  const [hasHistory, setHasHistory] = useState(false);
  const [visible1, setVisible1] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [visible3, setVisible3] = useState(false);

  useEffect(() => {
    const lastGameTiles = localStorage.getItem('lastGameTiles');
    if (lastGameTiles) {
      setHasHistory(true);
    }

    // Staggered, smooth animation timing
    const timer1 = setTimeout(() => setVisible1(true), 100);
    const timer2 = setTimeout(() => setVisible2(true), 300);
    const timer3 = setTimeout(() => setVisible3(true), 500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
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
        <div className="mb-12 w-full max-w-2xl flex justify-center items-center h-32">
          <img
            src={logopart1}
            alt="Hexa Go! part 1"
            className={`h-full transition-all duration-700 ease-out ${visible1 ? 'opacity-100 translate-x-0 scale-100 rotate-0' : 'opacity-0 -translate-x-4 scale-75 -rotate-45'}`}
          />
          <img
            src={logopart2}
            alt="Hexa Go! part 2"
            className={`h-full transition-all duration-500 ease-out ${visible2 ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-0 scale-90'}`}
          />
          <img
            src={logopart3}
            alt="Hexa Go! part 3"
            className={`h-full transition-all duration-500 ease-out ${visible3 ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-4 scale-90'}`}
          />
        </div>
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
        <div className="mt-8 flex flex-col items-center">
          <p className="text-sm text-gray-500 mb-2">design by:</p>
          <img 
            src={designByImage} 
            alt="Design by" 
            className="h-12 object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Start;
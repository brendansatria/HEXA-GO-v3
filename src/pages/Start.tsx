import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/Button';
import { useState, useEffect } from 'react';
import { useGame, Tile } from '@/context/GameContext';
import logopart1 from '@/assets/logopart_1.png';
import logopart2 from '@/assets/logopart_2.png';
import logopart3 from '@/assets/logopart_3.png';
import logoShade from '@/assets/logo_shade.png';

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

  const getDefaultTiles = (): Tile[] => {
    const defaultStartingTiles: Tile[] = [
      { id: 1, word: 'BATAGOR', tag1: 'BANDUNG', tag2: 'KULINER', tag3: '', isStartingTile: true },
      { id: 2, word: 'KOTA TUA', tag1: 'JAKARTA', tag2: 'TEMPAT', tag3: '', isStartingTile: true },
    ];

    const defaultReserveTiles: Tile[] = [
      { id: 3, word: 'KERAK TELOR', tag1: 'JAKARTA', tag2: 'KULINER', tag3: '', isStartingTile: false },
      { id: 4, word: 'GARUDA WISNU KENCANA', tag1: 'BALI', tag2: 'BANGUNAN', tag3: '', isStartingTile: false },
      { id: 5, word: 'ANGKLUNG', tag1: 'BANDUNG', tag2: 'KERAJINAN', tag3: '', isStartingTile: false },
      { id: 6, word: 'MALIOBORO', tag1: 'JOGJA', tag2: 'TEMPAT', tag3: '', isStartingTile: false },
      { id: 7, word: 'MONAS', tag1: 'JAKARTA', tag2: 'BANGUNAN', tag3: '', isStartingTile: false },
      { id: 8, word: 'SATE LILIT', tag1: 'BALI', tag2: 'KULINER', tag3: '', isStartingTile: false },
      { id: 9, word: 'KAWAH PUTIH', tag1: 'BANDUNG', tag2: 'TEMPAT', tag3: '', isStartingTile: false },
      { id: 10, word: 'BATIK', tag1: 'JOGJA', tag2: 'KERAJINAN', tag3: '', isStartingTile: false },
      { id: 11, word: 'SONGKET', tag1: 'BALI', tag2: 'KERAJINAN', tag3: '', isStartingTile: false },
      { id: 12, word: 'KERATON', tag1: 'JOGJA', tag2: 'BANGUNAN', tag3: '', isStartingTile: false },
      { id: 13, word: 'WHOOSH', tag1: 'JAKARTA', tag2: 'BANDUNG', tag3: '', isStartingTile: false },
      { id: 14, word: 'PAWAI ADAT', tag1: 'JOGJA', tag2: 'BALI', tag3: '', isStartingTile: false },
    ];

    return [...defaultStartingTiles, ...defaultReserveTiles];
  };

  const handleInstantPlay = () => {
    const lastGameTilesJSON = localStorage.getItem('lastGameTiles');
    
    if (lastGameTilesJSON) {
      // Use saved game data
      const lastTiles: Tile[] = JSON.parse(lastGameTilesJSON);
      setTiles(lastTiles);
    } else {
      // Use default game data
      const defaultTiles = getDefaultTiles();
      setTiles(defaultTiles);
    }
    
    navigate('/play');
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
          >
            Instant Play
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-center pb-12">
        <p className="text-xs text-gray-500 mb-1">design by:</p>
        <img src={logoShade} alt="Kummara" className="h-10" />
        <p className="text-xs text-gray-500 mt-1">www.kummara.com</p>
      </div>
    </div>
  );
};

export default Start;
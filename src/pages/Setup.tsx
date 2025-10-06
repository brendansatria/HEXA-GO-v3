import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/Button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useGame } from '@/context/GameContext';

interface TileRow {
  id: number;
  word: string;
  tag1: string;
  tag2: string;
  tag3: string;
}

const Setup = () => {
  const [startingTiles, setStartingTiles] = useState<TileRow[]>([
    { id: 1, word: '', tag1: '', tag2: '', tag3: '' },
  ]);
  const [reserveTiles, setReserveTiles] = useState<TileRow[]>([
    { id: 2, word: '', tag1: '', tag2: '', tag3: '' },
  ]);
  const [nextId, setNextId] = useState(3);
  const { setTiles } = useGame();
  const navigate = useNavigate();

  const handleDefaultSetup = () => {
    const defaultStartingTiles: TileRow[] = [
      { id: 1, word: 'BATAGOR', tag1: 'BANDUNG', tag2: 'KULINER', tag3: '' },
      { id: 2, word: 'KOTA TUA', tag1: 'JAKARTA', tag2: 'TEMPAT', tag3: '' },
    ];

    const defaultReserveTiles: TileRow[] = [
      { id: 3, word: 'KERAK TELOR', tag1: 'JAKARTA', tag2: 'KULINER', tag3: '' },
      { id: 4, word: 'GARUDA WISNU KENCANA', tag1: 'BALI', tag2: 'BANGUNAN', tag3: '' },
      { id: 5, word: 'ANGKLUNG', tag1: 'BANDUNG', tag2: 'KERAJINAN', tag3: '' },
      { id: 6, word: 'MALIOBORO', tag1: 'JOGJA', tag2: 'TEMPAT', tag3: '' },
      { id: 7, word: 'MONAS', tag1: 'JAKARTA', tag2: 'BANGUNAN', tag3: '' },
      { id: 8, word: 'SATE LILIT', tag1: 'BALI', tag2: 'KULINER', tag3: '' },
      { id: 9, word: 'KAWAH PUTIH', tag1: 'BANDUNG', tag2: 'TEMPAT', tag3: '' },
      { id: 10, word: 'BATIK', tag1: 'JOGJA', tag2: 'KERAJINAN', tag3: '' },
      { id: 11, word: 'SONGKET', tag1: 'BALI', tag2: 'KERAJINAN', tag3: '' },
      { id: 12, word: 'KERATON', tag1: 'JOGJA', tag2: 'BANGUNAN', tag3: '' },
      { id: 13, word: 'WHOOSH', tag1: 'JAKARTA', tag2: 'BANDUNG', tag3: '' },
      { id: 14, word: 'PAWAI ADAT', tag1: 'JOGJA', tag2: 'BALI', tag3: '' },
    ];

    setStartingTiles(defaultStartingTiles);
    setReserveTiles(defaultReserveTiles);
    setNextId(15);
  };

  const handleAddStartingTileRow = () => {
    if (startingTiles.length < 4) {
      setStartingTiles([
        ...startingTiles,
        { id: nextId, word: '', tag1: '', tag2: '', tag3: '' },
      ]);
      setNextId(nextId + 1);
    }
  };

  const handleDeleteStartingTileRow = (id: number) => {
    if (startingTiles.length > 1) {
      setStartingTiles(startingTiles.filter((row) => row.id !== id));
    }
  };

  const handleStartingTileInputChange = (id: number, field: keyof Omit<TileRow, 'id'>, value: string) => {
    setStartingTiles(
      startingTiles.map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
  };

  const handleAddReserveTileRow = () => {
    if (reserveTiles.length < 40) {
      setReserveTiles([
        ...reserveTiles,
        { id: nextId, word: '', tag1: '', tag2: '', tag3: '' },
      ]);
      setNextId(nextId + 1);
    }
  };

  const handleDeleteReserveTileRow = (id: number) => {
    if (reserveTiles.length > 1) {
      setReserveTiles(reserveTiles.filter((row) => row.id !== id));
    }
  };

  const handleReserveTileInputChange = (id: number, field: keyof Omit<TileRow, 'id'>, value: string) => {
    setReserveTiles(
      reserveTiles.map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
  };

  const handleSaveAndPlay = () => {
    const finalStartingTiles = startingTiles.map(tile => ({ ...tile, isStartingTile: true }));
    const finalReserveTiles = reserveTiles.map(tile => ({ ...tile, isStartingTile: false }));
    setTiles([...finalStartingTiles, ...finalReserveTiles]);
    navigate('/play');
  };

  const validStartingTilesCount = startingTiles.filter(
    (tile) => tile.word.trim() !== '' && tile.tag1.trim() !== ''
  ).length;

  const validReserveTilesCount = reserveTiles.filter(
    (tile) => tile.word.trim() !== '' && tile.tag1.trim() !== ''
  ).length;

  const isSaveDisabled = validStartingTilesCount < 2 || validReserveTilesCount < 8;

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-4 md:p-8">
      <div className="w-full max-w-6xl">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold">Game Setup</h1>
            <div className="flex space-x-2">
                <Button variant="secondary" onClick={handleDefaultSetup} className="hover:bg-[#EBE5DD]">Default Setup</Button>
                <Button variant="outline" onClick={() => navigate('/')} className="hover:bg-[#EBE5DD]">Back to Home</Button>
            </div>
        </div>

        <div className="space-y-12">
          {/* Starting Tiles Table */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Starting Tiles</h2>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[50px]">No.</TableHead>
                    <TableHead>Tile's Word</TableHead>
                    <TableHead>Tag 1</TableHead>
                    <TableHead>Tag 2</TableHead>
                    <TableHead>Tag 3</TableHead>
                    <TableHead className="w-[80px] text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {startingTiles.map((row, index) => (
                    <TableRow key={row.id} className="hover:bg-[#EBE5DD]">
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <Input
                          value={row.word}
                          onChange={(e) => handleStartingTileInputChange(row.id, 'word', e.target.value)}
                          placeholder="Enter word..."
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={row.tag1}
                          onChange={(e) => handleStartingTileInputChange(row.id, 'tag1', e.target.value)}
                          placeholder="Enter tag..."
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={row.tag2}
                          onChange={(e) => handleStartingTileInputChange(row.id, 'tag2', e.target.value)}
                          placeholder="Enter tag..."
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={row.tag3}
                          onChange={(e) => handleStartingTileInputChange(row.id, 'tag3', e.target.value)}
                          placeholder="Enter tag..."
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteStartingTileRow(row.id)}
                          disabled={startingTiles.length <= 1}
                          className="hover:bg-[#EBE5DD]"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4">
                <Button variant="outline" onClick={handleAddStartingTileRow} disabled={startingTiles.length >= 4} className="hover:bg-[#EBE5DD]">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Row ({startingTiles.length}/4)
                </Button>
            </div>
          </div>

          {/* Reserve Tiles Table */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Reserve Tiles</h2>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[50px]">No.</TableHead>
                    <TableHead>Tile's Word</TableHead>
                    <TableHead>Tag 1</TableHead>
                    <TableHead>Tag 2</TableHead>
                    <TableHead>Tag 3</TableHead>
                    <TableHead className="w-[80px] text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reserveTiles.map((row, index) => (
                    <TableRow key={row.id} className="hover:bg-[#EBE5DD]">
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <Input
                          value={row.word}
                          onChange={(e) => handleReserveTileInputChange(row.id, 'word', e.target.value)}
                          placeholder="Enter word..."
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={row.tag1}
                          onChange={(e) => handleReserveTileInputChange(row.id, 'tag1', e.target.value)}
                          placeholder="Enter tag..."
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={row.tag2}
                          onChange={(e) => handleReserveTileInputChange(row.id, 'tag2', e.target.value)}
                          placeholder="Enter tag..."
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={row.tag3}
                          onChange={(e) => handleReserveTileInputChange(row.id, 'tag3', e.target.value)}
                          placeholder="Enter tag..."
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteReserveTileRow(row.id)}
                          disabled={reserveTiles.length <= 1}
                          className="hover:bg-[#EBE5DD]"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4">
                <Button variant="outline" onClick={handleAddReserveTileRow} disabled={reserveTiles.length >= 40} className="hover:bg-[#EBE5DD]">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Row ({reserveTiles.length}/40)
                </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-6xl mt-8 flex flex-col items-center">
        <Button size="lg" onClick={handleSaveAndPlay} disabled={isSaveDisabled} className="bg-[#3C435D] hover:bg-[#32374a]">Save & Play</Button>
        {isSaveDisabled && (
            <p className="text-sm text-red-500 mt-2 text-center">
                A minimum of 2 starting tiles and 8 reserve tiles are required.<br/>
                Each required tile must have at least "Tile's Word" and "Tag 1" filled.<br/>
                Click the Default Setup button at the top to fill in the example data.
            </p>
        )}
      </div>
    </div>
  );
};

export default Setup;
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
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
  isStartingTile: boolean;
  word: string;
  tag1: string;
  tag2: string;
  tag3: string;
}

const Setup = () => {
  const [rows, setRows] = useState<TileRow[]>([
    { id: 1, isStartingTile: false, word: '', tag1: '', tag2: '', tag3: '' },
  ]);
  const [nextId, setNextId] = useState(2);
  const { setTiles } = useGame();
  const navigate = useNavigate();

  const handleAddRow = () => {
    setRows([
      ...rows,
      { id: nextId, isStartingTile: false, word: '', tag1: '', tag2: '', tag3: '' },
    ]);
    setNextId(nextId + 1);
  };

  const handleDeleteRow = (id: number) => {
    if (rows.length > 1) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const handleInputChange = (id: number, field: keyof TileRow, value: string | boolean) => {
    setRows(
      rows.map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
  };

  const handleSaveAndPlay = () => {
    setTiles(rows);
    navigate('/play');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-white dark:bg-gray-950 p-4 md:p-8">
      <div className="w-full max-w-6xl">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold">Game Setup</h1>
            <Button variant="outline" onClick={() => navigate('/')}>Back to Home</Button>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">No.</TableHead>
                <TableHead className="w-[120px]">Starting Tile</TableHead>
                <TableHead>Tile's Word</TableHead>
                <TableHead>Tag 1</TableHead>
                <TableHead>Tag 2</TableHead>
                <TableHead>Tag 3</TableHead>
                <TableHead className="w-[80px] text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="text-center">
                    <Checkbox
                      checked={row.isStartingTile}
                      onCheckedChange={(checked) =>
                        handleInputChange(row.id, 'isStartingTile', !!checked)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={row.word}
                      onChange={(e) => handleInputChange(row.id, 'word', e.target.value)}
                      placeholder="Enter word..."
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={row.tag1}
                      onChange={(e) => handleInputChange(row.id, 'tag1', e.target.value)}
                      placeholder="Enter tag..."
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={row.tag2}
                      onChange={(e) => handleInputChange(row.id, 'tag2', e.target.value)}
                      placeholder="Enter tag..."
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={row.tag3}
                      onChange={(e) => handleInputChange(row.id, 'tag3', e.target.value)}
                      placeholder="Enter tag..."
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteRow(row.id)}
                      disabled={rows.length <= 1}
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
            <Button variant="outline" onClick={handleAddRow}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Row
            </Button>
        </div>
      </div>

      <div className="w-full max-w-6xl mt-8 flex flex-col items-center">
        <Button size="lg" onClick={handleSaveAndPlay}>Save & Play</Button>
      </div>
    </div>
  );
};

export default Setup;
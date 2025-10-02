import { useState, useEffect } from "react";
import { MadeWithDyad } from "@/components/made-with-dyad";
import HexagonalBoard, { HexagonState } from "@/components/HexagonalBoard";
import TileSidebar from "@/components/TileSidebar";
import TurnIndicator from "@/components/TurnIndicator";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import CustomDragLayer from "@/components/CustomDragLayer";
import { TEAMS } from "@/lib/teams";
import { useGame } from "@/context/GameContext";

interface DraggableItem {
  color: string;
  sideLength: number;
}

const Play = () => {
  const { tiles } = useGame();
  const [round, setRound] = useState(1);
  const [turn, setTurn] = useState(0);
  const [boardState, setBoardState] = useState<{ [key: string]: HexagonState }>({});
  const [scores, setScores] = useState(TEAMS.map(team => ({ ...team, score: 0 })));

  const ROWS = 6;
  const COLS = 6;

  useEffect(() => {
    const gameTiles = tiles.filter(tile => !tile.isStartingTile && tile.word.trim() !== '');
    const newBoardState: { [key: string]: HexagonState } = {};
    
    let tileIndex = 0;
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        if (tileIndex < gameTiles.length) {
          const key = `${row}-${col}`;
          newBoardState[key] = {
            color: null,
            word: gameTiles[tileIndex].word,
          };
          tileIndex++;
        }
      }
    }
    setBoardState(newBoardState);
  }, [tiles]);

  const startingPlayerIndex = (round - 1) % TEAMS.length;
  const currentPlayerIndex = (startingPlayerIndex + turn) % TEAMS.length;
  const currentPlayer = TEAMS[currentPlayerIndex];

  const handleDrop = (row: number, col: number, _item: DraggableItem) => {
    const key = `${row}-${col}`;
    setBoardState(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        color: currentPlayer.textColor,
      },
    }));

    const teamIndex = currentPlayerIndex;
    if (teamIndex !== -1) {
      setScores(prevScores => {
        const newScores = [...prevScores];
        newScores[teamIndex].score += 1;
        return newScores;
      });
    }

    const nextTurn = turn + 1;
    if (nextTurn >= TEAMS.length) {
      setTurn(0);
      setRound(prevRound => prevRound + 1);
    } else {
      setTurn(nextTurn);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <CustomDragLayer />
      <div className="min-h-screen w-full flex flex-col bg-white dark:bg-gray-950">
        <div className="p-4 border-b dark:border-gray-800">
          <TurnIndicator 
            round={round}
            currentPlayerName={currentPlayer.name}
            scores={scores}
          />
        </div>
        <div className="flex flex-1 overflow-hidden">
          <TileSidebar currentPlayerColor={currentPlayer.textColor} />
          <main className="flex-1 flex items-center justify-center p-4 overflow-auto">
            <HexagonalBoard 
              rows={ROWS} 
              cols={COLS} 
              hexagonSize={50}
              boardState={boardState}
              onDrop={handleDrop}
            />
          </main>
        </div>
        <div className="w-full">
          <MadeWithDyad />
        </div>
      </div>
    </DndProvider>
  );
};

export default Play;
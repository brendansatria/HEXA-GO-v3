import { useState } from "react";
import { MadeWithDyad } from "@/components/made-with-dyad";
import HexagonalBoard from "@/components/HexagonalBoard";
import TileSidebar from "@/components/TileSidebar";
import TurnIndicator from "@/components/TurnIndicator";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import CustomDragLayer from "@/components/CustomDragLayer";
import { TEAMS } from "@/lib/teams";

interface DraggableItem {
  color: string;
  sideLength: number;
}

const Index = () => {
  const [round, setRound] = useState(1);
  const [turn, setTurn] = useState(0); // 0-3, represents turn within a round
  const [boardState, setBoardState] = useState<{ [key: string]: string }>({});
  const [scores, setScores] = useState(TEAMS.map(team => ({ ...team, score: 0 })));

  // Calculate current player based on round and turn
  const startingPlayerIndex = (round - 1) % TEAMS.length;
  const currentPlayerIndex = (startingPlayerIndex + turn) % TEAMS.length;
  const currentPlayer = TEAMS[currentPlayerIndex];

  const handleDrop = (row: number, col: number, _item: DraggableItem) => {
    // Update board state with the CURRENT PLAYER's color, ignoring the dragged item's color
    setBoardState(prev => ({
      ...prev,
      [`${row}-${col}`]: currentPlayer.color,
    }));

    // Update score for the CURRENT PLAYER
    const teamIndex = currentPlayerIndex;
    if (teamIndex !== -1) {
      setScores(prevScores => {
        const newScores = [...prevScores];
        newScores[teamIndex].score += 1;
        return newScores;
      });
    }

    // Advance turn
    const nextTurn = turn + 1;
    if (nextTurn >= TEAMS.length) {
      // End of round
      setTurn(0);
      setRound(prevRound => prevRound + 1);
    } else {
      // Next turn in the same round
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
          <TileSidebar currentPlayerColor={currentPlayer.color} />
          <main className="flex-1 flex items-center justify-center p-4 overflow-auto">
            <HexagonalBoard 
              rows={6} 
              cols={6} 
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

export default Index;
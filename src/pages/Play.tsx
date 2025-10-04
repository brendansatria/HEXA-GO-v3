import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import HexagonalBoard, { HexagonState } from "@/components/HexagonalBoard";
import TurnIndicator from "@/components/TurnIndicator";
import HowToPlayDialog from "@/components/HowToPlayDialog";
import DraggableHexagon from "@/components/DraggableHexagon";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import CustomDragLayer from "@/components/CustomDragLayer";
import { TEAMS } from "@/lib/teams";
import { useGame, Tile } from "@/context/GameContext";

interface DraggableItem {
  color: string;
  sideLength: number;
  tile: Tile;
  handIndex: number;
}

const shuffleArray = (array: any[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const getNeighbors = (row: number, col: number): [number, number][] => {
  if (row % 2 === 1) { // Odd rows
    return [
      [row, col - 1], [row, col + 1],
      [row - 1, col], [row - 1, col + 1],
      [row + 1, col], [row + 1, col + 1],
    ];
  } else { // Even rows
    return [
      [row, col - 1], [row, col + 1],
      [row - 1, col - 1], [row - 1, col],
      [row + 1, col - 1], [row + 1, col],
    ];
  }
};

const Play = () => {
  const navigate = useNavigate();
  const { tiles: configuredTiles } = useGame();
  const [round, setRound] = useState(1);
  const [turn, setTurn] = useState(0);
  const [boardState, setBoardState] = useState<{ [key: string]: HexagonState }>({});
  const [scores, setScores] = useState(TEAMS.map(team => ({ ...team, score: 0 })));
  const [deck, setDeck] = useState<Tile[]>([]);
  const [hand, setHand] = useState<(Tile | null)[]>(Array(4).fill(null));
  const [totalGameTiles, setTotalGameTiles] = useState(0);
  const [placedTilesCount, setPlacedTilesCount] = useState(0);
  const [lastMoveFeedback, setLastMoveFeedback] = useState<string[]>([]);
  const [isTwoPlayerSetup, setIsTwoPlayerSetup] = useState(false);
  const [isThreePlayerSetup, setIsThreePlayerSetup] = useState(false);
  
  const isInitialMount = useRef(true);

  useEffect(() => {
    const startingTiles = configuredTiles.filter(tile => tile.isStartingTile && tile.word.trim() !== '');
    const gameTiles = configuredTiles.filter(tile => !tile.isStartingTile && tile.word.trim() !== '');
    setTotalGameTiles(gameTiles.length);

    let startingPositions: string[];
    if (startingTiles.length === 2) {
      startingPositions = ['2-1', '3-3'];
      setIsTwoPlayerSetup(true);
      setIsThreePlayerSetup(false);
    } else if (startingTiles.length === 3) {
      startingPositions = ['1-1', '1-4', '4-3'];
      setIsThreePlayerSetup(true);
      setIsTwoPlayerSetup(false);
    } else {
      startingPositions = ['1-1', '1-4', '4-1', '4-4'];
      setIsTwoPlayerSetup(false);
      setIsThreePlayerSetup(false);
    }

    const shuffledStartingTiles = shuffleArray(startingTiles);
    const initialBoardState: { [key: string]: HexagonState } = {};

    startingPositions.forEach((pos, index) => {
      if (shuffledStartingTiles[index]) {
        initialBoardState[pos] = { color: 'text-gray-500', tile: shuffledStartingTiles[index] };
      }
    });
    setBoardState(initialBoardState);

    if (gameTiles.length > 0) {
      const shuffledDeck = shuffleArray(gameTiles);
      const initialHand = shuffledDeck.slice(0, 4);
      const remainingDeck = shuffledDeck.slice(4);
      setHand(initialHand.concat(Array(4 - initialHand.length).fill(null)));
      setDeck(remainingDeck);
    }
  }, [configuredTiles]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    let newDeck = [...deck];
    const newHand = [...hand];
    let handChanged = false;

    for (let i = 0; i < newHand.length; i++) {
      if (newHand[i] === null && newDeck.length > 0) {
        newHand[i] = newDeck.shift()!;
        handChanged = true;
      }
    }

    if (handChanged) {
      setHand(newHand);
      setDeck(newDeck);
    }
  }, [turn, round]);

  const startingPlayerIndex = (round - 1) % TEAMS.length;
  const currentPlayerIndex = (startingPlayerIndex + turn) % TEAMS.length;
  const currentPlayer = TEAMS[currentPlayerIndex];

  const calculateScore = (row: number, col: number, placedTile: Tile, currentBoardState: { [key: string]: HexagonState }) => {
    let score = 0;
    const placedTileTags = [placedTile.tag1, placedTile.tag2, placedTile.tag3].filter(tag => tag && tag.trim() !== '');
    if (placedTileTags.length === 0) return 0;

    const neighbors = getNeighbors(row, col);
    for (const [nRow, nCol] of neighbors) {
        const neighborKey = `${nRow}-${nCol}`;
        const neighborHex = currentBoardState[neighborKey];
        if (neighborHex?.tile) {
            const neighborTags = [neighborHex.tile.tag1, neighborHex.tile.tag2, neighborHex.tile.tag3].filter(tag => tag && tag.trim() !== '');
            if (placedTileTags.some(tag => neighborTags.includes(tag))) {
                score += 2;
            }
        }
    }
    return score;
  };

  const handleDrop = (row: number, col: number, item: DraggableItem) => {
    const key = `${row}-${col}`;
    const points = calculateScore(row, col, item.tile, boardState);

    const feedbackMessages: string[] = [];
    const placedTile = item.tile;
    const placedTileTags = [placedTile.tag1, placedTile.tag2, placedTile.tag3].filter(tag => tag && tag.trim() !== '');
    if (placedTileTags.length > 0) {
        const neighbors = getNeighbors(row, col);
        for (const [nRow, nCol] of neighbors) {
            const neighborKey = `${nRow}-${nCol}`;
            const neighborHex = boardState[neighborKey];
            if (neighborHex?.tile) {
                const neighborTile = neighborHex.tile;
                const neighborTags = [neighborTile.tag1, neighborTile.tag2, neighborTile.tag3].filter(tag => tag && tag.trim() !== '');
                if (placedTileTags.some(tag => neighborTags.includes(tag))) {
                    feedbackMessages.push(`'${placedTile.word}' & '${neighborTile.word}' matched.`);
                }
            }
        }
    }
    if (feedbackMessages.length === 0) {
        feedbackMessages.push("No tags matched this turn.");
    }
    setLastMoveFeedback(feedbackMessages);

    setBoardState(prev => ({ ...prev, [key]: { color: currentPlayer.textColor, tile: item.tile } }));
    setHand(prevHand => {
      const newHand = [...prevHand];
      newHand[item.handIndex] = null;
      return newHand;
    });

    let finalScores = scores;
    if (points > 0) {
      finalScores = scores.map((teamScore, index) => 
        index === currentPlayerIndex ? { ...teamScore, score: teamScore.score + points } : teamScore
      );
      setScores(finalScores);
    }

    const newPlacedCount = placedTilesCount + 1;
    setPlacedTilesCount(newPlacedCount);

    if (totalGameTiles > 0 && newPlacedCount >= totalGameTiles) {
      navigate('/result', { state: { scores: finalScores, tiles: configuredTiles } });
      return;
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
      <div className="min-h-screen w-full flex">
        {/* Left Sidebar */}
        <div className="w-80 shrink-0 p-4 border-r border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center space-y-6 bg-gray-50 dark:bg-gray-900">
          <img src="/hexago_logo.png" alt="Hexa Go! Logo" className="w-48" />
          <TurnIndicator round={round} currentPlayerName={currentPlayer.name} scores={scores} />
          
          {/* Actions Box */}
          <div className="w-full">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2 text-center">Actions</h3>
            <div className="p-3 border rounded-lg bg-white dark:bg-gray-800 min-h-[120px] text-sm text-gray-700 dark:text-gray-300 space-y-1">
              {lastMoveFeedback.length > 0 ? (
                lastMoveFeedback.map((msg, index) => (
                  <p key={index}>- {msg}</p>
                ))
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-center italic text-gray-500">Place a tile to see feedback.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Area */}
        <main className="flex-1 flex items-center justify-center p-4 overflow-auto relative">
          <div className="absolute top-4 right-4 z-10">
            <HowToPlayDialog />
          </div>
          <div className="flex items-center justify-center gap-8">
            {/* Hand Tiles Column */}
            <div className="relative -left-8 flex flex-col gap-4">
              {hand.map((tile, index) => (
                <div key={index} className="w-[150px] h-[150px] flex items-center justify-center">
                  {tile ? (
                    <DraggableHexagon
                      sideLength={70}
                      color={currentPlayer.textColor}
                      tile={tile}
                      handIndex={index}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-800 rounded-md" />
                  )}
                </div>
              ))}
            </div>
            
            <HexagonalBoard 
              rows={6} 
              cols={6} 
              hexagonSize={75} 
              boardState={boardState} 
              onDrop={handleDrop} 
              isTwoPlayerSetup={isTwoPlayerSetup}
              isThreePlayerSetup={isThreePlayerSetup}
            />
          </div>
        </main>
      </div>
    </DndProvider>
  );
};

export default Play;
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import HexagonalBoard, { HexagonState } from "@/components/HexagonalBoard";
import TurnIndicator from "@/components/TurnIndicator";
import HowToPlayDialog from "@/components/HowToPlayDialog";
import DraggableHexagon from "@/components/DraggableHexagon";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import CustomDragLayer from "@/components/CustomDragLayer";
import { TEAMS, Team } from "@/lib/teams";
import { useGame, Tile } from "@/context/GameContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import VolumeControl from "@/components/VolumeControl";
import { Button } from "@/components/Button";
import { Undo2 } from "lucide-react";
import GameMusic from '@/assets/Fast_Jazz_30.mp3';
import DropSound from '@/assets/MusicEffectJazzTr SDT055702.wav';
import logopart1 from '@/assets/logopart_1.png';
import logopart2 from '@/assets/logopart_2.png';
import logopart3 from '@/assets/logopart_3.png';

interface DraggableItem {
  color: string;
  sideLength: number;
  tile: Tile;
  handIndex: number;
}

interface Score extends Team {
  score: number;
}

interface GameState {
  boardState: { [key: string]: HexagonState };
  scores: Score[];
  hand: (Tile | null)[];
  deck: Tile[];
  round: number;
  turn: number;
  placedTilesCount: number;
  lastMoveFeedback: string[];
}

interface MissedOpportunity {
  round: number;
  team: string;
  chosenTile: Tile;
  bestTile: Tile;
  chosenScore: number;
  bestScore: number;
  position: string;
}

interface FeedbackState {
  [key: string]: {
    show: boolean;
    isMatch: boolean;
  };
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

const getAllValidPositions = (boardState: { [key: string]: HexagonState }, isTwoPlayerSetup: boolean, isThreePlayerSetup: boolean): [number, number][] => {
  const positions: [number, number][] = [];
  const rows = 6;
  const cols = 6;
  
  let excludedHexes: string[] = [];
  if (isTwoPlayerSetup) {
    excludedHexes = ['1-5', '3-5', '5-5'];
  } else if (isThreePlayerSetup) {
    excludedHexes = ['0-0', '2-0', '4-0'];
  }

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const key = `${row}-${col}`;
      
      if (excludedHexes.includes(key)) {
        continue;
      }
      
      // Skip if position is already occupied
      if (boardState[key]) {
        continue;
      }
      
      // Check if position has at least one neighbor that is occupied
      const neighbors = getNeighbors(row, col);
      const hasOccupiedNeighbor = neighbors.some(([nRow, nCol]) => {
        const neighborKey = `${nRow}-${nCol}`;
        return boardState[neighborKey] !== undefined;
      });
      
      // Position is valid if it's adjacent to an occupied tile or if board is empty
      if (hasOccupiedNeighbor || Object.keys(boardState).length === 0) {
        positions.push([row, col]);
      }
    }
  }
  
  return positions;
};

const calculateScoreForTileAtPosition = (
  tile: Tile,
  row: number,
  col: number,
  boardState: { [key: string]: HexagonState }
): number => {
  let score = 0;
  const placedTileTags = [tile.tag1, tile.tag2, tile.tag3].filter(tag => tag && tag.trim() !== '');
  if (placedTileTags.length === 0) return 0;

  const neighbors = getNeighbors(row, col);
  for (const [nRow, nCol] of neighbors) {
    const neighborKey = `${nRow}-${nCol}`;
    const neighborHex = boardState[neighborKey];
    if (neighborHex?.tile) {
      const neighborTags = [neighborHex.tile.tag1, neighborHex.tile.tag2, neighborHex.tile.tag3].filter(tag => tag && tag.trim() !== '');
      if (placedTileTags.some(tag => neighborTags.includes(tag))) {
        score += 2;
      }
    }
  }
  return score;
};

const findBestMove = (
  hand: (Tile | null)[],
  boardState: { [key: string]: HexagonState },
  isTwoPlayerSetup: boolean,
  isThreePlayerSetup: boolean
): { tile: Tile | null; position: [number, number] | null; score: number } => {
  const validPositions = getAllValidPositions(boardState, isTwoPlayerSetup, isThreePlayerSetup);
  let bestTile: Tile | null = null;
  let bestPosition: [number, number] | null = null;
  let bestScore = -1;

  // For each tile in hand
  hand.forEach((tile) => {
    if (!tile) return;
    
    // For each valid position on the board
    validPositions.forEach(([row, col]) => {
      const score = calculateScoreForTileAtPosition(tile, row, col, boardState);
      if (score > bestScore) {
        bestScore = score;
        bestTile = tile;
        bestPosition = [row, col];
      }
    });
  });

  return { tile: bestTile, position: bestPosition, score: bestScore };
};

const Play = () => {
  const navigate = useNavigate();
  const { tiles: configuredTiles } = useGame();
  const [round, setRound] = useState(1);
  const [turn, setTurn] = useState(0);
  const [boardState, setBoardState] = useState<{ [key: string]: HexagonState }>({});
  const [scores, setScores] = useState<Score[]>(TEAMS.map(team => ({ ...team, score: 0 })));
  const [deck, setDeck] = useState<Tile[]>([]);
  const [hand, setHand] = useState<(Tile | null)[]>(Array(4).fill(null));
  const [totalGameTiles, setTotalGameTiles] = useState(0);
  const [placedTilesCount, setPlacedTilesCount] = useState(0);
  const [lastMoveFeedback, setLastMoveFeedback] = useState<string[]>([]);
  const [isTwoPlayerSetup, setIsTwoPlayerSetup] = useState(false);
  const [isThreePlayerSetup, setIsThreePlayerSetup] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [finalScores, setFinalScores] = useState<Score[]>([]);
  
  // Feedback state for visual indicators
  const [feedbackState, setFeedbackState] = useState<FeedbackState>({});
  
  // History for undo functionality
  const [history, setHistory] = useState<GameState[]>([]);
  const [canUndo, setCanUndo] = useState(false);
  
  // Action history for reporting
  const [actionHistory, setActionHistory] = useState<string[]>([]);
  
  // Missed opportunities tracking
  const [missedOpportunities, setMissedOpportunities] = useState<MissedOpportunity[]>([]);
  
  const isInitialMount = useRef(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const sfxRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(error => {
        console.log("Audio autoplay was prevented: ", error);
      });
    }
  }, []);

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

    // Smart Draw Logic: Prioritize drawing tiles that have at least one matching tag with tiles on the board.
    const boardTags = new Set<string>();
    Object.values(boardState).forEach(hexState => {
      if (hexState.tile) {
        const { tag1, tag2, tag3 } = hexState.tile;
        if (tag1 && tag1.trim() !== '') boardTags.add(tag1.trim());
        if (tag2 && tag2.trim() !== '') boardTags.add(tag2.trim());
        if (tag3 && tag3.trim() !== '') boardTags.add(tag3.trim());
      }
    });

    const isTilePlayable = (tile: Tile): boolean => {
      // If there are no tags on the board yet, any tile is considered playable.
      if (boardTags.size === 0) return true;
      
      const tileTags = [tile.tag1, tile.tag2, tile.tag3].filter(tag => tag && tag.trim() !== '');
      
      // A tile with no tags cannot match anything.
      if (tileTags.length === 0) return false;

      // Check if any of the tile's tags are present on the board.
      return tileTags.some(tag => boardTags.has(tag));
    };

    let newDeck = [...deck];
    const newHand = [...hand];
    let handChanged = false;

    for (let i = 0; i < newHand.length; i++) {
      if (newHand[i] === null && newDeck.length > 0) {
        let drawnTile: Tile | null = null;
        
        // Find the index of the first playable tile in the deck.
        const playableTileIndex = newDeck.findIndex(tile => isTilePlayable(tile));

        if (playableTileIndex !== -1) {
          // If a playable tile is found, draw it.
          drawnTile = newDeck.splice(playableTileIndex, 1)[0];
        } else {
          // Fallback: If no playable tile is found, draw the top tile from the deck.
          drawnTile = newDeck.shift()!;
        }
        
        if (drawnTile) {
            newHand[i] = drawnTile;
            handChanged = true;
        }
      }
    }

    if (handChanged) {
      setHand(newHand);
      setDeck(newDeck);
    }
  }, [turn, round, boardState, deck, hand]);

  // Save state to history before making a move
  const saveToHistory = () => {
    setHistory(prev => [
      ...prev,
      {
        boardState: JSON.parse(JSON.stringify(boardState)),
        scores: JSON.parse(JSON.stringify(scores)),
        hand: JSON.parse(JSON.stringify(hand)),
        deck: JSON.parse(JSON.stringify(deck)),
        round,
        turn,
        placedTilesCount,
        lastMoveFeedback: [...lastMoveFeedback]
      }
    ]);
    setCanUndo(true);
  };

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
    // Save current state to history before making changes
    saveToHistory();
    
    if (sfxRef.current) {
      sfxRef.current.volume = 0.8;
      sfxRef.current.currentTime = 0;
      sfxRef.current.play();
    }

    const key = `${row}-${col}`;
    const points = calculateScore(row, col, item.tile, boardState);

    // Check for missed opportunity
    const bestMove = findBestMove(hand, boardState, isTwoPlayerSetup, isThreePlayerSetup);
    if (bestMove.tile && bestMove.tile.id !== item.tile.id && bestMove.score > points) {
      const currentPlayerName = TEAMS[(startingPlayerIndex + turn) % TEAMS.length].name;
      const missedOpportunity: MissedOpportunity = {
        round,
        team: currentPlayerName,
        chosenTile: item.tile,
        bestTile: bestMove.tile,
        chosenScore: points,
        bestScore: bestMove.score,
        position: `${row}-${col}`
      };
      setMissedOpportunities(prev => [...prev, missedOpportunity]);
      
      // Add to action history
      const opportunityEntry = `Round ${round}, ${currentPlayerName}: Missed opportunity! Chose '${item.tile.word}' (${points} pts) instead of '${bestMove.tile.word}' (${bestMove.score} pts)`;
      setActionHistory(prev => [...prev, opportunityEntry]);
    }

    const feedbackMessages: string[] = [];
    const placedTile = item.tile;
    const placedTileTags = [placedTile.tag1, placedTile.tag2, placedTile.tag3].filter(tag => tag && tag.trim() !== '');
    
    // Create feedback state for neighbors
    const newFeedbackState: FeedbackState = {};
    const neighbors = getNeighbors(row, col);
    
    for (const [nRow, nCol] of neighbors) {
      const neighborKey = `${nRow}-${nCol}`;
      const neighborHex = boardState[neighborKey];
      
      if (neighborHex?.tile) {
        const neighborTags = [neighborHex.tile.tag1, neighborHex.tile.tag2, neighborHex.tile.tag3].filter(tag => tag && tag.trim() !== '');
        const isMatch = placedTileTags.some(tag => neighborTags.includes(tag));
        
        newFeedbackState[neighborKey] = {
          show: true,
          isMatch: isMatch
        };
        
        if (isMatch) {
          feedbackMessages.push(`'${placedTile.word}' & '${neighborHex.tile.word}' matched.`);
        }
      }
    }
    
    // Set feedback state and clear it after 3 seconds
    setFeedbackState(newFeedbackState);
    setTimeout(() => {
      setFeedbackState({});
    }, 3000);
    
    if (feedbackMessages.length === 0) {
        feedbackMessages.push("No tags matched this turn.");
    }
    
    // Add to action history
    const currentPlayerName = TEAMS[(startingPlayerIndex + turn) % TEAMS.length].name;
    const actionEntry = `Round ${round}, ${currentPlayerName}: Placed '${placedTile.word}' at position (${row},${col})${points > 0 ? ` (+${points} points)` : ''}`;
    setActionHistory(prev => [...prev, actionEntry, ...feedbackMessages]);
    
    setLastMoveFeedback(feedbackMessages);

    setBoardState(prev => ({ ...prev, [key]: { color: currentPlayer.textColor, tile: item.tile } }));
    setHand(prevHand => {
      const newHand = [...prevHand];
      newHand[item.handIndex] = null;
      return newHand;
    });

    let updatedScores = scores;
    if (points > 0) {
      updatedScores = scores.map((teamScore, index) => 
        index === currentPlayerIndex ? { ...teamScore, score: teamScore.score + points } : teamScore
      );
      setScores(updatedScores);
    }

    const newPlacedCount = placedTilesCount + 1;
    setPlacedTilesCount(newPlacedCount);

    if (totalGameTiles > 0 && newPlacedCount >= totalGameTiles) {
      setFinalScores(updatedScores);
      setIsGameOver(true);
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

  const handleUndo = () => {
    if (history.length === 0) return;
    
    const prevState = history[history.length - 1];
    
    setBoardState(prevState.boardState);
    setScores(prevState.scores);
    setHand(prevState.hand);
    setDeck(prevState.deck);
    setRound(prevState.round);
    setTurn(prevState.turn);
    setPlacedTilesCount(prevState.placedTilesCount);
    setLastMoveFeedback(prevState.lastMoveFeedback);
    
    // Remove last action entries from history
    const currentPlayerName = TEAMS[(startingPlayerIndex + turn) % TEAMS.length].name;
    const lastTile = Object.values(boardState).find(hex => hex.tile)?.tile;
    if (lastTile) {
      const actionToRemove = `Round ${prevState.round}, ${currentPlayerName}: Placed '${lastTile.word}'`;
      setActionHistory(prev => {
        const index = prev.findIndex(entry => entry.startsWith(actionToRemove));
        if (index !== -1) {
          return prev.slice(0, index);
        }
        return prev;
      });
    }
    
    // Remove the last state from history
    setHistory(prev => prev.slice(0, -1));
    
    // Update undo button state
    setCanUndo(history.length > 1);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <audio ref={audioRef} src={GameMusic} loop />
      <audio ref={sfxRef} src={DropSound} />
      <CustomDragLayer />
      <div className="min-h-screen w-full flex">
        {/* Left Sidebar */}
        <div className="w-80 shrink-0 px-4 py-12 border-r border-gray-200 dark:border-gray-800 flex flex-col items-center justify-between bg-gray-50 dark:bg-gray-900">
          <div className="w-full flex flex-col items-center space-y-6">
            <div className="w-48 flex justify-center items-center">
              <img src={logopart1} alt="Hexa Go! part 1" className="h-12" />
              <img src={logopart2} alt="Hexa Go! part 2" className="h-12" />
              <img src={logopart3} alt="Hexa Go! part 3" className="h-12" />
            </div>
            <TurnIndicator round={round} currentPlayerName={currentPlayer.name} scores={scores} />
            
            {/* Results Box */}
            <div className="w-full">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2 text-center">Results</h3>
              <div className="p-3 border rounded-lg bg-white dark:bg-gray-800 min-h-[120px] text-sm text-gray-700 dark:text-gray-300 space-y-1">
                {lastMoveFeedback.length > 0 ? (
                  lastMoveFeedback.map((msg, index) => (
                    <p key={index}>- {msg}</p>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-center italic text-gray-500">Place a tile to see results.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <VolumeControl audioRef={audioRef} />
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleUndo}
              disabled={!canUndo}
              className="hover:bg-[#EBE5DD]"
            >
              <Undo2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Main Area */}
        <main className="flex-1 flex justify-center p-4 pt-12 overflow-auto relative">
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
              feedbackState={feedbackState}
            />
          </div>
        </main>
      </div>
      <AlertDialog open={isGameOver}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Game End</AlertDialogTitle>
            <AlertDialogDescription>
              The last tile has been placed. The game is now over.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => navigate('/result', { state: { scores: finalScores, tiles: configuredTiles, actionHistory, missedOpportunities } })}>
              View Results
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DndProvider>
  );
};

export default Play;
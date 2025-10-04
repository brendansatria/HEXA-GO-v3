import React from 'react';
import BoardHexagon from './BoardHexagon';
import type { Tile } from '@/context/GameContext';

interface DraggableItem {
  color: string;
  sideLength: number;
  tile: Tile;
  handIndex: number;
}

export interface HexagonState {
  color: string | null;
  tile: Tile | null;
}

interface HexagonalBoardProps {
  rows: number;
  cols: number;
  hexagonSize: number;
  boardState: { [key: string]: HexagonState };
  onDrop: (row: number, col: number, item: DraggableItem) => void;
  isTwoPlayerSetup?: boolean;
  isThreePlayerSetup?: boolean;
}

const HexagonalBoard: React.FC<HexagonalBoardProps> = ({ 
  rows, 
  cols, 
  hexagonSize, 
  boardState, 
  onDrop, 
  isTwoPlayerSetup = false,
  isThreePlayerSetup = false
}) => {
  const sideLength = hexagonSize;
  const hexWidth = Math.sqrt(3) * sideLength;
  const hexHeight = 2 * sideLength;

  let excludedHexes: string[] = [];
  if (isTwoPlayerSetup) {
    excludedHexes = ['1-5', '3-5', '5-5'];
  } else if (isThreePlayerSetup) {
    excludedHexes = ['0-0', '2-0', '4-0'];
  }

  const hexagons = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const key = `${row}-${col}`;

      if (excludedHexes.includes(key)) {
        continue;
      }

      const xOffset = col * hexWidth + (row % 2 === 1 ? hexWidth / 2 : 0);
      const yOffset = row * (hexHeight * 0.75);
      const hexState = boardState[key] || { color: null, tile: null };

      hexagons.push(
        <div
          key={key}
          className="absolute transition-transform duration-200 ease-in-out hover:scale-110 hover:z-10"
          style={{ left: `${xOffset}px`, top: `${yOffset}px` }}
        >
          <BoardHexagon
            sideLength={sideLength}
            color={hexState.color}
            word={hexState.tile?.word}
            onDrop={(item) => onDrop(row, col, item)}
            isOccupied={!!hexState.tile}
          />
        </div>
      );
    }
  }

  const boardWidth = cols * hexWidth + hexWidth / 2;
  const boardHeight = rows * (hexHeight * 0.75) + (hexHeight * 0.25);

  return (
    <div className="relative" style={{ width: `${boardWidth}px`, height: `${boardHeight}px` }}>
      {hexagons}
    </div>
  );
};

export default HexagonalBoard;
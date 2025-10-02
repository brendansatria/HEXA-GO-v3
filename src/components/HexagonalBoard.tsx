import React from 'react';
import BoardHexagon from './BoardHexagon';

interface DraggableItem {
  color: string;
  sideLength: number;
}

interface HexagonalBoardProps {
  rows: number;
  cols: number;
  hexagonSize: number;
  boardState: { [key: string]: string };
  onDrop: (row: number, col: number, item: DraggableItem) => void;
  currentPlayerColor: string;
}

const HexagonalBoard: React.FC<HexagonalBoardProps> = ({ rows, cols, hexagonSize, boardState, onDrop, currentPlayerColor }) => {
  const sideLength = hexagonSize;
  const hexWidth = Math.sqrt(3) * sideLength;
  const hexHeight = 2 * sideLength;

  const hexagons = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const xOffset = col * hexWidth + (row % 2 === 1 ? hexWidth / 2 : 0);
      const yOffset = row * (hexHeight * 0.75);
      const key = `${row}-${col}`;

      hexagons.push(
        <div
          key={key}
          className="absolute transition-transform duration-200 ease-in-out hover:scale-110"
          style={{ left: `${xOffset}px`, top: `${yOffset}px` }}
        >
          <BoardHexagon
            sideLength={sideLength}
            color={boardState[key]}
            onDrop={(item) => onDrop(row, col, item)}
            currentPlayerColor={currentPlayerColor}
            isOccupied={!!boardState[key]}
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
import React from 'react';
import Hexagon from './Hexagon';

interface HexagonalBoardProps {
  rows: number;
  cols: number;
  hexagonSize: number;
}

const HexagonalBoard: React.FC<HexagonalBoardProps> = ({ rows, cols, hexagonSize }) => {
  const sideLength = hexagonSize;
  const hexWidth = Math.sqrt(3) * sideLength;
  const hexHeight = 2 * sideLength;

  const hexagons = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const xOffset = col * hexWidth + (row % 2 === 1 ? hexWidth / 2 : 0);
      const yOffset = row * (hexHeight * 0.75);

      hexagons.push(
        <div
          key={`${row}-${col}`}
          className="absolute transition-transform duration-200 ease-in-out hover:scale-110"
          style={{ left: `${xOffset}px`, top: `${yOffset}px` }}
        >
          <Hexagon 
            sideLength={sideLength} 
            className="text-gray-300 dark:text-gray-700 hover:text-blue-500 dark:hover:text-blue-400 transition-colors" 
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
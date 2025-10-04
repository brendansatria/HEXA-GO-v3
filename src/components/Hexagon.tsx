import React from 'react';
import { cn } from '@/lib/utils';

interface HexagonProps {
  sideLength: number;
  className?: string;
  onClick?: () => void;
  word?: string;
}

const Hexagon: React.FC<HexagonProps> = ({ sideLength, className, onClick, word }) => {
  const width = Math.sqrt(3) * sideLength;
  const height = 2 * sideLength;

  const points = [
    `${width / 2},0`,
    `${width},${height / 4}`,
    `${width},${(height * 3) / 4}`,
    `${width / 2},${height}`,
    `0,${(height * 3) / 4}`,
    `0,${height / 4}`,
  ].join(' ');

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      className="cursor-pointer filter drop-shadow-md"
    >
      <polygon points={points} className={cn("fill-current stroke-white/20", className)} strokeWidth="1.5" />
      {word && (
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="fill-current text-white font-bold drop-shadow-sm"
          style={{ fontSize: `${sideLength / 4}px` }}
        >
          {word}
        </text>
      )}
    </svg>
  );
};

export default Hexagon;
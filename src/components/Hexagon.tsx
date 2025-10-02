import React from 'react';
import { cn } from '@/lib/utils';

interface HexagonProps {
  sideLength: number;
  className?: string;
  onClick?: () => void;
}

const Hexagon: React.FC<HexagonProps> = ({ sideLength, className, onClick }) => {
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
      className="cursor-pointer"
    >
      <polygon points={points} className={cn("fill-current stroke-white", className)} strokeWidth="1" />
    </svg>
  );
};

export default Hexagon;
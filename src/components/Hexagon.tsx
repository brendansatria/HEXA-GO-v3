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

  const getRoundedPath = (s: number, r: number) => {
    const w = Math.sqrt(3) * s;
    const h = 2 * s;
    const tan30 = Math.tan(Math.PI / 6);
    const d = r * tan30;

    return [
      `M ${w / 2}, ${r}`,
      `L ${w - d}, ${h / 4 - r / 2}`,
      `Q ${w}, ${h / 4}, ${w}, ${h / 4 + r}`,
      `L ${w}, ${(3 * h) / 4 - r}`,
      `Q ${w}, ${(3 * h) / 4}, ${w - d}, ${(3 * h) / 4 + r / 2}`,
      `L ${w / 2 + d}, ${h - r / 2}`,
      `Q ${w / 2}, ${h}, ${w / 2 - d}, ${h - r / 2}`,
      `L ${d}, ${(3 * h) / 4 + r / 2}`,
      `Q 0, ${(3 * h) / 4}, 0, ${(3 * h) / 4 - r}`,
      `L 0, ${h / 4 + r}`,
      `Q 0, ${h / 4}, ${d}, ${h / 4 - r / 2}`,
      'Z',
    ].join(' ');
  };

  const cornerRadius = sideLength * 0.1; // 10% of side length for rounding
  const pathData = getRoundedPath(sideLength, cornerRadius);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      className="cursor-pointer"
    >
      <path
        d={pathData}
        className={cn("fill-current stroke-white", className)}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {word && (
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="fill-current text-white font-bold"
          style={{ fontSize: `${sideLength / 4}px` }}
        >
          {word}
        </text>
      )}
    </svg>
  );
};

export default Hexagon;
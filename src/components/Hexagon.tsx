import React from 'react';
import { cn } from '@/lib/utils';

interface HexagonProps {
  sideLength: number;
  className?: string;
  onClick?: () => void;
  word?: string;
}

const Hexagon: React.FC<HexagonProps> = ({ sideLength, className, onClick, word }) => {
  const svgWidth = Math.sqrt(3) * sideLength;
  const svgHeight = 2 * sideLength;
  const strokeWidth = 3;
  const padding = strokeWidth / 2;

  const pathSideLength = (svgWidth - strokeWidth) / Math.sqrt(3);

  const getRoundedPath = (s: number, r: number) => {
    const w = Math.sqrt(3) * s;
    const h = 2 * s;

    // The six corner points of the hexagon
    const p = [
      { x: w / 2, y: 0 }, { x: w, y: h / 4 }, { x: w, y: (3 * h) / 4 },
      { x: w / 2, y: h }, { x: 0, y: (3 * h) / 4 }, { x: 0, y: h / 4 },
    ];

    // Distance from corner to arc tangent point along the edge
    const d = r / Math.tan(Math.PI / 6); // d = r / tan(30 deg)

    // Cap `d` at half the side length to prevent issues with large radii
    const effectiveD = Math.min(d, s / 2);
    const effectiveR = effectiveD * Math.tan(Math.PI / 6);

    // Helper to find a point on a line segment
    const pointOnLine = (p1: {x:number, y:number}, p2: {x:number, y:number}, dist: number) => {
      const totalDist = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
      const ratio = dist / totalDist;
      return { 
        x: p1.x + ratio * (p2.x - p1.x), 
        y: p1.y + ratio * (p2.y - p1.y) 
      };
    };
    
    // Calculate tangent points for each corner's arc
    const tangentPoints = p.map((corner, i) => {
      const pPrev = p[(i + 5) % 6]; // Previous corner
      const pNext = p[(i + 1) % 6]; // Next corner
      return {
        start: pointOnLine(corner, pPrev, effectiveD),
        end: pointOnLine(corner, pNext, effectiveD),
      };
    });

    // Build the path string by connecting the tangent points with lines and arcs
    const pathParts = tangentPoints.map((tp, i) => {
      const line = `L ${tp.start.x},${tp.start.y}`;
      const arc = `A ${effectiveR},${effectiveR} 0 0 1 ${tp.end.x},${tp.end.y}`;
      return `${line} ${arc}`;
    });

    const startPoint = tangentPoints[5].end;
    
    return `M ${startPoint.x},${startPoint.y} ${pathParts.join(' ')}`;
  };

  const cornerRadius = pathSideLength * 0.15;
  const pathData = getRoundedPath(pathSideLength, cornerRadius);

  const pathWidth = Math.sqrt(3) * pathSideLength;
  const pathHeight = 2 * pathSideLength;

  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      className="cursor-pointer"
    >
      <g transform={`translate(${padding}, ${padding})`}>
        <path
          d={pathData}
          className={cn("fill-current stroke-[#f1f1f1]", className)}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
        {word && (
          <text
            x={pathWidth / 2}
            y={pathHeight / 2}
            dominantBaseline="middle"
            textAnchor="middle"
            className="fill-current text-white font-bold"
            style={{ fontSize: `${sideLength / 4}px` }}
          >
            {word}
          </text>
        )}
      </g>
    </svg>
  );
};

export default Hexagon;
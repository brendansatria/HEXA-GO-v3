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

    // If the radius is too large, it will break the shape.
    // We cap `d` at half the side length to prevent this.
    const maxD = s / 2;
    const effectiveD = Math.min(d, maxD);
    const effectiveR = effectiveD * Math.tan(Math.PI / 6);

    // Function to get a point on a line segment
    const pointOnLine = (p1: {x:number, y:number}, p2: {x:number, y:number}, dist: number) => {
      const totalDist = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
      const ratio = dist / totalDist;
      const x = p1.x + ratio * (p2.x - p1.x);
      const y = p1.y + ratio * (p2.y - p1.y);
      return { x, y };
    };
    
    // Calculate the start and end points for each of the 6 arcs
    const a = [
      pointOnLine(p[0], p[5], effectiveD), pointOnLine(p[0], p[1], effectiveD), // Corner 0
      pointOnLine(p[1], p[0], effectiveD), pointOnLine(p[1], p[2], effectiveD), // Corner 1
      pointOnLine(p[2], p[1], effectiveD), pointOnLine(p[2], p[3], effectiveD), // Corner 2
      pointOnLine(p[3], p[2], effectiveD), pointOnLine(p[3], p[4], effectiveD), // Corner 3
      pointOnLine(p[4], p[3], effectiveD), pointOnLine(p[4], p[5], effectiveD), // Corner 4
      pointOnLine(p[5], p[4], effectiveD), pointOnLine(p[5], p[0], effectiveD), // Corner 5
    ];

    // Build the path string with lines and circular arcs
    return [
      `M ${a[1].x},${a[1].y}`,
      `L ${a[2].x},${a[2].y}`, `A ${effectiveR},${effectiveR} 0 0 1 ${a[3].x},${a[3].y}`,
      `L ${a[4].x},${a[4].y}`, `A ${effectiveR},${effectiveR} 0 0 1 ${a[5].x},${a[5].y}`,
      `L ${a[6].x},${a[6].y}`, `A ${effectiveR},${effectiveR} 0 0 1 ${a[7].x},${a[7].y}`,
      `L ${a[8].x},${a[8].y}`, `A ${effectiveR},${effectiveR} 0 0 1 ${a[9].x},${a[9].y}`,
      `L ${a[10].x},${a[10].y}`, `A ${effectiveR},${effectiveR} 0 0 1 ${a[11].x},${a[11].y}`,
      `L ${a[0].x},${a[0].y}`, `A ${effectiveR},${effectiveR} 0 0 1 ${a[1].x},${a[1].y}`,
    ].join(' ');
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
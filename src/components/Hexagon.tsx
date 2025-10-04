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

  const filterId = "glassBevelFilter";

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      className="cursor-pointer"
    >
      <defs>
        <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
          {/* Create a height map from the alpha channel */}
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
          
          {/* Create the lighting effect for a glossy highlight */}
          <feSpecularLighting in="blur" surfaceScale="5" specularConstant="0.75" specularExponent="20" lightingColor="#ffffff" result="specular">
            <fePointLight x="-5000" y="-10000" z="20000" />
          </feSpecularLighting>
          
          {/* Composite the lighting on top of the source graphic */}
          <feComposite in="specular" in2="SourceAlpha" operator="in" result="specular" />
          <feComposite in="SourceGraphic" in2="specular" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="litPaint" />

          {/* Add a subtle drop shadow for depth */}
          <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="shadowBlur" />
          <feOffset in="shadowBlur" dx="2" dy="2" result="shadowOffset" />
          <feFlood floodColor="#000" floodOpacity="0.3" result="shadowColor" />
          <feComposite in="shadowColor" in2="shadowOffset" operator="in" result="shadow" />

          {/* Merge the shadow and the lit graphic */}
          <feMerge>
            <feMergeNode in="shadow" />
            <feMergeNode in="litPaint" />
          </feMerge>
        </filter>
      </defs>
      <polygon 
        points={points} 
        className={cn("fill-current stroke-white", className)} 
        strokeWidth="1"
        filter={`url(#${filterId})`}
      />
      {word && (
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="fill-current text-white font-bold drop-shadow-md"
          style={{ fontSize: `${sideLength / 4}px` }}
        >
          {word}
        </text>
      )}
    </svg>
  );
};

export default Hexagon;
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
      className="cursor-pointer"
    >
      <defs>
        <filter id="bevel" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" result="blur" />
          <feOffset in="blur" dx="2" dy="2" result="offsetBlur" />
          <feSpecularLighting
            in="blur"
            surfaceScale="5"
            specularConstant={0.75}
            specularExponent="20"
            lightingColor="#ffffff"
            result="specOut"
          >
            <fePointLight x="-5000" y="-10000" z="20000" />
          </feSpecularLighting>
          <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut" />
          <feComposite
            in="SourceGraphic"
            in2="specOut"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="1"
            k4="0"
            result="litPaint"
          />
          <feMerge>
            <feMergeNode in="offsetBlur" />
            <feMergeNode in="litPaint" />
          </feMerge>
        </filter>
        <linearGradient id="glassGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'rgba(255,255,255,0.4)' }} />
          <stop offset="100%" style={{ stopColor: 'rgba(255,255,255,0.1)' }} />
        </linearGradient>
      </defs>
      
      <g filter="url(#bevel)">
        <polygon 
          points={points} 
          className={cn("fill-current", className)} 
        />
      </g>

      <polygon 
        points={points} 
        fill="url(#glassGradient)"
        className="stroke-white/20"
        strokeWidth="1.5"
      />

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
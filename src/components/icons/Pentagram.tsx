import React from 'react';

interface PentagramProps {
  size?: number;
  className?: string;
  filled?: boolean;
  strokeWidth?: number;
}

export const Pentagram: React.FC<PentagramProps> = ({ 
  size = 24, 
  className = '', 
  filled = false,
  strokeWidth = 2
}) => {
  // Calcular pontos do pentagrama (estrela de 5 pontas)
  const centerX = size / 2;
  const centerY = size / 2;
  const outerRadius = size * 0.45;
  const innerRadius = size * 0.18;
  const circleRadius = outerRadius + 3; // Círculo 3px além das pontas
  
  // Ângulos para 5 pontas (começando do topo, -90 graus)
  const points: { x: number; y: number }[] = [];
  
  for (let i = 0; i < 10; i++) {
    const angle = (Math.PI * 2 * i) / 10 - Math.PI / 2;
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    points.push({
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    });
  }
  
  const pathData = `M ${points.map((p, i) => 
    i === 0 ? `${p.x},${p.y}` : `L ${p.x},${p.y}`
  ).join(' ')} Z`;
  
  // Pentagrama tradicional: linhas conectando pontas alternadas
  const pentagramLines = [
    [points[0], points[4]], // Topo -> Baixo Esquerda
    [points[4], points[8]], // Baixo Esquerda -> Direita Alta
    [points[8], points[2]], // Direita Alta -> Esquerda Alta
    [points[2], points[6]], // Esquerda Alta -> Baixo Direita
    [points[6], points[0]], // Baixo Direita -> Topo
  ];

  const padding = 4;
  const viewBoxSize = size + (padding * 2);
  const offset = padding;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`${-offset} ${-offset} ${viewBoxSize} ${viewBoxSize}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <filter id="pentagram-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.4"/>
        </filter>
      </defs>
      {filled ? (
        <path
          d={pathData}
          fill="currentColor"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinejoin="miter"
          filter="url(#pentagram-shadow)"
        />
      ) : (
        <g filter="url(#pentagram-shadow)">
          {/* Desenhar círculo externo */}
          <circle
            cx={centerX}
            cy={centerY}
            r={circleRadius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
          />
          
          {/* Desenhar linhas do pentagrama */}
          {pentagramLines.map((line, i) => (
            <line
              key={i}
              x1={line[0].x}
              y1={line[0].y}
              x2={line[1].x}
              y2={line[1].y}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          ))}
        </g>
      )}
    </svg>
  );
};

export default Pentagram;

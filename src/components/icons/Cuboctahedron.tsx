import React from 'react';

interface CuboctahedronProps {
  size?: number;
  className?: string;
  strokeWidth?: number;
  showFaces?: boolean;
}

export const Cuboctahedron: React.FC<CuboctahedronProps> = ({ 
  size = 24, 
  className = '', 
  strokeWidth = 2,
  showFaces = true
}) => {
  const padding = size * 0.08; // Padding proporcional (8% do tamanho)
  const viewBoxSize = size + (padding * 2);
  const centerX = viewBoxSize / 2;
  const centerY = viewBoxSize / 2;
  const scale = size * 0.32;
  
  // Vértices do cuboctaedro em projeção isométrica
  // 12 vértices posicionados nas arestas de um cubo
  const sqrt2 = Math.sqrt(2);
  
  // Função para projetar 3D para 2D (isométrico)
  const project = (x: number, y: number, z: number) => {
    const isoX = (x - z) * Math.cos(Math.PI / 6);
    const isoY = (x + z) * Math.sin(Math.PI / 6) - y;
    return {
      x: centerX + isoX * scale,
      y: centerY + isoY * scale
    };
  };
  
  // 12 vértices do cuboctaedro (normalizado)
  const vertices = [
    project(1, 0, 1),    // 0: frente-direita-meio
    project(1, 0, -1),   // 1: trás-direita-meio
    project(-1, 0, 1),   // 2: frente-esquerda-meio
    project(-1, 0, -1),  // 3: trás-esquerda-meio
    project(0, 1, 1),    // 4: frente-topo-meio
    project(0, 1, -1),   // 5: trás-topo-meio
    project(0, -1, 1),   // 6: frente-baixo-meio
    project(0, -1, -1),  // 7: trás-baixo-meio
    project(1, 1, 0),    // 8: direita-topo-meio
    project(1, -1, 0),   // 9: direita-baixo-meio
    project(-1, 1, 0),   // 10: esquerda-topo-meio
    project(-1, -1, 0),  // 11: esquerda-baixo-meio
  ];
  
  // Faces triangulares (8 triângulos)
  const triangularFaces = [
    [0, 4, 8],   // frente-direita-topo
    [0, 6, 9],   // frente-direita-baixo
    [2, 4, 10],  // frente-esquerda-topo
    [2, 6, 11],  // frente-esquerda-baixo
    [1, 5, 8],   // trás-direita-topo
    [1, 7, 9],   // trás-direita-baixo
    [3, 5, 10],  // trás-esquerda-topo
    [3, 7, 11],  // trás-esquerda-baixo
  ];
  
  // Faces quadradas (6 quadrados)
  const squareFaces = [
    [0, 4, 2, 6],    // frente
    [1, 5, 3, 7],    // trás
    [0, 8, 1, 9],    // direita
    [2, 10, 3, 11],  // esquerda
    [4, 8, 5, 10],   // topo
    [6, 9, 7, 11],   // baixo
  ];
  
  // Arestas classificadas por profundidade (Z)
  // Vértices com Z positivo (frente): 0, 2, 4, 6
  // Vértices com Z negativo (trás): 1, 3, 5, 7
  // Vértices com Z zero (meio): 8, 9, 10, 11
  
  const frontEdges = [
    // Arestas totalmente na frente (Z > 0)
    [0, 4], [4, 2], [2, 6], [6, 0], // quadrado frontal
  ];
  
  const middleEdges = [
    // Arestas conectando frente-meio ou meio-meio
    [0, 8], [4, 8], // frente-topo-direita
    [2, 10], [4, 10], // frente-topo-esquerda
    [0, 9], [6, 9], // frente-baixo-direita
    [2, 11], [6, 11], // frente-baixo-esquerda
    [8, 5], [5, 10], // topo (meio)
    [9, 7], [7, 11], // baixo (meio)
  ];
  
  const backEdges = [
    // Arestas totalmente atrás (Z < 0)
    [1, 5], [5, 3], [3, 7], [7, 1], // quadrado traseiro
    // Arestas conectando meio-trás
    [8, 1], [1, 9], // meio-trás-direita
    [10, 3], [3, 11], // meio-trás-esquerda
  ];

  // Centro geométrico
  const center = { x: centerX, y: centerY };

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Gradiente radial simulando luz do centro */}
        <radialGradient id="center-light" cx="50%" cy="50%" r="80%">
          <stop offset="0%" stopColor="white" stopOpacity="0.9"/>
          <stop offset="40%" stopColor="white" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="white" stopOpacity="0"/>
        </radialGradient>
        
        {/* Gradiente linear para raios metálicos - do centro para fora */}
        <linearGradient id="silver-ray" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#e5e7eb" stopOpacity="1"/>
          <stop offset="20%" stopColor="#f9fafb" stopOpacity="1"/>
          <stop offset="40%" stopColor="#d1d5db" stopOpacity="1"/>
          <stop offset="60%" stopColor="#f3f4f6" stopOpacity="1"/>
          <stop offset="80%" stopColor="#9ca3af" stopOpacity="0.9"/>
          <stop offset="100%" stopColor="#6b7280" stopOpacity="0.8"/>
        </linearGradient>
        
        {/* Gradiente dourado para arestas externas */}
        <linearGradient id="golden-edge" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fef3c7" stopOpacity="1"/>
          <stop offset="20%" stopColor="#fde68a" stopOpacity="1"/>
          <stop offset="40%" stopColor="#fcd34d" stopOpacity="1"/>
          <stop offset="60%" stopColor="#f59e0b" stopOpacity="1"/>
          <stop offset="80%" stopColor="#d97706" stopOpacity="0.95"/>
          <stop offset="100%" stopColor="#b45309" stopOpacity="0.9"/>
        </linearGradient>
        
        <filter id="cuboctahedron-white-glow" x="-200%" y="-200%" width="500%" height="500%">
          {/* Múltiplas camadas de glow progressivamente mais difusas */}
          <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur1"/>
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur2"/>
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur3"/>
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur4"/>
          
          <feFlood floodColor="white" floodOpacity="0.95" result="white"/>
          <feComposite in="white" in2="blur1" operator="in" result="glow1"/>
          <feComposite in="white" in2="blur2" operator="in" result="glow2"/>
          <feComposite in="white" in2="blur3" operator="in" result="glow3"/>
          <feComposite in="white" in2="blur4" operator="in" result="glow4"/>
          
          <feMerge>
            <feMergeNode in="glow1"/>
            <feMergeNode in="glow2"/>
            <feMergeNode in="glow3"/>
            <feMergeNode in="glow4"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        {/* Gradiente radial branco irradiando do centro */}
        <radialGradient id="white-radiance" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="20%" stopColor="white" stopOpacity="0.8" />
          <stop offset="50%" stopColor="white" stopOpacity="0.3" />
          <stop offset="80%" stopColor="white" stopOpacity="0.1" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        
        {/* Filtro de borrão branco para arestas */}
        <filter id="edge-white-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur"/>
          <feFlood floodColor="white" floodOpacity="0.7" result="white"/>
          <feComposite in="white" in2="blur" operator="in" result="whiteBlur"/>
          <feMerge>
            <feMergeNode in="whiteBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Fundo com brilho irradiante do centro */}
      <rect
        x="0"
        y="0"
        width={viewBoxSize}
        height={viewBoxSize}
        fill="url(#white-radiance)"
      />
      
      {/* Arestas externas - sem efeitos */}
      {[...backEdges, ...middleEdges, ...frontEdges].map((edge, i) => {
        const v1 = vertices[edge[0]];
        const v2 = vertices[edge[1]];
        return (
          <line
            key={`edge-${i}`}
            x1={v1.x}
            y1={v1.y}
            x2={v2.x}
            y2={v2.y}
            stroke="#000000"
            strokeWidth={Math.max(0.5, (strokeWidth - 2) * 0.5 - 1)}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      })}
        
      {/* Arestas radiais do centro - sem efeitos */}
      {vertices.map((v, i) => (
        <line
          key={`radial-${i}`}
          x1={center.x}
          y1={center.y}
          x2={v.x}
          y2={v.y}
          stroke="#000000"
          strokeWidth={Math.max(0.5, ((strokeWidth * 0.8) - 2) * 0.5 - 1)}
          strokeLinecap="round"
        />
      ))}
      
      {/* Vértices externos - 12 cores distintas */}
        {vertices.map((v, i) => {
          // Cores distintas e vibrantes (sem preto)
          const colors = [
            '#FF0000', // Vermelho puro
            '#FF8800', // Laranja
            '#FFD700', // Dourado
            '#00FF00', // Verde limão
            '#00CED1', // Turquesa
            '#0000FF', // Azul puro
            '#8B00FF', // Violeta
            '#FF00FF', // Magenta
            '#FF1493', // Pink profundo
            '#00FFFF', // Ciano
            '#ADFF2F', // Verde-amarelo
            '#FF4500', // Laranja-vermelho
          ];
          return (
            <circle
              key={`v-${i}`}
              cx={v.x}
              cy={v.y}
              r={strokeWidth * 0.6}
              fill={colors[i]}
              fillOpacity={0}
              stroke="white"
              strokeOpacity={0}
              strokeWidth={strokeWidth * 0.15}
            />
          );
        })}
        
      {/* Centro irradiante - o mais importante */}
      <circle
        cx={center.x}
        cy={center.y}
        r={strokeWidth * 0.9}
        fill="#FFFFFF"
        stroke="#000000"
        strokeWidth={0.5}
        filter="url(#cuboctahedron-white-glow)"
      />
    </svg>
  );
};

export default Cuboctahedron;

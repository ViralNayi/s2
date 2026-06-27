import React, { useState, useEffect } from 'react';
import mapMockupUrl from '../assets/logistics_map_mockup.png';

export interface NodeInfo {
  name: string;
  code: string;
  x: number;
  y: number;
  volume: 'high' | 'medium' | 'low';
}

export const MAP_NODES: Record<string, NodeInfo> = {
  'Bhopal Hub Node': { name: 'Bhopal Hub Node', code: 'BPL-HUB', x: 400, y: 220, volume: 'high' },
  'Sehore Terminal': { name: 'Sehore Terminal', code: 'SEH-TRM', x: 200, y: 180, volume: 'high' },
  'Kurawar Gateway': { name: 'Kurawar Gateway', code: 'KUR-GTW', x: 120, y: 300, volume: 'low' },
  'Vidisha Portal': { name: 'Vidisha Portal', code: 'VID-PRT', x: 580, y: 140, volume: 'medium' },
  'Sonagir Depot': { name: 'Sonagir Depot', code: 'SON-DEP', x: 700, y: 200, volume: 'medium' },
  'Mandideep Sector': { name: 'Mandideep Sector', code: 'MAN-SEC', x: 500, y: 320, volume: 'medium' },
  'Dewas Connector': { name: 'Dewas Connector', code: 'DEW-CON', x: 80, y: 100, volume: 'low' },
  'Sagar Trunk Stop': { name: 'Sagar Trunk Stop', code: 'SGR-TRK', x: 680, y: 80, volume: 'high' },
  'Guna Transit': { name: 'Guna Transit', code: 'GUN-TRN', x: 350, y: 80, volume: 'low' },
  'Hoshangabad Node': { name: 'Hoshangabad Node', code: 'HOS-NOD', x: 450, y: 380, volume: 'medium' },
};

export const matchNode = (address: string): NodeInfo => {
  const normalized = (address || '').toLowerCase();
  if (normalized.includes('bhopal')) return MAP_NODES['Bhopal Hub Node'];
  if (normalized.includes('sehore')) return MAP_NODES['Sehore Terminal'];
  if (normalized.includes('kurawar')) return MAP_NODES['Kurawar Gateway'];
  if (normalized.includes('vidisha')) return MAP_NODES['Vidisha Portal'];
  if (normalized.includes('sonagir')) return MAP_NODES['Sonagir Depot'];
  if (normalized.includes('mandideep')) return MAP_NODES['Mandideep Sector'];
  if (normalized.includes('dewas')) return MAP_NODES['Dewas Connector'];
  if (normalized.includes('sagar')) return MAP_NODES['Sagar Trunk Stop'];
  if (normalized.includes('guna')) return MAP_NODES['Guna Transit'];
  if (normalized.includes('hoshangabad')) return MAP_NODES['Hoshangabad Node'];
  return MAP_NODES['Bhopal Hub Node'];
};

interface StaticPath {
  from: string;
  to: string;
  heat: 'high' | 'medium' | 'low';
}

const STATIC_PATHS: StaticPath[] = [
  { from: 'Dewas Connector', to: 'Sehore Terminal', heat: 'low' },
  { from: 'Kurawar Gateway', to: 'Sehore Terminal', heat: 'low' },
  { from: 'Sehore Terminal', to: 'Bhopal Hub Node', heat: 'high' },
  { from: 'Guna Transit', to: 'Bhopal Hub Node', heat: 'low' },
  { from: 'Guna Transit', to: 'Vidisha Portal', heat: 'low' },
  { from: 'Bhopal Hub Node', to: 'Vidisha Portal', heat: 'high' },
  { from: 'Bhopal Hub Node', to: 'Mandideep Sector', heat: 'high' },
  { from: 'Mandideep Sector', to: 'Hoshangabad Node', heat: 'medium' },
  { from: 'Vidisha Portal', to: 'Sonagir Depot', heat: 'medium' },
  { from: 'Vidisha Portal', to: 'Sagar Trunk Stop', heat: 'medium' },
  { from: 'Sonagir Depot', to: 'Sagar Trunk Stop', heat: 'medium' },
  { from: 'Mandideep Sector', to: 'Sonagir Depot', heat: 'low' },
];

// Helper to compute curve path string (Quadratic Bezier)
export const getCurvePath = (x1: number, y1: number, x2: number, y2: number) => {
  const xc = (x1 + x2) / 2;
  const yc = (y1 + y2) / 2 - 40; // curve offset
  return `M ${x1} ${y1} Q ${xc} ${yc}, ${x2} ${y2}`;
};

// Interpolate coordinates along Quadratic Bezier
export const getBezierXY = (x1: number, y1: number, x2: number, y2: number, t: number) => {
  const xc = (x1 + x2) / 2;
  const yc = (y1 + y2) / 2 - 40;
  const x = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * xc + t * t * x2;
  const y = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * yc + t * t * y2;
  return { x, y };
};

interface InteractiveRouteMapProps {
  mode: 'mission-control' | 'guided-flow' | 'opportunity-engine' | 'journey-tracking';
  highlightedRoute?: { pickup: string; destination: string };
  activeOrders?: any[];
  selectedOrderId?: string;
  onNodeClick?: (node: NodeInfo) => void;
  selectedNodeName?: string;
  theme?: 'light' | 'dark';
}

export const InteractiveRouteMap: React.FC<InteractiveRouteMapProps> = ({
  mode,
  highlightedRoute,
  activeOrders = [],
  selectedOrderId,
  onNodeClick,
  selectedNodeName,
}) => {
  const [globalProgress, setGlobalProgress] = useState(0);

  // Simulation tick logic
  useEffect(() => {
    const interval = setInterval(() => {
      setGlobalProgress((prev) => (prev + 0.005) % 1.0);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // Match highlighted nodes if in guided flow or tracking mode
  let highlightStartNode: NodeInfo | null = null;
  let highlightEndNode: NodeInfo | null = null;

  if (mode === 'guided-flow' && highlightedRoute) {
    if (highlightedRoute.pickup) highlightStartNode = matchNode(highlightedRoute.pickup);
    if (highlightedRoute.destination) highlightEndNode = matchNode(highlightedRoute.destination);
  } else if (mode === 'journey-tracking' && selectedOrderId) {
    const targetOrder = activeOrders.find((o) => o.id === selectedOrderId);
    if (targetOrder) {
      highlightStartNode = matchNode(targetOrder.pickup);
      highlightEndNode = matchNode(targetOrder.destination);
    }
  }

  // Determine progress for journey tracking order
  const getOrderProgress = (status: string) => {
    switch (status) {
      case 'pending': return 0.05;
      case 'matched': return 0.25;
      case 'picked_up': return 0.45;
      case 'in_transit': return 0.65;
      case 'near_destination': return 0.85;
      case 'delivered': return 1.0;
      default: return 0.3;
    }
  };

  return (
    <div 
      className="relative w-full aspect-[16/9] md:aspect-[16/8] rounded-3xl border border-slate-200/80 transition-all duration-300 overflow-hidden select-none bg-cover bg-center shadow-sm"
      style={{ backgroundImage: `url(${mapMockupUrl})` }}
    >
      {/* Light gradient overlay to keep map lines clean but subtle */}
      <div className="absolute inset-0 bg-white/10 backdrop-brightness-[1.02] pointer-events-none" />

      {/* Main SVG drawing board */}
      <svg className="w-full h-full relative z-10" viewBox="0 0 800 450">
        <defs>
          <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00F2FE" />
            <stop offset="100%" stopColor="#4FACFE" />
          </linearGradient>
          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. Draw static background connections */}
        {mode !== 'journey-tracking' &&
          STATIC_PATHS.map((path, idx) => {
            const start = MAP_NODES[path.from];
            const end = MAP_NODES[path.to];
            if (!start || !end) return null;

            // Renders differently based on mode
            if (mode === 'opportunity-engine') {
              // Heatmap Mode: Highlight routes according to volume
              const heatClass =
                path.heat === 'high'
                  ? 'route-heat-high'
                  : path.heat === 'medium'
                  ? 'route-heat-medium'
                  : 'route-heat-low';
              return (
                <path
                  key={idx}
                  d={getCurvePath(start.x, start.y, end.x, end.y)}
                  fill="none"
                  className={heatClass}
                />
              );
            }

            // Normal matching line
            const isHighlighted =
              (highlightStartNode?.name === start.name && highlightEndNode?.name === end.name) ||
              (highlightStartNode?.name === end.name && highlightEndNode?.name === start.name);

            return (
              <g key={idx}>
                <path
                  d={getCurvePath(start.x, start.y, end.x, end.y)}
                  fill="none"
                  stroke={isHighlighted ? '#f97316' : 'rgba(148, 163, 184, 0.4)'}
                  strokeWidth={isHighlighted ? 3.5 : 1.75}
                />
                {isHighlighted && (
                  <path
                    d={getCurvePath(start.x, start.y, end.x, end.y)}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    className="animate-route-path"
                  />
                )}
              </g>
            );
          })}

        {/* 2. Journey tracking route overlay */}
        {mode === 'journey-tracking' && highlightStartNode && highlightEndNode && (
          <g>
            {/* Background path underlay */}
            <path
              d={getCurvePath(highlightStartNode.x, highlightStartNode.y, highlightEndNode.x, highlightEndNode.y)}
              fill="none"
              stroke="rgba(148, 163, 184, 0.25)"
              strokeWidth="5"
            />
            {/* Main path */}
            <path
              d={getCurvePath(highlightStartNode.x, highlightStartNode.y, highlightEndNode.x, highlightEndNode.y)}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3.5"
            />
            {/* Dashed flowing line */}
            <path
              d={getCurvePath(highlightStartNode.x, highlightStartNode.y, highlightEndNode.x, highlightEndNode.y)}
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.5"
              className="animate-route-path"
            />
          </g>
        )}

        {/* 3. Live parcel flows for active orders */}
        {mode === 'mission-control' &&
          activeOrders.map((order, idx) => {
            const start = matchNode(order.pickup);
            const end = matchNode(order.destination);
            if (!start || !end) return null;

            // Determine traveler flow progress
            // Each order uses a different offset/speed multiplier so they look natural
            const speedMultiplier = 1 + (idx % 3) * 0.3;
            const progress = (globalProgress * speedMultiplier + (idx * 0.25)) % 1.0;
            const pos = getBezierXY(start.x, start.y, end.x, end.y, progress);

            // Hide delivered orders or show them locked at the destination
            if (order.status === 'delivered') return null;

            return (
              <g key={order.id}>
                {/* Flow line underlay */}
                <path
                  d={getCurvePath(start.x, start.y, end.x, end.y)}
                  fill="none"
                  stroke="rgba(148, 163, 184, 0.15)"
                  strokeWidth="1.5"
                />
                {/* Moving parcel bubble */}
                <circle cx={pos.x} cy={pos.y} r="5.5" fill="#3b82f6" />
                <circle cx={pos.x} cy={pos.y} r="11" fill="none" stroke="#3b82f6" strokeWidth="1" className="animate-ping" style={{ animationDuration: '2.5s' }} />
                <text 
                  x={pos.x + 8} 
                  y={pos.y - 6} 
                  fill="#64748b" 
                  fontSize="7.5" 
                  fontWeight="bold"
                  fontFamily="system-ui, -apple-system, sans-serif"
                >
                  {order.id}
                </text>
              </g>
            );
          })}

        {/* 4. Draw moving object for journey tracking */}
        {mode === 'journey-tracking' && highlightStartNode && highlightEndNode && selectedOrderId && (
          (() => {
            const order = activeOrders.find((o) => o.id === selectedOrderId);
            const progress = order ? getOrderProgress(order.status) : 0.45;
            const pos = getBezierXY(highlightStartNode.x, highlightStartNode.y, highlightEndNode.x, highlightEndNode.y, progress);

            return (
              <g>
                <circle cx={pos.x} cy={pos.y} r="8.5" fill="#3b82f6" />
                <circle cx={pos.x} cy={pos.y} r="17" fill="none" stroke="#3b82f6" strokeWidth="1.5" className="animate-ping" />
                <text 
                  x={pos.x - 20} 
                  y={pos.y - 14} 
                  fill="#0f172a" 
                  fontSize="9.5" 
                  fontWeight="bold" 
                  fontFamily="system-ui, -apple-system, sans-serif"
                >
                  PARCEL: {selectedOrderId}
                </text>
              </g>
            );
          })()
        )}

        {/* 5. Draw Towns / Village Nodes */}
        {Object.values(MAP_NODES).map((node) => {
          const isSelected = selectedNodeName === node.name;
          const isHighlighted = highlightStartNode?.name === node.name || highlightEndNode?.name === node.name;

          return (
            <g
              key={node.name}
              className="cursor-pointer group"
              onClick={() => onNodeClick?.(node)}
            >
              {/* Outer pulsing ring for hot/active nodes */}
              {(isHighlighted || isSelected || node.volume === 'high') && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isSelected ? 18 : 14}
                  fill="none"
                  stroke={isHighlighted ? '#f97316' : '#3b82f6'}
                  strokeWidth="1.25"
                  className="animate-ping"
                  style={{ animationDuration: isSelected ? '1.5s' : '3s' }}
                />
              )}

              {/* Node base circle */}
              <circle
                cx={node.x}
                cy={node.y}
                r={isSelected ? 7.5 : isHighlighted ? 6 : 5}
                fill={isSelected ? '#3b82f6' : isHighlighted ? '#f97316' : '#ffffff'}
                stroke={isSelected ? '#1d4ed8' : isHighlighted ? '#ea580c' : '#94a3b8'}
                strokeWidth={isHighlighted || isSelected ? 2.5 : 1.75}
                className="transition-all duration-300"
              />

              {/* Text Label */}
              <text
                x={node.x + 10}
                y={node.y + 3}
                fill={isSelected ? '#0f172a' : isHighlighted ? '#1d4ed8' : '#475569'}
                fontSize={isSelected ? '9.5' : '8.5'}
                fontWeight={isHighlighted || isSelected ? 'bold' : '600'}
                fontFamily="system-ui, -apple-system, sans-serif"
              >
                {node.name.replace(' Node', '').replace(' Terminal', '').replace(' Gateway', '').replace(' Portal', '').replace(' Depot', '').replace(' Sector', '').replace(' Connector', '').replace(' Trunk Stop', '').replace(' Transit', '')}
              </text>

              {/* Node ID indicator */}
              <text
                x={node.x + 10}
                y={node.y - 7}
                fill="#94a3b8"
                fontSize="6.5"
                fontWeight="500"
                fontFamily="system-ui, -apple-system, sans-serif"
              >
                [{node.code}]
              </text>
            </g>
          );
        })}
      </svg>

      {/* Floating HUD stats bar on mission-control mode */}
      {mode === 'mission-control' && (
        <div className="absolute bottom-4 left-4 right-4 backdrop-blur-md bg-white/80 border border-slate-200/80 p-3 rounded-2xl flex items-center justify-between text-[10px] font-semibold text-slate-650 z-20 shadow-sm font-sans">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> NETWORK LIVE</span>
            <span className="hidden sm:inline text-slate-200">|</span>
            <span className="hidden sm:inline">NODES: 10 ONLINE</span>
            <span className="hidden sm:inline text-slate-200">|</span>
            <span>ACTIVE FLOWS: {activeOrders.filter(o => o.status !== 'delivered').length} PARCELS</span>
          </div>
          <span className="text-blue-600">BAUD 115200 // HZ 60</span>
        </div>
      )}
    </div>
  );
};

import React, { useEffect, useRef } from 'react';
import type { ThemeType } from '../context/ThemeContext';
import { useTheme } from '../context/ThemeContext';

interface Node {
  x: number;
  y: number;
  id: number;
  name: string;
  size: number;
  pulseSpeed: number;
  angle: number;
  range: number;
  speed: number;
  baseX: number;
  baseY: number;
}

interface Path {
  from: Node;
  to: Node;
  progress: number;
  speed: number;
}

export const RouteCanvas: React.FC<{ fullScreen?: boolean }> = ({ fullScreen = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const mouseRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: null, y: null };
    };

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Named Village Nodes with localized relative coordinate estimates
    const hubDefinitions = [
      { name: 'Bhopal Hub Node', xRatio: 0.35, yRatio: 0.5 },
      { name: 'Sehore Terminal', xRatio: 0.15, yRatio: 0.35 },
      { name: 'Kurawar Gateway', xRatio: 0.12, yRatio: 0.65 },
      { name: 'Vidisha Portal', xRatio: 0.65, yRatio: 0.25 },
      { name: 'Sonagir Depot', xRatio: 0.85, yRatio: 0.45 },
      { name: 'Mandideep Sector', xRatio: 0.55, yRatio: 0.75 },
      { name: 'Dewas Connector', xRatio: 0.08, yRatio: 0.15 },
      { name: 'Sagar Trunk Stop', xRatio: 0.82, yRatio: 0.12 },
      { name: 'Guna Transit', xRatio: 0.45, yRatio: 0.18 },
      { name: 'Hoshangabad Node', xRatio: 0.48, yRatio: 0.85 },
    ];

    const nodes: Node[] = [];
    hubDefinitions.forEach((hub, idx) => {
      const x = hub.xRatio * width;
      const y = hub.yRatio * height;
      nodes.push({
        id: idx,
        name: hub.name,
        x,
        y,
        baseX: x,
        baseY: y,
        size: idx < 6 ? 6 : 4, // Larger core nodes
        pulseSpeed: Math.random() * 0.03 + 0.015,
        angle: Math.random() * Math.PI * 2,
        range: Math.random() * 10 + 4,
        speed: Math.random() * 0.006 + 0.003,
      });
    });

    // If fullscreen/Matrix, fill with additional minor nodes representing rural cargo nodes
    const fillCount = fullScreen || theme === 'matrix' ? 15 : 5;
    for (let i = 0; i < fillCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      nodes.push({
        id: nodes.length,
        name: `Node-${nodes.length}`,
        x,
        y,
        baseX: x,
        baseY: y,
        size: 3,
        pulseSpeed: Math.random() * 0.04 + 0.02,
        angle: Math.random() * Math.PI * 2,
        range: Math.random() * 12 + 6,
        speed: Math.random() * 0.008 + 0.004,
      });
    }

    // Connect nodes by proximity
    const paths: Path[] = [];
    for (let i = 0; i < nodes.length; i++) {
      const distances = nodes
        .map((n, idx) => ({ idx, dist: Math.hypot(n.x - nodes[i].x, n.y - nodes[i].y) }))
        .filter((d) => d.idx !== i)
        .sort((a, b) => a.dist - b.dist);

      const limit = i < 6 ? 3 : 1; // Core hubs connect to more nodes
      for (let c = 0; c < Math.min(limit, distances.length); c++) {
        const target = nodes[distances[c].idx];
        const exists = paths.some(
          (p) => (p.from.id === i && p.to.id === target.id) || (p.from.id === target.id && p.to.id === i)
        );
        if (!exists && distances[c].dist < width * 0.4) {
          paths.push({
            from: nodes[i],
            to: target,
            progress: Math.random(),
            speed: Math.random() * 0.003 + 0.0015,
          });
        }
      }
    }

    const getThemeColors = (activeTheme: ThemeType) => {
      switch (activeTheme) {
        case 'ocean':
          return { node: '#06B6D4', path: 'rgba(6, 182, 212, 0.15)', particle: '#34D399', glow: '#06B6D4' };
        case 'aurora':
          return { node: '#C084FC', path: 'rgba(192, 132, 252, 0.15)', particle: '#F472B6', glow: '#C084FC' };
        case 'emerald':
          return { node: '#10B981', path: 'rgba(16, 185, 129, 0.15)', particle: '#14B8A6', glow: '#10B981' };
        case 'sunset':
          return { node: '#F97316', path: 'rgba(249, 115, 22, 0.15)', particle: '#EC4899', glow: '#F97316' };
        case 'cyber':
          return { node: '#22C55E', path: 'rgba(34, 197, 94, 0.22)', particle: '#4AF626', glow: '#22C55E' };
        case 'royal':
          return { node: '#D4AF37', path: 'rgba(212, 175, 55, 0.15)', particle: '#FEF3C7', glow: '#D4AF37' };
        case 'matrix':
          return { node: '#00F2FE', path: 'rgba(0, 242, 254, 0.35)', particle: '#4FACFE', glow: '#00F2FE' };
        case 'light':
          return { node: '#18181B', path: 'rgba(24, 24, 27, 0.12)', particle: '#71717A', glow: '#18181B' };
        case 'midnight':
        default:
          return { node: '#00D4FF', path: 'rgba(0, 212, 255, 0.18)', particle: '#FAFAFA', glow: '#00D4FF' };
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const colors = getThemeColors(theme);
      const mouse = mouseRef.current;

      // Update positions slightly (floating/drift effect)
      nodes.forEach((node) => {
        node.angle += node.speed;
        node.x = node.baseX + Math.cos(node.angle) * node.range;
        node.y = node.baseY + Math.sin(node.angle) * node.range;
      });

      // Draw paths
      ctx.lineWidth = 1;
      paths.forEach((path) => {
        ctx.strokeStyle = colors.path;
        ctx.beginPath();
        ctx.moveTo(path.from.x, path.from.y);
        ctx.lineTo(path.to.x, path.to.y);
        ctx.stroke();

        // Draw and update parcel particles
        path.progress += path.speed;
        if (path.progress > 1) {
          path.progress = 0;
          path.speed = Math.random() * 0.003 + 0.0015;
        }

        const particleX = path.from.x + (path.to.x - path.from.x) * path.progress;
        const particleY = path.from.y + (path.to.y - path.from.y) * path.progress;

        ctx.fillStyle = colors.particle;
        ctx.shadowBlur = theme !== 'light' ? 10 : 0;
        ctx.shadowColor = colors.glow;
        ctx.beginPath();
        ctx.arc(particleX, particleY, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw magnetic mouse threads
      if (mouse.x !== null && mouse.y !== null) {
        // Connect mouse to 3 nearest nodes
        const mouseNearby = nodes
          .map((n) => ({ node: n, dist: Math.hypot(n.x - (mouse.x as number), n.y - (mouse.y as number)) }))
          .sort((a, b) => a.dist - b.dist)
          .slice(0, 3);

        mouseNearby.forEach((m) => {
          if (m.dist < 250) {
            ctx.strokeStyle = theme === 'light' ? 'rgba(24, 24, 27, 0.08)' : 'rgba(var(--primary-rgb), 0.15)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(m.node.x, m.node.y);
            ctx.lineTo(mouse.x as number, mouse.y as number);
            ctx.stroke();
          }
        });
      }

      // Draw nodes and text labels
      nodes.forEach((node) => {
        const pulse = Math.sin(Date.now() * node.pulseSpeed) * 2.5;
        ctx.fillStyle = colors.node;
        ctx.shadowBlur = theme !== 'light' ? 15 : 0;
        ctx.shadowColor = colors.glow;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size + pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw Labels for Primary Hubs
        if (!node.name.startsWith('Node-')) {
          ctx.fillStyle = theme === 'light' ? 'rgba(24, 24, 27, 0.75)' : 'rgba(250, 250, 250, 0.7)';
          ctx.font = theme === 'cyber' ? '10px Fira Code' : '10px Plus Jakarta Sans';
          ctx.fillText(node.name, node.x + 12, node.y + 4);

          // Render coordinate metrics
          ctx.fillStyle = theme === 'light' ? 'rgba(24, 24, 27, 0.35)' : 'rgba(250, 250, 250, 0.3)';
          ctx.font = '8px Fira Code';
          ctx.fillText(`[${Math.floor(node.x)},${Math.floor(node.y)}]`, node.x + 12, node.y - 6);
        }
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
      }
      cancelAnimationFrame(animationId);
    };
  }, [theme, fullScreen]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${
        theme === 'matrix' ? 'opacity-90' : 'opacity-50'
      } transition-opacity duration-1000 z-0`}
    />
  );
};

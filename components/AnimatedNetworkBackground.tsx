'use client';

import React from 'react';

type Props = {
  className?: string;
  /** Whether the background animates. Defaults to true. */
  moving?: boolean;
  /** Visual density: nodes per 10k px^2. */
  density?: number; // nodes per 10k px^2
  /** Scales node velocity for a snappier feel. Defaults to 1.8. */
  speedMultiplier?: number;
  /** Line width for edges. Defaults to 1.25. */
  lineWidth?: number;
  /** Node Size @default 2.2 */
  nodeSize?: number;
};

type Node = { x: number; y: number; vx: number; vy: number };

// A lightweight, continuous animated network background.
// - Respects prefers-reduced-motion
// - Auto scales for devicePixelRatio and container size
// - Draws subtle edges for nearby nodes and soft nodes
export default function AnimatedNetworkBackground({
  className,
  density = 0.4,
  moving = true,
  speedMultiplier = 1.8,
  lineWidth = 1.25,
  nodeSize = 2.2,
}: Props) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const rafRef = React.useRef<number | null>(null);
  const nodesRef = React.useRef<Node[]>([]);
  const mouseRef = React.useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });
  const reduceMotionRef = React.useRef<boolean>(false);

  const initNodes = React.useCallback(
    (w: number, h: number) => {
      const area = (w * h) / 10000; // 10k px^2 buckets
      const targetCount = Math.max(24, Math.min(160, Math.floor(area * density)));
      const nodes: Node[] = [];
      const baseSpeed = 0.35 * speedMultiplier; // faster baseline
      for (let i = 0; i < targetCount; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * baseSpeed,
          vy: (Math.random() - 0.5) * baseSpeed,
        });
      }
      nodesRef.current = nodes;
    },
    [density, speedMultiplier],
  );

  const draw = React.useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      const nodes = nodesRef.current;
      // Clear
      ctx.clearRect(0, 0, w, h);

      // Update positions
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        // Gentle wrap-around
        if (n.x < -10) n.x = w + 10;
        if (n.x > w + 10) n.x = -10;
        if (n.y < -10) n.y = h + 10;
        if (n.y > h + 10) n.y = -10;
      }

      // Draw edges (nearby)
      const maxDist = Math.min(140, Math.max(80, Math.min(w, h) * 0.12));
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < maxDist) {
            const alpha = Math.min(0.55, (1 - d / maxDist) * 0.55); // subtler fade with distance
            // Teal-tinted edges for a softer background
            ctx.strokeStyle = `rgba(45,212,191,${alpha.toFixed(3)})`;
            ctx.lineWidth = lineWidth;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (const n of nodes) {
        ctx.beginPath();
        // Cyan-tinted soft dots
        ctx.fillStyle = 'rgba(56,189,248,0.85)';
        ctx.arc(n.x, n.y, nodeSize, 0, Math.PI * 2);
        ctx.fill();
      }
    },
    [nodeSize, lineWidth],
  );

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const { width, height } = parent.getBoundingClientRect();
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.resetTransform();
      ctx.scale(dpr, dpr);
      initNodes(width, height);
      // Draw an initial static frame so it looks good even when not animating
      draw(ctx, width, height);
    };

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    reduceMotionRef.current = mq.matches;
    const mqListener = (e: MediaQueryListEvent) => {
      reduceMotionRef.current = e.matches;
      if (e.matches) cancel();
      else if (moving) loop();
    };
    mq.addEventListener?.('change', mqListener);

    const loop = () => {
      if (reduceMotionRef.current || !moving) return;
      const parent = canvas.parentElement;
      if (!parent) return;
      const { width, height } = parent.getBoundingClientRect();
      draw(ctx, width, height);
      rafRef.current = requestAnimationFrame(loop);
    };
    const cancel = () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    resize();
    window.addEventListener('resize', resize);
    if (!reduceMotionRef.current && moving) loop();

    return () => {
      cancel();
      window.removeEventListener('resize', resize);
      mq.removeEventListener?.('change', mqListener);
    };
  }, [draw, initNodes, moving]);

  return <canvas ref={canvasRef} className={className} tabIndex={-1} />;
}

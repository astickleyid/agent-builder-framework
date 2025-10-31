'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Node {
  id: number;
  x: number;
  y: number;
  connections: number[];
}

export default function HolographicNodes() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const nodes: Node[] = [
      { id: 0, x: 100, y: 100, connections: [1, 2] },
      { id: 1, x: 300, y: 80, connections: [2, 3] },
      { id: 2, x: 200, y: 200, connections: [3] },
      { id: 3, x: 350, y: 220, connections: [4] },
      { id: 4, x: 250, y: 320, connections: [] },
    ];

    let animationFrame: number;
    let offset = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      offset += 0.5;

      // Draw connections
      nodes.forEach(node => {
        node.connections.forEach(targetId => {
          const target = nodes.find(n => n.id === targetId);
          if (!target) return;

          const gradient = ctx.createLinearGradient(node.x, node.y, target.x, target.y);
          gradient.addColorStop(0, 'rgba(14, 165, 233, 0.3)');
          gradient.addColorStop(0.5, 'rgba(6, 182, 212, 0.5)');
          gradient.addColorStop(1, 'rgba(14, 165, 233, 0.3)');

          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(target.x, target.y);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 2;
          ctx.stroke();

          // Animated flow
          const flowPos = ((offset % 100) / 100);
          const flowX = node.x + (target.x - node.x) * flowPos;
          const flowY = node.y + (target.y - node.y) * flowPos;

          ctx.beginPath();
          ctx.arc(flowX, flowY, 3, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(6, 182, 212, 0.8)';
          ctx.fill();
        });
      });

      // Draw nodes
      nodes.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(14, 165, 233, 0.8)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(6, 182, 212, 1)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Glow effect
        ctx.beginPath();
        ctx.arc(node.x, node.y, 15, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(14, 165, 233, 0.1)';
        ctx.fill();
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div className="w-full h-96 relative">
      <canvas
        ref={canvasRef}
        className="w-full h-full opacity-40"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}

'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface ShaderAnimationProps {
  className?: string;
  intensity?: number;
  speed?: number;
}

export default function ShaderAnimation({ 
  className = '', 
  intensity = 1,
  speed = 1 
}: ShaderAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;
    const stripes = 8;
    const stripeWidth = 60;
    const stripeSpacing = 20;

    const animate = () => {
      const width = canvas.width;
      const height = canvas.height;
      
      // Clear canvas
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, width, height);

      // Create diagonal stripes
      for (let i = 0; i < stripes; i++) {
        const x = i * (stripeWidth + stripeSpacing) - time * speed * 0.5;
        const y = 0;
        
        // Create gradient for each stripe
        const gradient = ctx.createLinearGradient(x, y, x + stripeWidth, y + height);
        
        // Color based on position and time
        const hue = (i * 30 + time * 0.1) % 360;
        const alpha = Math.sin(time * 0.01 + i * 0.5) * 0.3 + 0.4;
        
        if (i < 3) {
          // Warm colors (orange to yellow)
          gradient.addColorStop(0, `hsla(${hue + 20}, 80%, 60%, ${alpha})`);
          gradient.addColorStop(0.5, `hsla(${hue + 10}, 90%, 70%, ${alpha * 1.2})`);
          gradient.addColorStop(1, `hsla(${hue}, 100%, 80%, ${alpha})`);
        } else if (i < 6) {
          // Cool colors (white to blue)
          gradient.addColorStop(0, `hsla(${hue}, 20%, 90%, ${alpha})`);
          gradient.addColorStop(0.5, `hsla(${hue - 20}, 60%, 80%, ${alpha * 1.2})`);
          gradient.addColorStop(1, `hsla(${hue - 40}, 80%, 70%, ${alpha})`);
        } else {
          // Electric blue tones
          gradient.addColorStop(0, `hsla(${hue - 60}, 80%, 60%, ${alpha})`);
          gradient.addColorStop(0.5, `hsla(${hue - 80}, 90%, 70%, ${alpha * 1.2})`);
          gradient.addColorStop(1, `hsla(${hue - 100}, 100%, 80%, ${alpha})`);
        }

        ctx.fillStyle = gradient;
        
        // Create diagonal stripe
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + stripeWidth, y);
        ctx.lineTo(x + stripeWidth + height * 0.3, y + height);
        ctx.lineTo(x + height * 0.3, y + height);
        ctx.closePath();
        ctx.fill();
      }

      time += 1;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [speed]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Background diagonal stripes */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        {/* Static diagonal stripes */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute bg-gradient-to-r from-transparent via-gray-700/20 to-transparent"
            style={{
              width: '2px',
              height: '200%',
              left: `${i * 8}%`,
              top: '-50%',
              transform: 'rotate(45deg)',
              transformOrigin: 'center',
            }}
          />
        ))}
      </div>

      {/* Animated shader canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ mixBlendMode: 'screen' }}
        width={800}
        height={600}
      />

      {/* Overlay gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/20 to-black/40" />
    </div>
  );
}

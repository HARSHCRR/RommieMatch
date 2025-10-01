'use client';

import React, { useEffect, useRef } from 'react';

interface ShaderAnimationProps {
  className?: string;
  intensity?: number;
  speed?: number;
  colors?: string[];
}

export default function ShaderAnimation({
  className = '',
  intensity = 0.5,
  speed = 1,
  colors = ['#3B82F6', '#8B5CF6', '#EC4899', '#06B6D4']
}: ShaderAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = () => {
      timeRef.current += 0.01 * speed;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create gradient background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.max(canvas.width, canvas.height) / 2
      );
      
      // Dynamic color stops based on time
      colors.forEach((color, index) => {
        const offset = (index / (colors.length - 1)) + Math.sin(timeRef.current + index) * 0.1;
        gradient.addColorStop(Math.max(0, Math.min(1, offset)), color);
      });
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add floating particles
      for (let i = 0; i < 50; i++) {
        const x = (Math.sin(timeRef.current * 0.5 + i) * canvas.width * 0.3) + canvas.width / 2;
        const y = (Math.cos(timeRef.current * 0.3 + i * 0.5) * canvas.height * 0.3) + canvas.height / 2;
        const size = Math.sin(timeRef.current + i) * 3 + 3;
        const opacity = Math.sin(timeRef.current * 2 + i) * 0.3 + 0.3;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity * intensity})`;
        ctx.fill();
      }
      
      // Add wave patterns
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * intensity})`;
      ctx.lineWidth = 2;
      
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x += 10) {
          const y = canvas.height / 2 + 
            Math.sin((x / canvas.width) * Math.PI * 4 + timeRef.current + i * Math.PI / 3) * 50 +
            Math.sin(timeRef.current * 0.5 + i) * 30;
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [intensity, speed, colors]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 w-full h-full ${className}`}
      style={{ zIndex: -1 }}
    />
  );
}

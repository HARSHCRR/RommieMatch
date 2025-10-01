'use client';

import React, { useEffect, useRef } from 'react';

interface WebGLShaderAnimationProps {
  className?: string;
  intensity?: number;
  speed?: number;
  colors?: string[];
}

export default function WebGLShaderAnimation({
  className = '',
  intensity = 0.8,
  speed = 1,
  colors = ['#3B82F6', '#8B5CF6', '#EC4899', '#06B6D4']
}: WebGLShaderAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const animationRef = useRef<number>();
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      console.warn('WebGL not supported, falling back to canvas 2D');
      return;
    }

    glRef.current = gl;

    // Vertex shader source
    const vertexShaderSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Fragment shader source
    const fragmentShaderSource = `
      precision mediump float;
      uniform float u_time;
      uniform float u_intensity;
      uniform vec2 u_resolution;
      uniform vec4 u_color1;
      uniform vec4 u_color2;
      uniform vec4 u_color3;
      uniform vec4 u_color4;
      
      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        vec2 center = vec2(0.5, 0.5);
        
        // Create radial gradient
        float dist = distance(uv, center);
        
        // Add wave distortion
        float wave1 = sin(uv.x * 10.0 + u_time * 2.0) * 0.02;
        float wave2 = sin(uv.y * 8.0 + u_time * 1.5) * 0.02;
        float wave3 = sin((uv.x + uv.y) * 6.0 + u_time * 3.0) * 0.01;
        
        dist += wave1 + wave2 + wave3;
        
        // Create color mixing based on distance and time
        float colorMix1 = sin(dist * 8.0 + u_time * 1.0) * 0.5 + 0.5;
        float colorMix2 = sin(dist * 6.0 + u_time * 1.5) * 0.5 + 0.5;
        float colorMix3 = sin(dist * 4.0 + u_time * 2.0) * 0.5 + 0.5;
        
        // Mix colors
        vec4 color = mix(
          mix(u_color1, u_color2, colorMix1),
          mix(u_color3, u_color4, colorMix2),
          colorMix3
        );
        
        // Add pulsing effect
        float pulse = sin(u_time * 3.0) * 0.1 + 0.9;
        color.rgb *= pulse * u_intensity;
        
        // Add noise for texture
        float noise = sin(uv.x * 100.0 + u_time * 5.0) * sin(uv.y * 100.0 + u_time * 5.0) * 0.02;
        color.rgb += noise;
        
        gl_FragColor = color;
      }
    `;

    // Helper function to create shader
    const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      
      return shader;
    };

    // Helper function to create program
    const createProgram = (gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) => {
      const program = gl.createProgram();
      if (!program) return null;
      
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program linking error:', gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
      }
      
      return program;
    };

    // Create shaders and program
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    if (!vertexShader || !fragmentShader) return;
    
    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) return;
    
    programRef.current = program;

    // Create a full-screen quad
    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
       1,  1,
    ]);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    // Get attribute and uniform locations
    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    const timeUniformLocation = gl.getUniformLocation(program, 'u_time');
    const intensityUniformLocation = gl.getUniformLocation(program, 'u_intensity');
    const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');
    const color1UniformLocation = gl.getUniformLocation(program, 'u_color1');
    const color2UniformLocation = gl.getUniformLocation(program, 'u_color2');
    const color3UniformLocation = gl.getUniformLocation(program, 'u_color3');
    const color4UniformLocation = gl.getUniformLocation(program, 'u_color4');

    // Helper function to convert hex to RGB
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255
      } : { r: 0, g: 0, b: 0 };
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = () => {
      timeRef.current += 0.016 * speed;
      
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      
      // Set up attributes
      gl.enableVertexAttribArray(positionAttributeLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
      
      // Set uniforms
      gl.uniform1f(timeUniformLocation, timeRef.current);
      gl.uniform1f(intensityUniformLocation, intensity);
      gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);
      
      // Set colors
      const color1 = hexToRgb(colors[0]);
      const color2 = hexToRgb(colors[1]);
      const color3 = hexToRgb(colors[2]);
      const color4 = hexToRgb(colors[3]);
      
      gl.uniform4f(color1UniformLocation, color1.r, color1.g, color1.b, 1.0);
      gl.uniform4f(color2UniformLocation, color2.r, color2.g, color2.b, 1.0);
      gl.uniform4f(color3UniformLocation, color3.r, color3.g, color3.b, 1.0);
      gl.uniform4f(color4UniformLocation, color4.r, color4.g, color4.b, 1.0);
      
      // Draw
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (programRef.current) {
        gl.deleteProgram(programRef.current);
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

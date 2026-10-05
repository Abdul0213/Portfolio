'use client';

import React, { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../lib/motion';

interface HeroShaderProps {
  /** Seconds added to the animation clock so several instances don't look identical */
  timeOffset?: number;
  /** Upper bound on render resolution; lower is cheaper (the liquid is soft anyway) */
  maxDpr?: number;
  className?: string;
}

/** Animated liquid violet background (WebGL), with a CSS fallback */
export const HeroShader: React.FC<HeroShaderProps> = ({ timeOffset = 0, maxDpr = 1.5, className = 'opacity-80' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setWebglFailed(true);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    let gl: WebGLRenderingContext | null = null;
    try {
      gl = canvas.getContext('webgl', {
        powerPreference: 'low-power',
        alpha: false,
        antialias: false,
        depth: false,
      });
    } catch {
      setWebglFailed(true);
      return;
    }

    if (!gl) {
      setWebglFailed(true);
      return;
    }

    // Vertex Shader
    const vsSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Fragment Shader with fbm / liquid flow
    const fsSource = `
      precision mediump float;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform float u_time;

      // Simplex 2D noise
      vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
      float snoise(vec2 v){
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                 -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod(i, 289.0);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      // Fractional Brownian Motion
      float fbm(vec2 st) {
        float value = 0.0;
        float amplitude = 0.5;
        for (int i = 0; i < 3; i++) {
          value += amplitude * snoise(st);
          st *= 2.05;
          amplitude *= 0.5;
        }
        return value;
      }

      void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        st.x *= u_resolution.x / u_resolution.y;

        // Subtle mouse displacement
        vec2 mouseOffset = (u_mouse - vec2(0.5)) * 0.18;
        vec2 q = vec2(0.0);
        q.x = fbm(st + 0.04 * u_time + mouseOffset);
        q.y = fbm(st + vec2(1.0) + 0.03 * u_time - mouseOffset);

        vec2 r = vec2(0.0);
        r.x = fbm(st + 1.0 * q + vec2(1.7, 9.2) + 0.05 * u_time);
        r.y = fbm(st + 1.0 * q + vec2(8.3, 2.8) + 0.04 * u_time);

        float f = fbm(st + r);

        // Colors: #0E0E0E (0.055, 0.055, 0.055), #5530A7 (0.333, 0.188, 0.655), #7B5CFF (0.482, 0.361, 1.0)
        vec3 colorBg = vec3(0.055, 0.055, 0.055);
        vec3 colorDeepViolet = vec3(0.333, 0.188, 0.655);
        vec3 colorElectricViolet = vec3(0.482, 0.361, 1.0);

        vec3 color = mix(colorBg, colorDeepViolet, clamp((f * f) * 2.8, 0.0, 1.0));
        color = mix(color, colorElectricViolet, clamp(length(q) * 0.55, 0.0, 1.0));

        // Dark vignette on edges
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        float vignette = uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y);
        vignette = clamp(pow(16.0 * vignette, 0.25), 0.0, 1.0);
        color *= (0.4 + 0.6 * vignette);

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    function createShader(glCtx: WebGLRenderingContext, type: number, source: string) {
      const shader = glCtx.createShader(type);
      if (!shader) return null;
      glCtx.shaderSource(shader, source);
      glCtx.compileShader(shader);
      if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
        glCtx.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) {
      setWebglFailed(true);
      return;
    }

    const program = gl.createProgram();
    if (!program) {
      setWebglFailed(true);
      return;
    }
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      setWebglFailed(true);
      return;
    }

    gl.useProgram(program);

    // Quad buffer
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const mouseLocation = gl.getUniformLocation(program, 'u_mouse');
    const timeLocation = gl.getUniformLocation(program, 'u_time');

    let mouseX = 0.5;
    let mouseY = 0.5;
    let targetMouseX = 0.5;
    let targetMouseY = 0.5;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX / window.innerWidth;
      targetMouseY = 1.0 - e.clientY / window.innerHeight;
    };
    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId: number;
    let startTime = performance.now();
    let isPaused = false;

    // Resize handler (DPR capped by maxDpr)
    const resize = () => {
      if (!canvas || !gl) return;
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      const width = Math.floor(canvas.clientWidth * dpr);
      const height = Math.floor(canvas.clientHeight * dpr);

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };

    resize();
    window.addEventListener('resize', resize);
    // Element-level resizes too (e.g. cards changing height)
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    // IntersectionObserver to pause when off-screen
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isPaused = !entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    // VisibilityChange to pause on tab switch
    const handleVisibility = () => {
      if (document.hidden) {
        isPaused = true;
      } else {
        isPaused = false;
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const render = (now: number) => {
      if (!isPaused && gl) {
        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;

        const time = (now - startTime) * 0.001 + timeOffset;

        gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
        gl.uniform2f(mouseLocation, mouseX, mouseY);
        gl.uniform1f(timeLocation, time);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resize);
      resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
      if (gl) {
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
      }
    };
  }, [timeOffset, maxDpr]);

  if (webglFailed) {
    // Beautiful CSS fallback with blurred liquid gradients
    return (
      <div
        aria-hidden="true"
        className={`absolute inset-0 overflow-hidden pointer-events-none z-0 bg-[#0E0E0E] ${className}`}
      >
        <div className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-[#5530A7]/25 blur-[7.5rem] animate-pulse" />
        <div className="absolute top-[30%] -right-[15%] w-[50vw] h-[50vw] rounded-full bg-[#7B5CFF]/20 blur-[8.75rem] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-[20%] left-[20%] w-[45vw] h-[45vw] rounded-full bg-[#5530A7]/20 blur-[8.125rem]" />
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 w-full h-full pointer-events-none z-0 ${className}`}
    />
  );
};

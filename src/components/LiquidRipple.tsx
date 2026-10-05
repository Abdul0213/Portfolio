'use client';

import React, { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../lib/motion';

/**
 * Full-page liquid ripple that follows the cursor.
 * A wave-equation heightfield runs on the GPU at reduced resolution (ping-pong
 * float textures); the render pass shades the waves as clear water (white
 * highlights, soft shadows, no tint) over the page, so it never blocks clicks or text.
 */

const SIM_SCALE = 1 / 6; // simulation texels per CSS pixel
const RENDER_SCALE = 0.5; // canvas pixels per CSS pixel
const STEPS_PER_FRAME = 2;
const IDLE_STEPS_PER_FRAME = 1; // resting cursor: rings spread at half speed
const IDLE_FRAMES = 180; // stop simulating once the waves have died out
const PULSE_INTERVAL = 140; // frames (~2.3s) between rings emitted around a resting cursor
const PULSE_STRENGTH = 1.8;
const PULSE_RADIUS = 0.032;

const VS = `#version 300 es
in vec2 a_pos;
out vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

// r = current height, g = previous height
const SIM_FS = `#version 300 es
precision highp float;
uniform sampler2D u_state;
uniform vec2 u_texel;
uniform vec2 u_from;
uniform vec2 u_to;
uniform float u_aspect;
uniform float u_radius;
uniform float u_strength;
in vec2 v_uv;
out vec4 o;

float segDist(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0.0, 1.0);
  return length(pa - ba * h);
}

void main() {
  vec4 c = texture(u_state, v_uv);
  float l = texture(u_state, v_uv - vec2(u_texel.x, 0.0)).r;
  float r = texture(u_state, v_uv + vec2(u_texel.x, 0.0)).r;
  float b = texture(u_state, v_uv - vec2(0.0, u_texel.y)).r;
  float t = texture(u_state, v_uv + vec2(0.0, u_texel.y)).r;

  float h = (l + r + b + t) * 0.5 - c.g;
  h *= 0.982;

  // Absorb waves near the viewport edges so they never bounce back across the page
  vec2 edge = min(v_uv, 1.0 - v_uv);
  h *= mix(0.9, 1.0, smoothstep(0.0, 0.06, min(edge.x, edge.y)));

  // Push the surface along the path the cursor travelled this frame
  vec2 asp = vec2(u_aspect, 1.0);
  float d = segDist(v_uv * asp, u_from * asp, u_to * asp);
  h += u_strength * (1.0 - smoothstep(0.0, u_radius, d));

  o = vec4(h, c.r, 0.0, 1.0);
}`;

const RENDER_FS = `#version 300 es
precision highp float;
uniform sampler2D u_state;
uniform vec2 u_texel;
in vec2 v_uv;
out vec4 o;

void main() {
  float hx = texture(u_state, v_uv + vec2(u_texel.x, 0.0)).r - texture(u_state, v_uv - vec2(u_texel.x, 0.0)).r;
  float hy = texture(u_state, v_uv + vec2(0.0, u_texel.y)).r - texture(u_state, v_uv - vec2(0.0, u_texel.y)).r;

  // Clear-water shading: no tint, only light and shadow from the surface slope.
  // Slopes facing the light catch a soft white sheen, slopes facing away fall
  // into shadow, and a tight specular glint sits on the crests.
  vec3 n = normalize(vec3(-hx * 2.2, -hy * 2.2, 1.0));
  vec3 L = normalize(vec3(-0.4, 0.55, 0.73));
  float lit = dot(n, L) - L.z;
  float spec = pow(max(dot(reflect(-L, n), vec3(0.0, 0.0, 1.0)), 0.0), 60.0);

  float highlight = clamp(lit * 1.6, 0.0, 1.0) * 0.16 + spec * 0.22;
  float shadow = clamp(-lit * 1.6, 0.0, 1.0) * 0.16;

  // Draw nothing on near-flat water, so faint residual ripples never smear the page
  float presence = smoothstep(0.015, 0.08, length(vec2(hx, hy)));

  // Premultiplied: white highlight over a black shadow
  float a = clamp(highlight + shadow, 0.0, 0.3) * presence;
  highlight *= presence;
  o = vec4(vec3(min(highlight, a)), a);
}`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.warn('LiquidRipple shader error:', gl.getShaderInfoLog(s));
    return null;
  }
  return s;
}

function program(gl: WebGL2RenderingContext, fs: string) {
  const v = compile(gl, gl.VERTEX_SHADER, VS);
  const f = compile(gl, gl.FRAGMENT_SHADER, fs);
  if (!v || !f) return null;
  const p = gl.createProgram()!;
  gl.attachShader(p, v);
  gl.attachShader(p, f);
  gl.bindAttribLocation(p, 0, 'a_pos');
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) return null;
  return p;
}

export const LiquidRipple: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!isFinePointer || prefersReducedMotion()) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      powerPreference: 'low-power',
    });
    if (!gl || !gl.getExtension('EXT_color_buffer_float')) {
      canvas.style.display = 'none';
      return;
    }

    const simProg = program(gl, SIM_FS);
    const renderProg = program(gl, RENDER_FS);
    if (!simProg || !renderProg) {
      canvas.style.display = 'none';
      return;
    }

    const u = (p: WebGLProgram, name: string) => gl.getUniformLocation(p, name);
    const simU = {
      state: u(simProg, 'u_state'),
      texel: u(simProg, 'u_texel'),
      from: u(simProg, 'u_from'),
      to: u(simProg, 'u_to'),
      aspect: u(simProg, 'u_aspect'),
      radius: u(simProg, 'u_radius'),
      strength: u(simProg, 'u_strength'),
    };
    const renderU = { state: u(renderProg, 'u_state'), texel: u(renderProg, 'u_texel') };

    // Fullscreen triangle pair
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    let simW = 0;
    let simH = 0;
    let targets: { tex: WebGLTexture; fbo: WebGLFramebuffer }[] = [];
    let read = 0;

    const createTargets = () => {
      targets.forEach((t) => {
        gl.deleteTexture(t.tex);
        gl.deleteFramebuffer(t.fbo);
      });
      targets = [0, 1].map(() => {
        const tex = gl.createTexture()!;
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, simW, simH, 0, gl.RGBA, gl.HALF_FLOAT, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        const fbo = gl.createFramebuffer()!;
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        return { tex, fbo };
      });
      read = 0;
    };

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.max(1, Math.round(w * RENDER_SCALE));
      canvas.height = Math.max(1, Math.round(h * RENDER_SCALE));
      simW = Math.max(1, Math.round(w * SIM_SCALE));
      simH = Math.max(1, Math.round(h * SIM_SCALE));
      createTargets();
    };
    resize();

    // Pointer state in UV space (origin bottom-left)
    const mouse = { x: 0.5, y: 0.5, px: 0.5, py: 0.5, hasMoved: false, inside: false };
    let pulseTimer = PULSE_INTERVAL;
    let idle = IDLE_FRAMES;

    const onMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = 1 - e.clientY / window.innerHeight;
      if (!mouse.hasMoved) {
        mouse.px = x;
        mouse.py = y;
        mouse.hasMoved = true;
      }
      mouse.x = x;
      mouse.y = y;
      mouse.inside = true;
      idle = 0;
    };

    const onLeave = () => {
      mouse.inside = false;
    };

    let raf = 0;
    let cleared = false;

    const frame = () => {
      raf = requestAnimationFrame(frame);

      // Keep the sim alive while the cursor rests on the page so it can emit rings
      if (mouse.inside) idle = 0;

      if (idle >= IDLE_FRAMES) {
        if (!cleared) {
          gl.bindFramebuffer(gl.FRAMEBUFFER, null);
          gl.viewport(0, 0, canvas.width, canvas.height);
          gl.clearColor(0, 0, 0, 0);
          gl.clear(gl.COLOR_BUFFER_BIT);
          cleared = true;
        }
        return;
      }
      idle++;
      cleared = false;

      const aspect = window.innerWidth / window.innerHeight;
      const dx = (mouse.x - mouse.px) * aspect;
      const dy = mouse.y - mouse.py;
      const speed = Math.hypot(dx, dy);
      const strength = Math.min(speed * 7, 0.5);

      // While the cursor is (nearly) still, drop a small pulse under it every
      // PULSE_INTERVAL frames so rings keep spreading out around the dot
      pulseTimer++;
      const pulse = mouse.inside && speed < 0.004 && pulseTimer >= PULSE_INTERVAL;
      if (pulse || speed >= 0.004) pulseTimer = pulse ? 0 : Math.min(pulseTimer, PULSE_INTERVAL - 30);

      // Simulation steps
      gl.useProgram(simProg);
      gl.viewport(0, 0, simW, simH);
      gl.uniform2f(simU.texel, 1 / simW, 1 / simH);
      gl.uniform1f(simU.aspect, aspect);
      gl.uniform1i(simU.state, 0);
      gl.activeTexture(gl.TEXTURE0);

      // Fewer sim steps per frame while resting = slower, calmer rings; full speed when moving
      const steps = speed < 0.004 ? IDLE_STEPS_PER_FRAME : STEPS_PER_FRAME;
      for (let i = 0; i < steps; i++) {
        // Split the cursor path across the steps so fast moves leave a continuous trail
        const t0 = i / steps;
        const t1 = (i + 1) / steps;
        gl.uniform2f(simU.from, mouse.px + (mouse.x - mouse.px) * t0, mouse.py + (mouse.y - mouse.py) * t0);
        gl.uniform2f(simU.to, mouse.px + (mouse.x - mouse.px) * t1, mouse.py + (mouse.y - mouse.py) * t1);
        const pulseStep = pulse && i === 0;
        gl.uniform1f(simU.radius, pulseStep ? PULSE_RADIUS : 0.06);
        gl.uniform1f(simU.strength, pulseStep ? PULSE_STRENGTH : strength / steps);

        const write = 1 - read;
        gl.bindFramebuffer(gl.FRAMEBUFFER, targets[write].fbo);
        gl.bindTexture(gl.TEXTURE_2D, targets[read].tex);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        read = write;
      }
      mouse.px = mouse.x;
      mouse.py = mouse.y;

      // Shade to screen
      gl.useProgram(renderProg);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(renderU.texel, 1 / simW, 1 / simH);
      gl.uniform1i(renderU.state, 0);
      gl.bindTexture(gl.TEXTURE_2D, targets[read].tex);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('resize', resize);
    document.documentElement.addEventListener('mouseleave', onLeave);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', resize);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      targets.forEach((t) => {
        gl.deleteTexture(t.tex);
        gl.deleteFramebuffer(t.fbo);
      });
      gl.deleteBuffer(buf);
      gl.deleteVertexArray(vao);
      gl.deleteProgram(simProg);
      gl.deleteProgram(renderProg);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 w-screen h-screen pointer-events-none z-[9980]"
    />
  );
};

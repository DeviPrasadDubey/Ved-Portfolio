"use client";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

interface Thread {
  x: number; y: number; vx: number; vy: number;
  len: number; angle: number; angleSpeed: number;
  alpha: number; color: string;
}
interface Dust {
  x: number; y: number; vx: number; vy: number;
  size: number; alpha: number; color: string;
  life: number; maxLife: number;
}

export function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const reduce = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (reduce || isMobile) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let raf: number;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => { mouse.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", onMove, { passive: true });

    const palette = ["rgba(212,175,55,", "rgba(212,175,55,", "rgba(245,220,100,"];

    const threads: Thread[] = Array.from({ length: 38 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.26,
      vy: (Math.random() - 0.5) * 0.17,
      len: 28 + Math.random() * 58,
      angle: Math.random() * Math.PI * 2,
      angleSpeed: (Math.random() - 0.5) * 0.005,
      alpha: 0.03 + Math.random() * 0.065,
      color: palette[Math.floor(Math.random() * palette.length)],
    }));

    const dust: Dust[] = [];
    const lastPos = { x: -9999, y: -9999 };
    let frame = 0;

    function spawnDust(x: number, y: number) {
      for (let i = 0; i < 3; i++) {
        const a = Math.random() * Math.PI * 2;
        const s = 0.4 + Math.random() * 1.4;
        dust.push({
          x: x + (Math.random() - 0.5) * 6,
          y: y + (Math.random() - 0.5) * 6,
          vx: Math.cos(a) * s,
          vy: Math.sin(a) * s - 0.5,
          size: 1 + Math.random() * 2.2,
          alpha: 0.55 + Math.random() * 0.35,
          color: Math.random() > 0.25 ? "rgba(212,175,55," : "rgba(255,230,100,",
          life: 0,
          maxLife: 38 + Math.random() * 44,
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      const { x: mx, y: my } = mouse.current;
      if (Math.hypot(mx - lastPos.x, my - lastPos.y) > 4 && mx > 0 && frame % 2 === 0) {
        spawnDust(mx, my);
        lastPos.x = mx; lastPos.y = my;
      }

      for (const t of threads) {
        t.x += t.vx; t.y += t.vy; t.angle += t.angleSpeed;
        if (t.x < -120) t.x = canvas.width + 60;
        if (t.x > canvas.width + 120) t.x = -60;
        if (t.y < -120) t.y = canvas.height + 60;
        if (t.y > canvas.height + 120) t.y = -60;
        const ex = t.x + Math.cos(t.angle) * t.len;
        const ey = t.y + Math.sin(t.angle) * t.len;
        const cx = t.x + Math.cos(t.angle + 0.5) * t.len * 0.55;
        const cy = t.y + Math.sin(t.angle + 0.5) * t.len * 0.35;
        ctx.beginPath();
        ctx.moveTo(t.x, t.y);
        ctx.quadraticCurveTo(cx, cy, ex, ey);
        ctx.strokeStyle = t.color + t.alpha + ")";
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }

      for (let i = dust.length - 1; i >= 0; i--) {
        const p = dust[i];
        p.x += p.vx; p.y += p.vy;
        p.vy += 0.035; p.vx *= 0.985; p.life++;
        const prog = p.life / p.maxLife;
        const a = p.alpha * (1 - prog * prog);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 - prog * 0.4), 0, Math.PI * 2);
        ctx.fillStyle = p.color + a + ")";
        ctx.fill();
        if (p.life >= p.maxLife) dust.splice(i, 1);
      }

      raf = requestAnimationFrame(draw);
    }

    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, [reduce, isMobile]);

  if (reduce || isMobile) return null;
  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0" aria-hidden />;
}

import { useEffect, useRef } from "react";

interface TrailPoint {
  x: number;
  y: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
}

export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointsRef = useRef<TrailPoint[]>([]);
  const rafRef = useRef<number | null>(null);
  const enabledRef = useRef<boolean>(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Disable on touch-only devices and reduced motion
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isCoarse || reducedMotion) {
      enabledRef.current = false;
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };
    resize();
    window.addEventListener("resize", resize);

    let lastSpawn = 0;
    const handleMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastSpawn < 16) return;
      lastSpawn = now;
      const x = e.clientX * dpr;
      const y = e.clientY * dpr;
      // Spawn 2 points per move event for a richer trail
      for (let i = 0; i < 2; i++) {
        pointsRef.current.push({
          x: x + (Math.random() - 0.5) * 6 * dpr,
          y: y + (Math.random() - 0.5) * 6 * dpr,
          life: 0,
          maxLife: 30 + Math.random() * 20,
          size: (3 + Math.random() * 3) * dpr,
          hue: 263 + Math.random() * 30 - 5,
        });
      }
      if (pointsRef.current.length > 250) {
        pointsRef.current.splice(0, pointsRef.current.length - 250);
      }
    };
    window.addEventListener("pointermove", handleMove);

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const pts = pointsRef.current;
      for (let i = pts.length - 1; i >= 0; i--) {
        const p = pts[i];
        p.life++;
        const t = p.life / p.maxLife;
        const alpha = (1 - t) * 0.55;
        const r = p.size * (1 + t * 1.4);
        ctx.beginPath();
        ctx.fillStyle = `hsla(${p.hue}, 85%, 65%, ${alpha})`;
        ctx.shadowColor = `hsla(${p.hue}, 90%, 60%, ${alpha})`;
        ctx.shadowBlur = 14 * dpr;
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
        if (p.life >= p.maxLife) pts.splice(i, 1);
      }
      ctx.shadowBlur = 0;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handleMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60] mix-blend-screen"
    />
  );
}

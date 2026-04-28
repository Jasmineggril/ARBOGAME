import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import logo from "@assets/arbogame_logo_transparent.png";

const STORAGE_KEY = "arbogame:intro:seen:v3";
const TOTAL_DURATION = 4200;

// ---------- Particle convergence canvas ----------
interface CParticle {
  ox: number;
  oy: number;
  x: number;
  y: number;
  tx: number;
  ty: number;
  vx: number;
  vy: number;
  size: number;
  hue: number;
  alpha: number;
  delay: number;
}

function ConvergenceCanvas({ phase }: { phase: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const particlesRef = useRef<CParticle[]>([]);
  const startRef = useRef<number>(0);
  const phaseRef = useRef<number>(phase);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      buildTargets();
    };

    const buildTargets = () => {
      const cx = (W * dpr) / 2;
      const cy = (H * dpr) / 2;
      const ringR = Math.min(W, H) * 0.16 * dpr;
      const reduced =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const N = reduced ? 90 : 240;

      const next: CParticle[] = [];
      for (let i = 0; i < N; i++) {
        // Origin: random scatter across the screen far from center
        const a0 = Math.random() * Math.PI * 2;
        const r0 = (0.55 + Math.random() * 0.6) * Math.max(W, H) * dpr;
        const ox = cx + Math.cos(a0) * r0;
        const oy = cy + Math.sin(a0) * r0;

        // Target: a soft ring around the logo
        const at = Math.random() * Math.PI * 2;
        const rt = ringR * (0.85 + Math.random() * 0.5);
        const tx = cx + Math.cos(at) * rt;
        const ty = cy + Math.sin(at) * rt;

        next.push({
          ox,
          oy,
          x: ox,
          y: oy,
          tx,
          ty,
          vx: 0,
          vy: 0,
          size: (Math.random() * 1.4 + 0.5) * dpr,
          hue: 268 + (Math.random() * 36 - 18),
          alpha: 0,
          delay: Math.random() * 0.45,
        });
      }
      particlesRef.current = next;
    };

    resize();
    window.addEventListener("resize", resize);
    startRef.current = performance.now();

    const tick = (now: number) => {
      const t = (now - startRef.current) / TOTAL_DURATION; // 0..1+
      const exiting = phaseRef.current >= 3;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Subtle radial vignette + violet bloom in the center
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(canvas.width, canvas.height) * 0.7);
      const bloomA = 0.05 + Math.min(0.18, t * 0.4);
      grad.addColorStop(0, `rgba(124, 58, 237, ${bloomA})`);
      grad.addColorStop(0.5, "rgba(91, 33, 182, 0.06)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Convergence eased with delay
        const local = Math.max(0, Math.min(1, (t - p.delay) / 0.85));
        const ease = 1 - Math.pow(1 - local, 4);

        // Subtle orbit jitter once near target
        const orbit = Math.sin(now * 0.0009 + i) * 0.6 * dpr * Math.min(1, ease * 2);

        const baseX = p.ox + (p.tx - p.ox) * ease;
        const baseY = p.oy + (p.ty - p.oy) * ease;
        p.x = baseX + orbit;
        p.y = baseY + Math.cos(now * 0.0011 + i) * 0.6 * dpr * Math.min(1, ease * 2);

        // Alpha fades in then dims as logo solidifies
        const settle = Math.max(0, Math.min(1, (t - 0.55) / 0.45));
        const baseAlpha = 0.0 + ease * 0.95;
        p.alpha = baseAlpha * (1 - settle * 0.55);

        if (exiting) {
          // Burst outward on exit
          const dx = p.x - cx;
          const dy = p.y - cy;
          const m = Math.sqrt(dx * dx + dy * dy) || 1;
          p.x += (dx / m) * 6 * dpr;
          p.y += (dy / m) * 6 * dpr;
          p.alpha *= 0.94;
        }

        ctx.beginPath();
        ctx.fillStyle = `hsla(${p.hue}, 90%, 70%, ${p.alpha})`;
        ctx.shadowColor = `hsla(${p.hue}, 95%, 60%, ${p.alpha * 0.9})`;
        ctx.shadowBlur = 14 * dpr;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}

// ---------- Aurora ribbons (CSS-driven SVG) ----------
function Aurora() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute -top-40 left-1/2 h-[640px] w-[1200px] -translate-x-1/2 opacity-60 blur-3xl"
        style={{
          background:
            "conic-gradient(from 200deg at 50% 50%, rgba(124,58,237,0.55), rgba(20,184,166,0.18), rgba(236,72,153,0.35), rgba(124,58,237,0.55))",
          animation: "auroraSpin 16s linear infinite",
          mixBlendMode: "screen",
        }}
      />
      <div
        className="absolute bottom-[-180px] right-[-120px] h-[520px] w-[820px] opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(56,189,248,0.45), rgba(56,189,248,0) 60%)",
          animation: "auroraDrift 14s ease-in-out infinite alternate",
        }}
      />
      <div
        className="absolute -left-40 bottom-10 h-[460px] w-[700px] opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(167,139,250,0.55), rgba(167,139,250,0) 60%)",
          animation: "auroraDrift 18s ease-in-out infinite alternate-reverse",
        }}
      />
    </div>
  );
}

// ---------- Scanning corner brackets ----------
function CornerBracket({
  position,
  delay,
}: {
  position: "tl" | "tr" | "bl" | "br";
  delay: number;
}) {
  const positions: Record<typeof position, string> = {
    tl: "left-6 top-6",
    tr: "right-6 top-6 rotate-90",
    bl: "left-6 bottom-6 -rotate-90",
    br: "right-6 bottom-6 rotate-180",
  };
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`pointer-events-none absolute h-10 w-10 ${positions[position]}`}
    >
      <svg viewBox="0 0 40 40" className="h-full w-full">
        <path
          d="M2 14 V2 H14"
          stroke="rgba(167,139,250,0.7)"
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="2" cy="2" r="1.4" fill="rgba(167,139,250,0.9)" />
      </svg>
    </motion.div>
  );
}

// ---------- Logo holder with rings, halo, magnetic tilt ----------
function LogoCore({ phase, exiting }: { phase: number; exiting: boolean }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 90, damping: 14, mass: 0.5 });
  const smy = useSpring(my, { stiffness: 90, damping: 14, mass: 0.5 });
  const rotateY = useTransform(smx, [-1, 1], [-14, 14]);
  const rotateX = useTransform(smy, [-1, 1], [10, -10]);
  const tx = useTransform(smx, [-1, 1], [-10, 10]);
  const ty = useTransform(smy, [-1, 1], [-8, 8]);

  useEffect(() => {
    const handle = (e: PointerEvent) => {
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) / (window.innerWidth * 0.5);
      const dy = (e.clientY - cy) / (window.innerHeight * 0.5);
      mx.set(Math.max(-1, Math.min(1, dx)));
      my.set(Math.max(-1, Math.min(1, dy)));
    };
    window.addEventListener("pointermove", handle);
    return () => window.removeEventListener("pointermove", handle);
  }, [mx, my]);

  const visible = phase >= 1;
  const solid = phase >= 2;

  return (
    <motion.div
      ref={wrapRef}
      className="relative"
      style={{ perspective: 900 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        style={{ rotateX, rotateY, x: tx, y: ty, transformStyle: "preserve-3d" }}
        className="relative"
      >
        {/* Concentric pulse rings */}
        <AnimatePresence>
          {visible &&
            !exiting &&
            [0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border"
                style={{
                  borderColor: "rgba(167,139,250,0.5)",
                  boxShadow: "0 0 30px rgba(124,58,237,0.25) inset",
                }}
                initial={{ width: 180, height: 180, opacity: 0 }}
                animate={{
                  width: [180, 460],
                  height: [180, 460],
                  opacity: [0.6, 0],
                }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  delay: i * 0.8,
                  ease: "easeOut",
                }}
              />
            ))}
        </AnimatePresence>

        {/* Outer halo */}
        <motion.div
          className="pointer-events-none absolute inset-0 -z-10 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(124,58,237,0.55), rgba(124,58,237,0) 60%)",
            filter: "blur(28px)",
          }}
          animate={{
            scale: solid ? [1, 1.08, 1] : [0.6, 0.9, 0.7],
            opacity: solid ? [0.6, 0.9, 0.6] : [0, 0.3, 0.1],
          }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Soft inner glass plate */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{
            opacity: visible ? 1 : 0,
            scale: visible ? 1 : 0.7,
          }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="relative grid h-56 w-56 place-items-center sm:h-64 sm:w-64"
        >
          {/* Inner soft disk */}
          <div
            className="absolute inset-2 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.10), rgba(255,255,255,0.02) 60%, rgba(255,255,255,0) 80%)",
              boxShadow:
                "inset 0 0 60px rgba(124,58,237,0.4), 0 0 80px rgba(124,58,237,0.25)",
            }}
          />

          {/* Logo image */}
          <motion.img
            src={logo}
            alt="Arbogame"
            draggable={false}
            initial={{ opacity: 0, filter: "blur(24px) saturate(0.5)" }}
            animate={
              exiting
                ? { opacity: 0, filter: "blur(8px) saturate(2)", scale: 1.15 }
                : solid
                  ? { opacity: 1, filter: "blur(0px) saturate(1.05)", scale: 1 }
                  : { opacity: 0.55, filter: "blur(8px) saturate(0.8)", scale: 0.96 }
            }
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-44 w-44 select-none object-contain drop-shadow-[0_0_40px_rgba(167,139,250,0.7)] sm:h-52 sm:w-52"
            style={{
              maskImage:
                "radial-gradient(circle at center, black 70%, rgba(0,0,0,0.85) 90%)",
            }}
          />

          {/* Sweep highlight across logo */}
          {solid && !exiting && (
            <div
              className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
              aria-hidden
            >
              <div
                className="absolute inset-y-0 -left-1/2 w-1/3"
                style={{
                  background:
                    "linear-gradient(110deg, transparent, rgba(255,255,255,0.18), transparent)",
                  animation: "sweepShine 3.8s ease-in-out infinite",
                }}
              />
            </div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ---------- Title with letter mask reveal ----------
function TitleReveal({ phase, exiting }: { phase: number; exiting: boolean }) {
  const letters = useMemo(() => "ARBOGAME".split(""), []);
  const visible = phase >= 2;

  return (
    <motion.div
      className="mt-10 flex flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.p
        initial={{ opacity: 0, y: 6 }}
        animate={visible && !exiting ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
        transition={{ duration: 0.6, delay: 0.05 }}
        className="text-[10px] font-semibold uppercase tracking-[0.45em] text-violet-200/80"
      >
        UnDF · PIBEX · PIC
      </motion.p>

      <div
        className="relative mt-3 flex overflow-hidden"
        style={{ lineHeight: 1 }}
      >
        {letters.map((ch, i) => (
          <motion.span
            key={i}
            initial={{ y: "110%", opacity: 0, filter: "blur(8px)" }}
            animate={
              visible && !exiting
                ? { y: 0, opacity: 1, filter: "blur(0px)" }
                : exiting
                  ? { y: "-110%", opacity: 0, filter: "blur(6px)" }
                  : { y: "110%", opacity: 0, filter: "blur(8px)" }
            }
            transition={{
              duration: 0.85,
              delay: visible ? 0.18 + i * 0.06 : 0,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="font-display text-[3.25rem] font-bold tracking-tight text-white sm:text-[4.25rem]"
            style={{
              textShadow: "0 0 30px rgba(167,139,250,0.45)",
              fontFamily:
                "var(--app-font-sans), 'Inter', system-ui, sans-serif",
            }}
          >
            {ch}
          </motion.span>
        ))}
      </div>

      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={
          visible && !exiting
            ? { scaleX: 1, opacity: 1 }
            : { scaleX: 0, opacity: 0 }
        }
        transition={{ duration: 0.9, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="mt-4 h-px w-40 origin-center bg-gradient-to-r from-transparent via-violet-300/60 to-transparent"
      />

      <motion.p
        initial={{ opacity: 0, y: 6 }}
        animate={
          visible && !exiting ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }
        }
        transition={{ duration: 0.7, delay: 0.65 }}
        className="mt-4 max-w-md text-center text-base text-white/70 sm:text-lg"
      >
        Onde a ciência vira jogo.
      </motion.p>
    </motion.div>
  );
}

// ---------- Hold-to-enter button ----------
function HoldToEnterButton({
  onComplete,
  visible,
  exiting,
}: {
  onComplete: () => void;
  visible: boolean;
  exiting: boolean;
}) {
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);
  const HOLD_MS = 700;

  useEffect(() => {
    if (!holding) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      const start = performance.now();
      const decay = (now: number) => {
        const t = (now - start) / 250;
        setProgress((p) => Math.max(0, p - 0.08));
        if (t < 1) rafRef.current = requestAnimationFrame(decay);
      };
      rafRef.current = requestAnimationFrame(decay);
      return;
    }
    startRef.current = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - startRef.current) / HOLD_MS);
      setProgress(p);
      if (p >= 1) {
        onComplete();
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [holding, onComplete]);

  // Allow Space / Enter to also trigger
  useEffect(() => {
    if (!visible || exiting) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        if (!holding) setHolding(true);
      }
    };
    const onUp = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "Enter") setHolding(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onUp);
    };
  }, [visible, exiting, holding]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={
        visible && !exiting ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }
      }
      transition={{ duration: 0.6, delay: 1.05, ease: [0.16, 1, 0.3, 1] }}
      className="mt-10 flex flex-col items-center"
    >
      <button
        type="button"
        onPointerDown={() => setHolding(true)}
        onPointerUp={() => setHolding(false)}
        onPointerLeave={() => setHolding(false)}
        onPointerCancel={() => setHolding(false)}
        onClick={() => onComplete()}
        className="group relative inline-flex h-14 items-center gap-3 overflow-hidden rounded-full border border-white/15 bg-white/[0.04] px-9 text-sm font-semibold uppercase tracking-[0.3em] text-white backdrop-blur-md transition-transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
        style={{
          boxShadow:
            "0 0 0 1px rgba(167,139,250,0.25), 0 12px 40px -10px rgba(124,58,237,0.55)",
        }}
        aria-label="Mantenha pressionado para entrar"
      >
        {/* Progress fill */}
        <span
          className="absolute inset-0 origin-left"
          aria-hidden
          style={{
            background:
              "linear-gradient(90deg, rgba(124,58,237,0.85), rgba(56,189,248,0.85))",
            transform: `scaleX(${progress})`,
            transition: holding ? "none" : "transform 250ms ease-out",
            mixBlendMode: "screen",
            opacity: 0.85,
          }}
        />
        {/* Shimmer */}
        <span
          className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3"
          style={{
            background:
              "linear-gradient(110deg, transparent, rgba(255,255,255,0.25), transparent)",
            animation: "sweepShine 3.2s ease-in-out infinite",
          }}
        />
        <span className="relative z-10">Iniciar</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.4}
          className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1"
        >
          <path
            d="M5 12h14M13 6l6 6-6 6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <p className="mt-3 text-[10px] font-mono uppercase tracking-[0.3em] text-white/40">
        Toque · ou segure para entrar
      </p>
    </motion.div>
  );
}

// ---------- Iris-out / liquid transition overlay ----------
function ExitFlash({ active }: { active: boolean }) {
  return (
    <AnimatePresence>
      {active && (
        <>
          {/* Bright shockwave */}
          <motion.div
            key="shock"
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            initial={{ width: 0, height: 0, opacity: 0.9 }}
            animate={{ width: 2400, height: 2400, opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background:
                "radial-gradient(circle, rgba(255,255,255,0.85), rgba(167,139,250,0.4) 35%, rgba(124,58,237,0) 70%)",
              filter: "blur(2px)",
              mixBlendMode: "screen",
            }}
          />
          {/* White flash */}
          <motion.div
            key="flash"
            className="pointer-events-none absolute inset-0 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.55, 0] }}
            transition={{ duration: 0.55, times: [0, 0.4, 1] }}
          />
        </>
      )}
    </AnimatePresence>
  );
}

// ---------- Top-level intro ----------
export function IntroOverlay() {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  // Phases:
  // 0 - black void / particles spawn
  // 1 - rings + halo appear
  // 2 - logo solid + title reveal
  // 3 - exit
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = sessionStorage.getItem(STORAGE_KEY);
    if (seen) return;
    setVisible(true);
    document.body.style.overflow = "hidden";
    const t1 = setTimeout(() => setPhase(1), 350);
    const t2 = setTimeout(() => setPhase(2), 1300);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      document.body.style.overflow = "";
    };
  }, []);

  const handleEnter = () => {
    if (exiting) return;
    setExiting(true);
    setPhase(3);
    sessionStorage.setItem(STORAGE_KEY, "1");
    setTimeout(() => {
      document.body.style.overflow = "";
      setVisible(false);
    }, 950);
  };

  const handleSkip = () => handleEnter();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(20px)" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#06030E] text-white"
          aria-label="Apresentação Arbogame"
          role="dialog"
        >
          {/* Inline keyframes used across components */}
          <style>{`
            @keyframes sweepShine {
              0%   { transform: translateX(0); }
              50%  { transform: translateX(220%); }
              100% { transform: translateX(220%); }
            }
            @keyframes auroraSpin {
              from { transform: translateX(-50%) rotate(0deg); }
              to   { transform: translateX(-50%) rotate(360deg); }
            }
            @keyframes auroraDrift {
              from { transform: translate3d(-30px, -10px, 0) scale(1); }
              to   { transform: translate3d(40px, 30px, 0) scale(1.06); }
            }
            @keyframes grain {
              0%, 100% { transform: translate(0, 0); }
              10%      { transform: translate(-2%, -3%); }
              20%      { transform: translate(-4%, 2%); }
              30%      { transform: translate(2%, -4%); }
              40%      { transform: translate(-1%, 5%); }
              50%      { transform: translate(-3%, 1%); }
              60%      { transform: translate(2%, 3%); }
              70%      { transform: translate(0, -2%); }
              80%      { transform: translate(-3%, 2%); }
              90%      { transform: translate(2%, -3%); }
            }
          `}</style>

          {/* Deep gradient base */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(91,33,182,0.35),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(20,184,166,0.10),transparent_55%)]" />

          {/* Aurora layers */}
          <Aurora />

          {/* Particle convergence */}
          <ConvergenceCanvas phase={phase} />

          {/* Subtle scan grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
              maskImage:
                "radial-gradient(ellipse at center, black 25%, transparent 75%)",
            }}
          />

          {/* Film grain */}
          <div
            className="pointer-events-none absolute inset-[-10%] opacity-[0.06] mix-blend-overlay"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
              animation: "grain 1.4s steps(6) infinite",
            }}
          />

          {/* Corner brackets */}
          <CornerBracket position="tl" delay={0.2} />
          <CornerBracket position="tr" delay={0.32} />
          <CornerBracket position="bl" delay={0.44} />
          <CornerBracket position="br" delay={0.56} />

          {/* Top status bar */}
          <div className="pointer-events-none absolute left-0 right-0 top-0 flex justify-between px-7 py-5 text-[10px] font-mono uppercase tracking-[0.3em] text-white/45">
            <motion.span
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              // sistema · arbogame
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.85, duration: 0.5 }}
              className="hidden sm:block"
            >
              loading · v.2026
            </motion.span>
          </div>

          {/* Center content */}
          <div className="relative z-10 flex flex-col items-center px-6 text-center">
            <LogoCore phase={phase} exiting={exiting} />
            <TitleReveal phase={phase} exiting={exiting} />
            <HoldToEnterButton
              onComplete={handleEnter}
              visible={phase >= 2}
              exiting={exiting}
            />
          </div>

          {/* Bottom legend */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: exiting ? 0 : 1 }}
            transition={{ delay: 1.3, duration: 0.6 }}
            className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-[10px] font-mono uppercase tracking-[0.35em] text-white/40"
          >
            arboviroses · educação · ciência
          </motion.div>

          {/* Skip button */}
          <motion.button
            type="button"
            onClick={handleSkip}
            initial={{ opacity: 0 }}
            animate={{ opacity: exiting ? 0 : 1 }}
            transition={{ delay: 1.6, duration: 0.5 }}
            className="absolute bottom-6 right-6 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[10px] font-mono uppercase tracking-[0.3em] text-white/55 backdrop-blur-md transition-colors hover:bg-white/[0.07] hover:text-white"
          >
            pular ›
          </motion.button>

          <ExitFlash active={exiting} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

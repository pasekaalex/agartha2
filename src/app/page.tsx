"use client";

import { useEffect, useState, useRef } from "react";

export default function Home() {
  const ca = "TTZcPnHQYcrktiyHej9GxLd2rcymAByuzzbojFhpmp2";
  const [glitchText, setGlitchText] = useState("AGARTHA2");
  const [screenTear, setScreenTear] = useState(false);
  const [invert, setInvert] = useState(false);
  const [shake, setShake] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ w: 0, h: 0 });
  const [trails, setTrails] = useState<{ x: number; y: number; id: number }[]>([]);
  const [clickFlash, setClickFlash] = useState(false);
  const [scrambledCA, setScrambledCA] = useState(ca);
  const [easterEgg, setEasterEgg] = useState(0);
  const [mounted, setMounted] = useState(false);
  const trailId = useRef(0);

  useEffect(() => {
    setMounted(true);
    setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    const handleResize = () => setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const glitchChars = "!@#$%^&*()_+-=[]{}|;':\",./<>?`~0123456789";
  const originalText = "AGARTHA2";

  // Random glitch events
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      const rand = Math.random();

      // Screen tear (15% chance)
      if (rand < 0.15) {
        setScreenTear(true);
        setTimeout(() => setScreenTear(false), 150);
      }

      // Color invert (10% chance)
      if (rand > 0.9) {
        setInvert(true);
        setTimeout(() => setInvert(false), 100);
      }

      // Shake (12% chance)
      if (rand > 0.4 && rand < 0.52) {
        setShake(true);
        setTimeout(() => setShake(false), 200);
      }

      // Text scramble (20% chance)
      if (rand > 0.3 && rand < 0.5) {
        scrambleText();
      }
    }, 2000);

    return () => clearInterval(glitchInterval);
  }, []);

  // Scramble title text
  const scrambleText = () => {
    let iterations = 0;
    const interval = setInterval(() => {
      setGlitchText(
        originalText
          .split("")
          .map((char, i) => {
            if (i < iterations) return originalText[i];
            return glitchChars[Math.floor(Math.random() * glitchChars.length)];
          })
          .join("")
      );
      iterations += 1 / 2;
      if (iterations > originalText.length) {
        clearInterval(interval);
        setGlitchText(originalText);
      }
    }, 40);
  };

  // Scramble CA on hover
  const scrambleCA = () => {
    let iterations = 0;
    const interval = setInterval(() => {
      setScrambledCA(
        ca
          .split("")
          .map((char, i) => {
            if (i < iterations) return ca[i];
            return glitchChars[Math.floor(Math.random() * glitchChars.length)];
          })
          .join("")
      );
      iterations += 2;
      if (iterations > ca.length) {
        clearInterval(interval);
        setScrambledCA(ca);
      }
    }, 20);
  };

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });

      // Add trail
      trailId.current += 1;
      setTrails((prev) => [...prev.slice(-12), { x: e.clientX, y: e.clientY, id: trailId.current }]);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Click handler
  const handleClick = () => {
    setClickFlash(true);
    setShake(true);
    scrambleText();
    setEasterEgg((prev) => prev + 1);

    setTimeout(() => {
      setClickFlash(false);
      setShake(false);
    }, 150);
  };

  // Easter egg after 10 clicks
  const easterEggActive = easterEgg >= 10;

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-8 noise scanlines flicker cursor-none transition-all duration-100
        ${invert ? "invert" : ""}
        ${shake ? "translate-x-1" : ""}
        ${clickFlash ? "bg-white" : ""}
      `}
      onClick={handleClick}
      style={{
        filter: screenTear ? `hue-rotate(${Math.random() * 360}deg)` : undefined,
      }}
    >
      {/* CUSTOM CURSOR */}
      <div
        className="fixed w-4 h-4 border border-white pointer-events-none z-50 mix-blend-difference"
        style={{
          left: cursorPos.x - 8,
          top: cursorPos.y - 8,
          transform: `rotate(${cursorPos.x * 0.1}deg)`,
        }}
      />

      {/* CURSOR TRAILS */}
      {trails.map((trail, i) => (
        <div
          key={trail.id}
          className="fixed w-2 h-2 bg-white pointer-events-none mix-blend-difference"
          style={{
            left: trail.x - 4,
            top: trail.y - 4,
            opacity: (i + 1) / trails.length * 0.5,
            transform: `scale(${(i + 1) / trails.length})`,
          }}
        />
      ))}

      {/* SCREEN TEAR EFFECT */}
      {screenTear && (
        <div
          className="fixed inset-0 pointer-events-none z-40"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent ${Math.random() * 10}px,
              rgba(255,0,255,0.1) ${Math.random() * 10}px,
              rgba(0,255,255,0.1) ${Math.random() * 20}px
            )`,
            transform: `translateX(${Math.random() * 20 - 10}px)`,
          }}
        />
      )}

      {/* TITLE */}
      <h1
        className="glitch text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-2 select-none"
        data-text={glitchText}
        style={{
          transform: mounted ? `translate(${(cursorPos.x - windowSize.w / 2) * 0.01}px, ${(cursorPos.y - windowSize.h / 2) * 0.01}px)` : undefined,
        }}
      >
        {glitchText}
      </h1>

      <p className={`text-zinc-500 text-sm mb-12 corrupt select-none ${easterEggActive ? "text-red-500" : ""}`}>
        {easterEggActive ? "you found it" : "they went deeper"}
      </p>

      {/* CONTRACT */}
      <div className="mb-12 text-center">
        <div className="text-zinc-600 text-xs mb-2">CA</div>
        <code
          className="text-zinc-400 text-xs md:text-sm cursor-none hover:text-white transition-colors break-all"
          onClick={(e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(ca);
            scrambleCA();
          }}
          onMouseEnter={scrambleCA}
        >
          {scrambledCA}
        </code>
      </div>

      {/* LINKS */}
      <div className="flex gap-6 text-sm">
        {[
          { href: `https://pump.fun/coin/${ca}`, label: "buy" },
          { href: `https://dexscreener.com/solana/${ca}`, label: "chart" },
          { href: "https://x.com/Agartha2_", label: "x" },
          { href: "https://x.com/i/communities/2010910570950627352", label: "community" },
        ].map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 hover:text-white transition-colors cursor-none hover:glitch-hover"
            onClick={(e) => e.stopPropagation()}
            data-text={`[${link.label}]`}
          >
            [{link.label}]
          </a>
        ))}
      </div>

      {/* CLICK COUNTER (easter egg hint) */}
      {easterEgg > 0 && easterEgg < 10 && (
        <div className="fixed bottom-4 right-4 text-zinc-800 text-xs font-mono">
          {10 - easterEgg}
        </div>
      )}

      {/* EASTER EGG REVEAL */}
      {easterEggActive && (
        <div className="fixed bottom-4 left-4 text-red-900 text-xs font-mono animate-pulse">
          the hollow earth is real
        </div>
      )}
    </div>
  );
}

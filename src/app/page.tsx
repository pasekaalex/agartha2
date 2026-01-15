"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";

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
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [terminalInput, setTerminalInput] = useState("");
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [showAudioPrompt, setShowAudioPrompt] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [copied, setCopied] = useState(false);
  const [imageGlitch, setImageGlitch] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string }[]>([]);
  const [lightning, setLightning] = useState(false);
  const [gameOpen, setGameOpen] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  const [gameTargets, setGameTargets] = useState<{ id: number; x: number; y: number; hit: boolean }[]>([]);
  const [isShooting, setIsShooting] = useState(false);
  const trailId = useRef(0);
  const particleId = useRef(0);
  const targetId = useRef(0);
  const gameInterval = useRef<NodeJS.Timeout | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const droneOsc = useRef<OscillatorNode | null>(null);
  const droneGain = useRef<GainNode | null>(null);
  const terminalRef = useRef<HTMLInputElement>(null);

  const glitchChars = "!@#$%^&*()_+-=[]{}|;':\",./<>?`~0123456789";
  const originalText = "AGARTHA2";

  const terminalMessages = [
    "SIGNAL DETECTED... ORIGIN: UNKNOWN",
    "DEPTH: 4,000 MILES BELOW SURFACE",
    "VRIL ENERGY SIGNATURE: ACTIVE",
    "WARNING: UNAUTHORIZED ACCESS ATTEMPT",
    "COORDINATES: [REDACTED]",
    "THE KING OF THE WORLD IS WATCHING",
    "HOLLOW EARTH NETWORK: ONLINE",
    "AGARTHA MAINFRAME: CONNECTED",
    "SURFACE DWELLER IDENTIFIED",
    "THEY ARE ALREADY HERE",
    "DO NOT TRUST THE SURFACE",
    "WE HAVE BEEN WAITING",
    "THE DESCENT BEGINS",
  ];

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const initAudio = useCallback(() => {
    if (audioContext.current) return;

    audioContext.current = new AudioContext();

    droneOsc.current = audioContext.current.createOscillator();
    droneGain.current = audioContext.current.createGain();

    droneOsc.current.type = "sine";
    droneOsc.current.frequency.setValueAtTime(55, audioContext.current.currentTime);
    droneGain.current.gain.setValueAtTime(0.03, audioContext.current.currentTime);

    const lfo = audioContext.current.createOscillator();
    const lfoGain = audioContext.current.createGain();
    lfo.frequency.setValueAtTime(0.1, audioContext.current.currentTime);
    lfoGain.gain.setValueAtTime(5, audioContext.current.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(droneOsc.current.frequency);
    lfo.start();

    droneOsc.current.connect(droneGain.current);
    droneGain.current.connect(audioContext.current.destination);
    droneOsc.current.start();

    setAudioEnabled(true);
    setShowAudioPrompt(false);
  }, []);

  const playGlitchSound = useCallback(() => {
    if (!audioContext.current || !audioEnabled) return;

    const osc = audioContext.current.createOscillator();
    const gain = audioContext.current.createGain();

    osc.type = "square";
    osc.frequency.setValueAtTime(Math.random() * 200 + 100, audioContext.current.currentTime);
    gain.gain.setValueAtTime(0.1, audioContext.current.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.current.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(audioContext.current.destination);
    osc.start();
    osc.stop(audioContext.current.currentTime + 0.1);
  }, [audioEnabled]);

  useEffect(() => {
    setMounted(true);
    setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    const handleResize = () => setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      const rand = Math.random();

      if (rand < 0.15) {
        setScreenTear(true);
        playGlitchSound();
        setTimeout(() => setScreenTear(false), 150);
      }

      if (rand > 0.9) {
        setInvert(true);
        setTimeout(() => setInvert(false), 100);
      }

      if (rand > 0.4 && rand < 0.52) {
        setShake(true);
        setTimeout(() => setShake(false), 200);
      }

      if (rand > 0.3 && rand < 0.5) {
        scrambleText();
      }

      // Image glitch (25% chance)
      if (rand > 0.75) {
        setImageGlitch(true);
        setTimeout(() => setImageGlitch(false), 200);
      }
    }, 2000);

    return () => clearInterval(glitchInterval);
  }, [playGlitchSound]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "`" || e.key === "Escape") {
        if (terminalOpen) {
          setTerminalOpen(false);
        } else if (e.key === "`") {
          openTerminal();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [terminalOpen]);

  const openTerminal = () => {
    setTerminalOpen(true);
    setTerminalLines(["AGARTHA TERMINAL v2.0", "TYPE 'help' FOR COMMANDS", ""]);
    setTimeout(() => terminalRef.current?.focus(), 100);
  };

  const processCommand = (cmd: string) => {
    const command = cmd.toLowerCase().trim();
    let response: string[] = [];

    switch (command) {
      case "help":
        response = [
          "AVAILABLE COMMANDS:",
          "  status    - check connection",
          "  scan      - scan for signals",
          "  locate    - triangulate position",
          "  decrypt   - decrypt intercepted data",
          "  clear     - clear terminal",
          "  exit      - close terminal",
        ];
        break;
      case "status":
        response = [
          "CONNECTION: ACTIVE",
          "SIGNAL STRENGTH: 87%",
          "ENCRYPTION: VRIL-256",
          "DEPTH: 4,000 MI",
          "STATUS: MONITORING...",
        ];
        break;
      case "scan":
        response = ["SCANNING..."];
        setTimeout(() => {
          setTerminalLines(prev => [...prev,
            "DETECTED: 3 ACTIVE NODES",
            "NODE_01: SHAMBHALA GATEWAY",
            "NODE_02: ANTARCTIC ENTRANCE",
            "NODE_03: [CLASSIFIED]",
            "SCAN COMPLETE"
          ]);
        }, 1500);
        break;
      case "locate":
        response = ["TRIANGULATING..."];
        setTimeout(() => {
          setTerminalLines(prev => [...prev,
            "ERROR: COORDINATES SCRAMBLED",
            "INTERFERENCE DETECTED",
            "SOURCE: INNER EARTH",
            "THEY KNOW YOU ARE LOOKING"
          ]);
          playGlitchSound();
          setShake(true);
          setTimeout(() => setShake(false), 300);
        }, 2000);
        break;
      case "decrypt":
        response = ["DECRYPTING TRANSMISSION..."];
        setTimeout(() => {
          const msg = terminalMessages[Math.floor(Math.random() * terminalMessages.length)];
          setTerminalLines(prev => [...prev, `> ${msg}`]);
          playGlitchSound();
        }, 1000);
        break;
      case "clear":
        setTerminalLines(["AGARTHA TERMINAL v2.0", ""]);
        return;
      case "exit":
        setTerminalOpen(false);
        return;
      case "agartha":
        response = ["WE HAVE BEEN EXPECTING YOU"];
        playGlitchSound();
        setInvert(true);
        setTimeout(() => setInvert(false), 500);
        break;
      default:
        response = [`UNKNOWN COMMAND: ${cmd}`, "TYPE 'help' FOR COMMANDS"];
    }

    setTerminalLines(prev => [...prev, `> ${cmd}`, ...response]);
  };

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

  // Only track mouse on desktop
  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      trailId.current += 1;
      setTrails((prev) => [...prev.slice(-12), { x: e.clientX, y: e.clientY, id: trailId.current }]);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMobile]);

  const handleClick = () => {
    if (showAudioPrompt) {
      initAudio();
      return;
    }

    setClickFlash(true);
    setShake(true);
    scrambleText();
    playGlitchSound();
    setEasterEgg((prev) => prev + 1);

    setTimeout(() => {
      setClickFlash(false);
      setShake(false);
    }, 150);
  };

  const copyCA = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(ca);
    scrambleCA();
    playGlitchSound();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCigClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;

    // Lightning effect
    setLightning(true);
    playGlitchSound();
    setTimeout(() => setLightning(false), 300);

    // Spawn 20-30 particles
    const particleCount = Math.floor(Math.random() * 10) + 20;
    const newParticles: { id: number; x: number; y: number; color: string }[] = [];

    for (let i = 0; i < particleCount; i++) {
      particleId.current += 1;
      const color = Math.random() > 0.6 ? "#ff0000" : "#ffd700"; // red or gold
      newParticles.push({
        id: particleId.current,
        x: startX,
        y: startY,
        color,
      });
    }

    setParticles(prev => [...prev, ...newParticles]);

    // Remove particles after animation
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 2000);
  };

  // Game functions
  const startGame = () => {
    setGameOpen(true);
    setGameScore(0);
    setGameTargets([]);

    // Spawn targets every 1.5 seconds
    gameInterval.current = setInterval(() => {
      targetId.current += 1;
      setGameTargets(prev => [...prev, {
        id: targetId.current,
        x: Math.random() * 80 + 10, // 10-90% of screen width
        y: -5,
        hit: false,
      }]);
    }, 1500);
  };

  const stopGame = () => {
    setGameOpen(false);
    if (gameInterval.current) {
      clearInterval(gameInterval.current);
    }
  };

  const shootTarget = (clickX: number, clickY: number) => {
    setIsShooting(true);
    playGlitchSound();

    setTimeout(() => setIsShooting(false), 200);

    // Check if any target was hit (expanded hitbox)
    setGameTargets(prev => {
      let scoreAdded = false;
      return prev.map(target => {
        if (target.hit || scoreAdded) return target;

        const distance = Math.sqrt(
          Math.pow(target.x - clickX, 2) + Math.pow(target.y - clickY, 2)
        );

        // Larger hit area (20 units)
        if (distance < 20) {
          if (!scoreAdded) {
            setGameScore(s => s + 1);
            scoreAdded = true;
          }
          return { ...target, hit: true };
        }
        return target;
      });
    });
  };

  // Animate targets falling
  useEffect(() => {
    if (!gameOpen) return;

    const animInterval = setInterval(() => {
      setGameTargets(prev => {
        const updated = prev.map(t => ({ ...t, y: t.y + 0.8 }));
        // Remove targets that fell off screen or were hit
        return updated.filter(t => t.y < 110 && !t.hit);
      });
    }, 50);

    return () => clearInterval(animInterval);
  }, [gameOpen]);

  const easterEggActive = easterEgg >= 10;

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-4 md:p-8 noise scanlines flicker transition-all duration-100
        ${!isMobile ? "cursor-none" : ""}
        ${invert ? "invert" : ""}
        ${shake ? "translate-x-1" : ""}
        ${clickFlash ? "bg-white" : ""}
      `}
      onClick={handleClick}
      style={{
        filter: screenTear ? `hue-rotate(${Math.random() * 360}deg)` : undefined,
      }}
    >
      {/* AUDIO PROMPT */}
      {showAudioPrompt && (
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center">
          <div className="text-center">
            <p className="text-zinc-500 text-sm mb-4">{isMobile ? "tap" : "click"} anywhere to enter</p>
            <p className="text-zinc-700 text-xs">(enables audio)</p>
          </div>
        </div>
      )}

      {/* CUSTOM CURSOR - desktop only */}
      {!isMobile && (
        <>
          <div
            className="fixed w-4 h-4 border border-white pointer-events-none z-50 mix-blend-difference"
            style={{
              left: cursorPos.x - 8,
              top: cursorPos.y - 8,
              transform: `rotate(${cursorPos.x * 0.1}deg)`,
            }}
          />
          {trails.map((trail, i) => (
            <div
              key={`trail-${trail.id}-${i}`}
              className="fixed w-2 h-2 bg-white pointer-events-none mix-blend-difference"
              style={{
                left: trail.x - 4,
                top: trail.y - 4,
                opacity: (i + 1) / trails.length * 0.5,
                transform: `scale(${(i + 1) / trails.length})`,
              }}
            />
          ))}
        </>
      )}

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

      {/* TERMINAL */}
      {terminalOpen && (
        <div
          className="fixed inset-2 md:inset-20 bg-black border border-green-500/50 z-[60] p-3 md:p-4 font-mono text-xs md:text-sm overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4 text-green-500">
            <span>AGARTHA_TERMINAL</span>
            <button
              onClick={() => setTerminalOpen(false)}
              className="text-xs text-zinc-500 hover:text-white px-2 py-1"
            >
              [close]
            </button>
          </div>
          <div className="flex-1 overflow-y-auto text-green-400 space-y-1">
            {terminalLines.map((line, i) => (
              <div key={i} className={line.startsWith(">") ? "text-green-300" : "text-green-500/70"}>
                {line}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-4 text-green-400">
            <span>{">"}</span>
            <input
              ref={terminalRef}
              type="text"
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && terminalInput.trim()) {
                  processCommand(terminalInput);
                  setTerminalInput("");
                }
              }}
              className="flex-1 bg-transparent outline-none text-green-400 caret-green-400 text-base"
              autoFocus
              autoCapitalize="none"
              autoCorrect="off"
            />
          </div>
        </div>
      )}

      {/* BACKGROUND BANNER */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <Image
          src="/banner.jpeg"
          alt=""
          fill
          className={`object-cover opacity-[0.07] transition-all duration-200 ${imageGlitch ? "scale-105 hue-rotate-180" : ""}`}
          priority
        />
      </div>

      {/* VIDEO */}
      <div className={`relative mb-6 transition-all duration-150 ${imageGlitch ? "hue-rotate-180 saturate-200" : ""}`}>
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full max-w-md md:max-w-lg border-2 border-zinc-800 opacity-90"
        >
          <source src="/vid.mp4" type="video/mp4" />
        </video>
      </div>

      {/* MASCOT IMAGE */}
      <div className={`relative mb-6 transition-all duration-150 ${imageGlitch ? "scale-x-[-1] hue-rotate-90" : ""}`}>
        <div className="relative w-24 h-24 md:w-32 md:h-32">
          <Image
            src="/pic.jpg"
            alt="AGARTHA2"
            fill
            className={`object-cover rounded-full border-2 border-zinc-800 ${imageGlitch ? "blur-[2px]" : ""}`}
            priority
          />
          {/* Glitch overlay layers */}
          <div
            className="absolute inset-0 rounded-full overflow-hidden opacity-50 mix-blend-screen"
            style={{
              transform: imageGlitch ? "translateX(4px)" : "translateX(0)",
              filter: "url(#cyan)",
            }}
          >
            <Image src="/pic.jpg" alt="" fill className="object-cover" style={{ filter: "url(#cyan)" }} />
          </div>
          <div
            className="absolute inset-0 rounded-full overflow-hidden opacity-50 mix-blend-screen"
            style={{
              transform: imageGlitch ? "translateX(-4px)" : "translateX(0)",
            }}
          >
            <Image src="/pic.jpg" alt="" fill className="object-cover" style={{ filter: "hue-rotate(270deg)" }} />
          </div>
        </div>
      </div>

      {/* TITLE */}
      <h1
        className="glitch text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-2 select-none"
        data-text={glitchText}
        style={{
          transform: mounted && !isMobile ? `translate(${(cursorPos.x - windowSize.w / 2) * 0.01}px, ${(cursorPos.y - windowSize.h / 2) * 0.01}px)` : undefined,
        }}
      >
        {glitchText}
      </h1>

      <p className={`text-zinc-500 text-sm mb-8 md:mb-12 corrupt select-none ${easterEggActive ? "text-red-500" : ""}`}>
        {easterEggActive ? "you found it" : "they went deeper"}
      </p>

      {/* CONTRACT */}
      <div className="mb-8 md:mb-12 text-center w-full max-w-md px-4">
        <div className="text-zinc-600 text-xs mb-2">CA {copied && <span className="text-green-500">(copied!)</span>}</div>
        <code
          className="text-zinc-400 text-xs md:text-sm hover:text-white transition-colors break-all block p-3 bg-zinc-900/50 rounded active:bg-zinc-800"
          onClick={copyCA}
          onMouseEnter={() => !isMobile && scrambleCA()}
        >
          {scrambledCA}
        </code>
      </div>

      {/* LINKS */}
      <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm">
        {[
          { href: "https://jup.ag/swap?sell=So11111111111111111111111111111111111111112&buy=TTZcPnHQYcrktiyHej9GxLd2rcymAByuzzbojFhpmp2", label: "buy" },
          { href: `https://dexscreener.com/solana/${ca}`, label: "chart" },
          { href: "https://x.com/Agartha2_", label: "x" },
          { href: "https://x.com/i/communities/2010910570950627352", label: "community" },
        ].map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-zinc-500 hover:text-white transition-colors p-2 ${!isMobile ? "cursor-none" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            [{link.label}]
          </a>
        ))}
      </div>

      {/* TERMINAL BUTTON - mobile */}
      {isMobile && !terminalOpen && !gameOpen && mounted && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            openTerminal();
          }}
          className="fixed bottom-4 left-4 text-zinc-600 text-xs font-mono p-2 active:text-white"
        >
          [terminal]
        </button>
      )}

      {/* TERMINAL HINT - desktop */}
      {!isMobile && !terminalOpen && !gameOpen && mounted && (
        <div className="fixed bottom-4 left-4 text-zinc-800 text-xs font-mono">
          press ` for terminal
        </div>
      )}

      {/* GAME BUTTON */}
      {!gameOpen && !terminalOpen && mounted && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            startGame();
          }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 text-zinc-600 hover:text-white text-xs font-mono p-2 border border-zinc-800 hover:border-zinc-600 transition-colors"
        >
          [play game]
        </button>
      )}

      {/* CLICK COUNTER */}
      {easterEgg > 0 && easterEgg < 10 && (
        <div className="fixed bottom-4 right-4 text-zinc-800 text-xs font-mono">
          {10 - easterEgg}
        </div>
      )}

      {/* EASTER EGG */}
      {easterEggActive && (
        <div className="fixed bottom-12 left-4 text-red-900 text-xs font-mono animate-pulse">
          the hollow earth is real
        </div>
      )}

      {/* CIG BUTTON */}
      <div
        className="fixed bottom-20 right-4 md:bottom-24 md:right-8 cursor-pointer hover:scale-110 transition-transform z-50"
        onClick={handleCigClick}
      >
        <div className="relative w-16 h-16 md:w-20 md:h-20">
          <Image
            src="/cig.png"
            alt=""
            fill
            className={`object-contain ${lightning ? "brightness-200 drop-shadow-[0_0_20px_rgba(255,0,0,0.8)]" : ""}`}
          />
        </div>
      </div>

      {/* PARTICLES */}
      {particles.map((particle) => {
        const angle = Math.random() * Math.PI * 2;
        const distance = 800 + Math.random() * 400;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;

        return (
          <div
            key={`particle-${particle.id}`}
            className="fixed pointer-events-none z-[70]"
            style={{
              left: particle.x,
              top: particle.y,
              width: "8px",
              height: "8px",
              backgroundColor: particle.color,
              boxShadow: `0 0 10px ${particle.color}, 0 0 20px ${particle.color}`,
              borderRadius: "50%",
              animation: "particleFade 2s ease-out forwards",
              transform: `translate(${dx}px, ${dy}px) scale(0)`,
              transition: "all 2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            }}
          />
        );
      })}

      {/* LIGHTNING OVERLAY */}
      {lightning && (
        <div className="fixed inset-0 pointer-events-none z-[60]">
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at center, rgba(255,0,0,0.5) 0%, transparent 70%)`,
              animation: "flash 0.3s ease-out",
            }}
          />
          {/* Lightning bolts */}
          {[...Array(isMobile ? 6 : 12)].map((_, i) => {
            const startX = Math.random() * 100;
            const segments = 10 + Math.floor(Math.random() * 8);
            const points: { x: number; y: number }[] = [{ x: startX, y: 0 }];

            for (let j = 1; j <= segments; j++) {
              const prevPoint = points[j - 1];
              const yStep = (100 / segments) * j;
              const xJitter = (Math.random() - 0.5) * 20;
              points.push({
                x: prevPoint.x + xJitter,
                y: yStep,
              });
            }

            const pathData = points.map((p, idx) =>
              `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
            ).join(' ');

            return (
              <svg
                key={`lightning-${i}`}
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                style={{
                  opacity: 0.9,
                }}
              >
                {/* Main bolt */}
                <path
                  d={pathData}
                  fill="none"
                  stroke="#ff0000"
                  strokeWidth={0.5}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  style={{
                    filter: "drop-shadow(0 0 4px #ff0000) drop-shadow(0 0 8px #ffd700)",
                  }}
                />
                {/* Glow layer */}
                <path
                  d={pathData}
                  fill="none"
                  stroke="#ffd700"
                  strokeWidth={0.3}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  style={{
                    filter: "blur(1px)",
                  }}
                />
                {/* Branches */}
                {points.slice(2, -2).map((point, branchIdx) => {
                  if (Math.random() > 0.5) {
                    const branchLength = 5 + Math.random() * 8;
                    const branchX = point.x + (Math.random() - 0.5) * 30;
                    const branchY = point.y + branchLength;
                    return (
                      <path
                        key={`branch-${branchIdx}`}
                        d={`M ${point.x} ${point.y} L ${branchX} ${branchY}`}
                        fill="none"
                        stroke="#ff0000"
                        strokeWidth={0.3}
                        strokeLinecap="round"
                        vectorEffect="non-scaling-stroke"
                        style={{
                          filter: "drop-shadow(0 0 3px #ff0000)",
                        }}
                      />
                    );
                  }
                  return null;
                })}
              </svg>
            );
          })}
        </div>
      )}

      {/* GAME OVERLAY */}
      {gameOpen && (
        <div className="fixed inset-0 bg-black z-[100] flex flex-col cursor-crosshair">
          {/* Game HUD */}
          <div className="flex justify-between items-center p-4 text-green-400 font-mono">
            <div className="text-xl">SCORE: {gameScore}</div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                stopGame();
              }}
              className="text-zinc-500 hover:text-white text-sm px-3 py-1 border border-zinc-800 hover:border-zinc-600 cursor-pointer"
            >
              [exit]
            </button>
          </div>

          {/* Game Area */}
          <div
            className="flex-1 relative overflow-hidden cursor-crosshair"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;
              shootTarget(x, y);
            }}
          >
            {/* Falling Targets (cigs) */}
            {gameTargets.map(target => (
              <div
                key={`target-${target.id}`}
                className="absolute transition-opacity duration-200"
                style={{
                  left: `${target.x}%`,
                  top: `${target.y}%`,
                  transform: "translate(-50%, -50%)",
                  opacity: target.hit ? 0 : 1,
                }}
              >
                <Image
                  src="/cig.png"
                  alt=""
                  width={40}
                  height={40}
                  className={`${target.hit ? "blur-sm" : ""}`}
                />
              </div>
            ))}

            {/* Player Character */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
              <div className="relative w-32 h-32 md:w-40 md:h-40">
                <Image
                  src={isShooting ? "/ep2.jpg" : "/ep1.jpg"}
                  alt=""
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            </div>

            {/* Shooting Effect */}
            {isShooting && (
              <div className="absolute inset-0 pointer-events-none">
                <div
                  className="absolute inset-0"
                  style={{
                    background: "radial-gradient(circle at center, rgba(255,0,0,0.3) 0%, transparent 50%)",
                    animation: "flash 0.2s ease-out",
                  }}
                />
              </div>
            )}
          </div>

          {/* Game Instructions */}
          <div className="p-4 text-center text-zinc-600 text-xs font-mono border-t border-zinc-900">
            {isMobile ? "TAP" : "CLICK"} TO SHOOT LIGHTNING AT FALLING TARGETS
          </div>
        </div>
      )}
    </div>
  );
}

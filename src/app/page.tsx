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
  const trailId = useRef(0);
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
            className={`text-zinc-500 hover:text-white transition-colors p-2 ${!isMobile ? "cursor-none" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            [{link.label}]
          </a>
        ))}
      </div>

      {/* TERMINAL BUTTON - mobile */}
      {isMobile && !terminalOpen && mounted && (
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
      {!isMobile && !terminalOpen && mounted && (
        <div className="fixed bottom-4 left-4 text-zinc-800 text-xs font-mono">
          press ` for terminal
        </div>
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
    </div>
  );
}

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
  const [gameTargets, setGameTargets] = useState<{ id: number; x: number; y: number; hit: boolean; type: 'normal' | 'fast' | 'golden'; hp: number }[]>([]);
  const [isShooting, setIsShooting] = useState(false);
  const [gameLives, setGameLives] = useState(3);
  const [gameCombo, setGameCombo] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameLightning, setGameLightning] = useState<{ x: number; y: number } | null>(null);
  const [gameExplosions, setGameExplosions] = useState<{ id: number; x: number; y: number; color?: string }[]>([]);
  const [gameHighScore, setGameHighScore] = useState(0);
  const [gameShake, setGameShake] = useState(false);
  const [scorePopups, setScorePopups] = useState<{ id: number; x: number; y: number; score: number; color: string }[]>([]);
  const [gameCrosshair, setGameCrosshair] = useState({ x: 50, y: 50 });
  const [chainLightning, setChainLightning] = useState<{ from: { x: number; y: number }; to: { x: number; y: number } } | null>(null);
  // Game 2 state (collector game)
  const [game2Open, setGame2Open] = useState(false);
  const [game2Score, setGame2Score] = useState(0);
  const [game2Lives, setGame2Lives] = useState(3);
  const [game2PlayerX, setGame2PlayerX] = useState(50);
  const [game2Items, setGame2Items] = useState<{ id: number; x: number; y: number; type: 'cig' | 'bomb'; collected: boolean }[]>([]);
  const [game2Over, setGame2Over] = useState(false);
  const [game2HighScore, setGame2HighScore] = useState(0);
  const [game2Flash, setGame2Flash] = useState<'red' | 'green' | null>(null);
  const [gameMenuOpen, setGameMenuOpen] = useState(false);
  const trailId = useRef(0);
  const particleId = useRef(0);
  const targetId = useRef(0);
  const explosionId = useRef(0);
  const scorePopupId = useRef(0);
  const game2ItemId = useRef(0);
  const gameInterval = useRef<NodeJS.Timeout | null>(null);
  const game2Interval = useRef<NodeJS.Timeout | null>(null);
  const gameTime = useRef(0);
  const game2Time = useRef(0);
  const keysPressed = useRef<Set<string>>(new Set());
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
    setGameLives(3);
    setGameCombo(0);
    setGameOver(false);
    setGameExplosions([]);
    setScorePopups([]);
    setChainLightning(null);
    gameTime.current = 0;

    // Spawn targets - aggressive difficulty scaling
    const spawnTarget = () => {
      if (gameInterval.current) clearTimeout(gameInterval.current);

      // Spawn multiple targets at higher difficulties
      const wave = Math.floor(gameTime.current / 15); // Every 15 spawns = new wave
      const extraSpawns = Math.min(wave, 2); // Up to 2 extra targets per spawn

      for (let s = 0; s <= extraSpawns; s++) {
        targetId.current += 1;

        // Fast targets become more common over time (17% -> 45%)
        const fastChance = Math.min(0.45, 0.17 + gameTime.current * 0.007);
        const rand = Math.random();
        let type: 'normal' | 'fast' | 'golden' = 'normal';
        let hp = 1;

        if (rand > 0.94) {
          type = 'golden'; // 6% chance - worth 5 points
          hp = 1;
        } else if (rand > (1 - fastChance)) {
          type = 'fast'; // Increases over time
          hp = 1;
        }

        setGameTargets(prev => [...prev, {
          id: targetId.current,
          x: Math.random() * 70 + 15 + (s * 5), // Slightly spread multiple spawns
          y: -5 - (s * 3), // Stagger vertical start
          hit: false,
          type,
          hp,
        }]);
      }

      gameTime.current += 1;
      // Spawn rate: 1800ms -> 400ms (faster scaling, lower minimum)
      const spawnDelay = Math.max(400, 1800 - gameTime.current * 40);
      gameInterval.current = setTimeout(spawnTarget, spawnDelay);
    };

    gameInterval.current = setTimeout(spawnTarget, 1200);
  };

  const stopGame = () => {
    setGameOpen(false);
    setGameOver(false);
    if (gameInterval.current) {
      clearTimeout(gameInterval.current);
    }
  };

  const playHitSound = useCallback(() => {
    if (!audioContext.current || !audioEnabled) return;

    const osc = audioContext.current.createOscillator();
    const gain = audioContext.current.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(800, audioContext.current.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, audioContext.current.currentTime + 0.15);
    gain.gain.setValueAtTime(0.15, audioContext.current.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.current.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(audioContext.current.destination);
    osc.start();
    osc.stop(audioContext.current.currentTime + 0.15);
  }, [audioEnabled]);

  const playMissSound = useCallback(() => {
    if (!audioContext.current || !audioEnabled) return;

    const osc = audioContext.current.createOscillator();
    const gain = audioContext.current.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(200, audioContext.current.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, audioContext.current.currentTime + 0.3);
    gain.gain.setValueAtTime(0.1, audioContext.current.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.current.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(audioContext.current.destination);
    osc.start();
    osc.stop(audioContext.current.currentTime + 0.3);
  }, [audioEnabled]);

  const shootTarget = (clickX: number, clickY: number) => {
    if (gameOver) return;

    setIsShooting(true);
    setGameLightning({ x: clickX, y: clickY });
    playGlitchSound();

    setTimeout(() => {
      setIsShooting(false);
      setGameLightning(null);
    }, 200);

    // Check if any target was hit
    let hitTarget: { x: number; y: number; type: 'normal' | 'fast' | 'golden' } | null = null;

    setGameTargets(prev => {
      const newTargets = prev.map(target => {
        if (target.hit || hitTarget) return target;

        const distance = Math.sqrt(
          Math.pow(target.x - clickX, 2) + Math.pow(target.y - clickY, 2)
        );

        // Hit detection - golden targets have bigger hitbox
        const hitRadius = target.type === 'golden' ? 22 : 18;
        if (distance < hitRadius) {
          hitTarget = { x: target.x, y: target.y, type: target.type };

          // Determine points based on target type
          const basePoints = target.type === 'golden' ? 5 : target.type === 'fast' ? 2 : 1;

          // Add explosion at target location with color based on type
          const expId = ++explosionId.current;
          const expColor = target.type === 'golden' ? '#ffd700' : target.type === 'fast' ? '#00ffff' : '#ff0000';
          setGameExplosions(exp => [...exp, { id: expId, x: target.x, y: target.y, color: expColor }]);
          setTimeout(() => {
            setGameExplosions(exp => exp.filter(e => e.id !== expId));
          }, 500);

          // Screen shake on hit
          setGameShake(true);
          setTimeout(() => setGameShake(false), 100);

          // Score popup
          setGameCombo(c => {
            const newCombo = c + 1;
            const comboBonus = Math.floor(newCombo / 3);
            const totalPoints = basePoints + comboBonus;

            // Add floating score popup
            const popupId = ++scorePopupId.current;
            const popupColor = target.type === 'golden' ? '#ffd700' : newCombo >= 3 ? '#00ff00' : '#ffffff';
            setScorePopups(p => [...p, { id: popupId, x: target.x, y: target.y, score: totalPoints, color: popupColor }]);
            setTimeout(() => {
              setScorePopups(p => p.filter(pop => pop.id !== popupId));
            }, 1000);

            setGameScore(s => s + totalPoints);
            return newCombo;
          });

          playHitSound();
          return { ...target, hit: true };
        }
        return target;
      });

      // Chain lightning! 30% chance to hit a nearby target when you hit one
      if (hitTarget && Math.random() < 0.3) {
        const nearbyTarget = newTargets.find(t =>
          !t.hit &&
          Math.sqrt(Math.pow(t.x - hitTarget!.x, 2) + Math.pow(t.y - hitTarget!.y, 2)) < 30
        );

        if (nearbyTarget) {
          // Show chain lightning effect
          setChainLightning({ from: { x: hitTarget.x, y: hitTarget.y }, to: { x: nearbyTarget.x, y: nearbyTarget.y } });
          setTimeout(() => setChainLightning(null), 150);

          // Hit the chained target
          const chainExpId = ++explosionId.current;
          setGameExplosions(exp => [...exp, { id: chainExpId, x: nearbyTarget.x, y: nearbyTarget.y, color: '#00ffff' }]);
          setTimeout(() => {
            setGameExplosions(exp => exp.filter(e => e.id !== chainExpId));
          }, 500);

          // Chain hit bonus
          const chainPopupId = ++scorePopupId.current;
          setScorePopups(p => [...p, { id: chainPopupId, x: nearbyTarget.x, y: nearbyTarget.y, score: 3, color: '#00ffff' }]);
          setTimeout(() => {
            setScorePopups(p => p.filter(pop => pop.id !== chainPopupId));
          }, 1000);

          setGameScore(s => s + 3);
          setGameCombo(c => c + 1);

          return newTargets.map(t => t.id === nearbyTarget.id ? { ...t, hit: true } : t);
        }
      }

      return newTargets;
    });

    // Reset combo on miss (after state update)
    setTimeout(() => {
      if (!hitTarget) {
        setGameCombo(0);
      }
    }, 0);
  };

  // Animate targets falling
  useEffect(() => {
    if (!gameOpen || gameOver) return;

    const animInterval = setInterval(() => {
      setGameTargets(prev => {
        const updated = prev.map(t => {
          // Base speed increases aggressively over time (0.6 -> 1.4)
          const baseSpeed = 0.6 + Math.min(gameTime.current * 0.025, 0.8);
          // Fast targets move 2x faster and scale even more, golden slightly slower
          const fastBonus = t.type === 'fast' ? Math.min(gameTime.current * 0.01, 0.3) : 0;
          const typeMultiplier = t.type === 'fast' ? (2.0 + fastBonus) : t.type === 'golden' ? 0.65 : 1;
          const speed = baseSpeed * typeMultiplier;
          return { ...t, y: t.y + speed };
        });

        // Check for missed targets (fell off screen)
        const missed = updated.filter(t => t.y >= 100 && !t.hit);
        if (missed.length > 0) {
          setGameLives(l => {
            const newLives = l - missed.length;
            if (newLives <= 0) {
              // Game over
              setGameOver(true);
              setGameHighScore(h => Math.max(h, gameScore));
              if (gameInterval.current) clearTimeout(gameInterval.current);
              playMissSound();
            } else {
              playMissSound();
            }
            return Math.max(0, newLives);
          });
          setGameCombo(0); // Reset combo on miss
        }

        // Remove targets that fell off screen or were hit
        return updated.filter(t => t.y < 105 && !t.hit);
      });
    }, 50);

    return () => clearInterval(animInterval);
  }, [gameOpen, gameOver, gameScore, playMissSound]);

  // ========== GAME 2: COLLECTOR ==========
  const startGame2 = () => {
    setGame2Open(true);
    setGame2Score(0);
    setGame2Lives(3);
    setGame2PlayerX(50);
    setGame2Items([]);
    setGame2Over(false);
    setGame2Flash(null);
    setGameMenuOpen(false);
    game2Time.current = 0;

    // Spawn items
    const spawnItem = () => {
      if (game2Interval.current) clearTimeout(game2Interval.current);

      game2ItemId.current += 1;

      // Bomb chance increases over time (20% -> 50%)
      const bombChance = Math.min(0.5, 0.2 + game2Time.current * 0.008);
      const type: 'cig' | 'bomb' = Math.random() < bombChance ? 'bomb' : 'cig';

      setGame2Items(prev => [...prev, {
        id: game2ItemId.current,
        x: Math.random() * 80 + 10,
        y: -5,
        type,
        collected: false,
      }]);

      game2Time.current += 1;
      // Spawn faster over time (1200ms -> 400ms)
      const delay = Math.max(400, 1200 - game2Time.current * 25);
      game2Interval.current = setTimeout(spawnItem, delay);
    };

    game2Interval.current = setTimeout(spawnItem, 800);
  };

  const stopGame2 = () => {
    setGame2Open(false);
    setGame2Over(false);
    if (game2Interval.current) clearTimeout(game2Interval.current);
  };

  // Game 2 keyboard controls
  useEffect(() => {
    if (!game2Open || game2Over) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        keysPressed.current.add('left');
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        keysPressed.current.add('right');
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        keysPressed.current.delete('left');
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        keysPressed.current.delete('right');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      keysPressed.current.clear();
    };
  }, [game2Open, game2Over]);

  // Game 2 movement and collision
  useEffect(() => {
    if (!game2Open || game2Over) return;

    const gameLoop = setInterval(() => {
      // Move player based on keys pressed
      if (keysPressed.current.has('left')) {
        setGame2PlayerX(x => Math.max(5, x - 2.5));
      }
      if (keysPressed.current.has('right')) {
        setGame2PlayerX(x => Math.min(95, x + 2.5));
      }

      // Move items and check collisions
      setGame2Items(prev => {
        const speed = 0.8 + Math.min(game2Time.current * 0.02, 0.8);

        return prev.map(item => {
          if (item.collected) return item;

          const newY = item.y + speed;

          // Check collision with player (item at bottom, player area)
          if (newY >= 85 && newY <= 95) {
            setGame2PlayerX(playerX => {
              const distance = Math.abs(item.x - playerX);
              if (distance < 12) {
                if (item.type === 'cig') {
                  // Collected cig!
                  setGame2Score(s => s + 1);
                  setGame2Flash('green');
                  setTimeout(() => setGame2Flash(null), 100);
                  playHitSound();
                  item.collected = true;
                } else {
                  // Hit bomb!
                  setGame2Lives(l => {
                    const newLives = l - 1;
                    if (newLives <= 0) {
                      setGame2Over(true);
                      setGame2HighScore(h => Math.max(h, game2Score));
                      if (game2Interval.current) clearTimeout(game2Interval.current);
                    }
                    return Math.max(0, newLives);
                  });
                  setGame2Flash('red');
                  setTimeout(() => setGame2Flash(null), 150);
                  playMissSound();
                  item.collected = true;
                }
              }
              return playerX;
            });
          }

          return { ...item, y: newY };
        }).filter(item => item.y < 110 && !item.collected);
      });
    }, 30);

    return () => clearInterval(gameLoop);
  }, [game2Open, game2Over, game2Score, playHitSound, playMissSound]);

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
      {!gameOpen && !game2Open && !terminalOpen && !gameMenuOpen && mounted && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setGameMenuOpen(true);
          }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 text-zinc-600 hover:text-white text-xs font-mono p-2 border border-zinc-800 hover:border-zinc-600 transition-colors"
        >
          [play game]
        </button>
      )}

      {/* GAME SELECTION MENU */}
      {gameMenuOpen && (
        <div
          className="fixed inset-0 bg-black/95 z-[100] flex flex-col items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-2xl md:text-4xl text-white font-mono mb-8 glitch" data-text="SELECT GAME">
            SELECT GAME
          </h2>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Game 1: Lightning Shooter */}
            <button
              onClick={() => {
                setGameMenuOpen(false);
                startGame();
              }}
              className="group p-6 border border-zinc-800 hover:border-red-500 transition-all bg-zinc-900/50 hover:bg-zinc-900"
            >
              <div className="text-red-500 text-lg font-mono mb-2">LIGHTNING STRIKE</div>
              <div className="text-zinc-500 text-xs mb-4">Shoot falling targets</div>
              <div className="w-32 h-32 mx-auto mb-4 relative">
                <Image src="/ep1.jpg" alt="" fill className="object-contain opacity-70 group-hover:opacity-100" unoptimized />
              </div>
              <div className="text-zinc-600 text-xs">Click/Tap to shoot</div>
            </button>

            {/* Game 2: Collector */}
            <button
              onClick={() => {
                setGameMenuOpen(false);
                startGame2();
              }}
              className="group p-6 border border-zinc-800 hover:border-green-500 transition-all bg-zinc-900/50 hover:bg-zinc-900"
            >
              <div className="text-green-500 text-lg font-mono mb-2">CIG COLLECTOR</div>
              <div className="text-zinc-500 text-xs mb-4">Collect cigs, avoid bombs</div>
              <div className="w-32 h-32 mx-auto mb-4 relative">
                <Image src="/cig.png" alt="" fill className="object-contain opacity-70 group-hover:opacity-100" />
              </div>
              <div className="text-zinc-600 text-xs">Arrow keys / A-D to move</div>
            </button>
          </div>

          <button
            onClick={() => setGameMenuOpen(false)}
            className="mt-8 text-zinc-600 hover:text-white text-sm font-mono"
          >
            [back]
          </button>
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
        <div className={`fixed inset-0 bg-black z-[100] flex flex-col cursor-none transition-transform duration-75 ${gameShake ? 'translate-x-1' : ''}`}>
          {/* Game HUD */}
          <div className="flex justify-between items-center p-4 text-green-400 font-mono">
            <div className="flex items-center gap-6">
              <div className="text-xl">SCORE: {gameScore}</div>
              {gameCombo >= 3 && (
                <div className="text-yellow-400 animate-pulse text-sm">
                  COMBO x{gameCombo} (+{Math.floor(gameCombo / 3)})
                </div>
              )}
            </div>
            <div className="flex items-center gap-4">
              {/* Lives */}
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      i < gameLives
                        ? "bg-red-500 shadow-[0_0_8px_rgba(255,0,0,0.8)]"
                        : "bg-zinc-800"
                    }`}
                  />
                ))}
              </div>
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
          </div>

          {/* Game Area */}
          <div
            className="flex-1 relative overflow-hidden cursor-none"
            onClick={(e) => {
              if (gameOver) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;
              shootTarget(x, y);
            }}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;
              setGameCrosshair({ x, y });
            }}
          >
            {/* Custom Crosshair */}
            {!gameOver && !isMobile && (
              <div
                className="absolute pointer-events-none z-50"
                style={{
                  left: `${gameCrosshair.x}%`,
                  top: `${gameCrosshair.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {/* Outer ring */}
                <div className={`w-8 h-8 border-2 border-red-500 rounded-full transition-all duration-75 ${isShooting ? 'scale-75 border-yellow-400' : ''}`}
                  style={{ boxShadow: '0 0 10px rgba(255,0,0,0.5)' }}
                />
                {/* Center dot */}
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full transition-all ${isShooting ? 'bg-yellow-400 scale-150' : 'bg-red-500'}`} />
                {/* Cross lines */}
                <div className="absolute top-1/2 left-0 w-full h-px bg-red-500/50" />
                <div className="absolute top-0 left-1/2 w-px h-full bg-red-500/50" />
              </div>
            )}

            {/* Falling Targets */}
            {gameTargets.map(target => (
              <div
                key={`target-${target.id}`}
                className="absolute transition-all duration-200"
                style={{
                  left: `${target.x}%`,
                  top: `${target.y}%`,
                  transform: "translate(-50%, -50%)",
                  opacity: target.hit ? 0 : 1,
                  scale: target.hit ? "1.5" : target.type === 'golden' ? "1.3" : "1",
                }}
              >
                {/* Target glow ring for special types */}
                {target.type !== 'normal' && !target.hit && (
                  <div
                    className="absolute inset-0 rounded-full animate-pulse"
                    style={{
                      transform: 'scale(1.5)',
                      background: target.type === 'golden'
                        ? 'radial-gradient(circle, rgba(255,215,0,0.4) 0%, transparent 70%)'
                        : 'radial-gradient(circle, rgba(0,255,255,0.4) 0%, transparent 70%)',
                    }}
                  />
                )}
                <Image
                  src="/cig.png"
                  alt=""
                  width={target.type === 'golden' ? 50 : 40}
                  height={target.type === 'golden' ? 50 : 40}
                  className={`${target.hit ? "blur-sm" : ""}`}
                  style={{
                    filter: target.type === 'golden'
                      ? 'drop-shadow(0 0 12px rgba(255,215,0,0.9)) hue-rotate(40deg) saturate(1.5)'
                      : target.type === 'fast'
                      ? 'drop-shadow(0 0 8px rgba(0,255,255,0.8)) hue-rotate(180deg)'
                      : 'drop-shadow(0 0 8px rgba(255,100,0,0.5))',
                  }}
                />
                {/* Type indicator */}
                {target.type === 'golden' && !target.hit && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-yellow-400 text-xs font-bold animate-bounce">
                    +5
                  </div>
                )}
                {target.type === 'fast' && !target.hit && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-cyan-400 text-xs">
                    FAST
                  </div>
                )}
              </div>
            ))}

            {/* Score Popups */}
            {scorePopups.map(popup => (
              <div
                key={`popup-${popup.id}`}
                className="absolute pointer-events-none font-bold text-2xl"
                style={{
                  left: `${popup.x}%`,
                  top: `${popup.y}%`,
                  color: popup.color,
                  textShadow: `0 0 10px ${popup.color}`,
                  animation: 'scorePopup 1s ease-out forwards',
                }}
              >
                +{popup.score}
              </div>
            ))}

            {/* Explosion Effects */}
            {gameExplosions.map(exp => (
              <div
                key={`explosion-${exp.id}`}
                className="absolute pointer-events-none"
                style={{
                  left: `${exp.x}%`,
                  top: `${exp.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {/* Explosion ring */}
                <div
                  className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    animation: "explosionRing 0.4s ease-out forwards",
                    borderColor: exp.color || '#ff0000',
                    borderWidth: '2px',
                    boxShadow: `0 0 20px ${exp.color || '#ff0000'}, 0 0 40px ${exp.color || '#ffd700'}`,
                  }}
                />
                {/* Explosion particles */}
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      animation: `explosionParticle${i} 0.35s ease-out forwards`,
                      backgroundColor: exp.color || '#ffd700',
                      boxShadow: `0 0 6px ${exp.color || '#ffd700'}`,
                    }}
                  />
                ))}
              </div>
            ))}

            {/* Chain Lightning Effect */}
            {chainLightning && (
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none z-40"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                {(() => {
                  const { from, to } = chainLightning;
                  const segments = 4;
                  const points: { x: number; y: number }[] = [{ x: from.x, y: from.y }];

                  for (let j = 1; j < segments; j++) {
                    const t = j / segments;
                    points.push({
                      x: from.x + (to.x - from.x) * t + (Math.random() - 0.5) * 6,
                      y: from.y + (to.y - from.y) * t + (Math.random() - 0.5) * 6,
                    });
                  }
                  points.push({ x: to.x, y: to.y });

                  const pathData = points.map((p, idx) =>
                    `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
                  ).join(' ');

                  return (
                    <>
                      <path d={pathData} fill="none" stroke="#00ffff" strokeWidth={1} vectorEffect="non-scaling-stroke"
                        style={{ filter: "drop-shadow(0 0 6px #00ffff) drop-shadow(0 0 12px #00ffff)" }} />
                      <path d={pathData} fill="none" stroke="#ffffff" strokeWidth={0.5} vectorEffect="non-scaling-stroke" />
                    </>
                  );
                })()}
              </svg>
            )}

            {/* Lightning bolt from player to click */}
            {gameLightning && (
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                {(() => {
                  const startX = 50;
                  const startY = 92;
                  const endX = gameLightning.x;
                  const endY = gameLightning.y;
                  const segments = 6;
                  const points: { x: number; y: number }[] = [{ x: startX, y: startY }];

                  for (let j = 1; j < segments; j++) {
                    const t = j / segments;
                    const baseX = startX + (endX - startX) * t;
                    const baseY = startY + (endY - startY) * t;
                    const jitter = (1 - t) * 8;
                    points.push({
                      x: baseX + (Math.random() - 0.5) * jitter,
                      y: baseY + (Math.random() - 0.5) * jitter,
                    });
                  }
                  points.push({ x: endX, y: endY });

                  const pathData = points.map((p, idx) =>
                    `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
                  ).join(' ');

                  return (
                    <>
                      <path
                        d={pathData}
                        fill="none"
                        stroke="#ff0000"
                        strokeWidth={0.8}
                        strokeLinecap="round"
                        vectorEffect="non-scaling-stroke"
                        style={{
                          filter: "drop-shadow(0 0 4px #ff0000) drop-shadow(0 0 8px #ffd700)",
                        }}
                      />
                      <path
                        d={pathData}
                        fill="none"
                        stroke="#ffd700"
                        strokeWidth={0.4}
                        strokeLinecap="round"
                        vectorEffect="non-scaling-stroke"
                      />
                    </>
                  );
                })()}
              </svg>
            )}

            {/* Player Character */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
              <div className={`relative w-28 h-28 md:w-36 md:h-36 transition-transform duration-100 ${isShooting ? "scale-110" : ""}`}>
                <Image
                  src={isShooting ? "/ep2.jpg" : "/ep1.jpg"}
                  alt=""
                  fill
                  className={`object-contain ${isShooting ? "drop-shadow-[0_0_20px_rgba(255,0,0,0.8)]" : ""}`}
                  unoptimized
                />
              </div>
            </div>

            {/* Shooting Flash Effect */}
            {isShooting && (
              <div className="absolute inset-0 pointer-events-none">
                <div
                  className="absolute inset-0"
                  style={{
                    background: `radial-gradient(circle at 50% 85%, rgba(255,0,0,0.4) 0%, transparent 40%)`,
                    animation: "flash 0.2s ease-out",
                  }}
                />
              </div>
            )}

            {/* Game Over Screen */}
            {gameOver && (
              <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-10">
                <div className="text-red-500 text-4xl md:text-6xl font-bold mb-4 glitch" data-text="GAME OVER">
                  GAME OVER
                </div>
                <div className="text-green-400 text-2xl md:text-3xl mb-2">
                  SCORE: {gameScore}
                </div>
                {gameHighScore > 0 && gameScore >= gameHighScore && (
                  <div className="text-yellow-400 text-lg mb-4 animate-pulse">
                    NEW HIGH SCORE!
                  </div>
                )}
                {gameHighScore > 0 && gameScore < gameHighScore && (
                  <div className="text-zinc-500 text-sm mb-4">
                    HIGH SCORE: {gameHighScore}
                  </div>
                )}
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startGame();
                    }}
                    className="text-green-400 hover:text-white text-lg px-6 py-2 border border-green-800 hover:border-green-400 transition-colors cursor-pointer"
                  >
                    [RETRY]
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      stopGame();
                    }}
                    className="text-zinc-500 hover:text-white text-lg px-6 py-2 border border-zinc-800 hover:border-zinc-600 transition-colors cursor-pointer"
                  >
                    [EXIT]
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Game Instructions */}
          <div className="p-4 text-center text-zinc-600 text-xs font-mono border-t border-zinc-900">
            {gameOver ? "CLICK RETRY TO PLAY AGAIN" : `${isMobile ? "TAP" : "CLICK"} TO SHOOT • DON'T LET TARGETS FALL`}
          </div>
        </div>
      )}

      {/* GAME 2 OVERLAY - COLLECTOR */}
      {game2Open && (
        <div
          className={`fixed inset-0 bg-black z-[100] flex flex-col transition-all duration-75 ${
            game2Flash === 'red' ? 'bg-red-900/50' : game2Flash === 'green' ? 'bg-green-900/30' : ''
          }`}
        >
          {/* Game 2 HUD */}
          <div className="flex justify-between items-center p-4 text-green-400 font-mono">
            <div className="text-xl">CIGS: {game2Score}</div>
            <div className="flex items-center gap-4">
              {/* Lives */}
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      i < game2Lives
                        ? "bg-green-500 shadow-[0_0_8px_rgba(0,255,0,0.8)]"
                        : "bg-zinc-800"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  stopGame2();
                }}
                className="text-zinc-500 hover:text-white text-sm px-3 py-1 border border-zinc-800 hover:border-zinc-600 cursor-pointer"
              >
                [exit]
              </button>
            </div>
          </div>

          {/* Game 2 Area */}
          <div
            className="flex-1 relative overflow-hidden"
            onTouchStart={(e) => {
              const touch = e.touches[0];
              const rect = e.currentTarget.getBoundingClientRect();
              const touchX = touch.clientX - rect.left;
              if (touchX < rect.width / 2) {
                keysPressed.current.add('left');
              } else {
                keysPressed.current.add('right');
              }
            }}
            onTouchEnd={() => {
              keysPressed.current.clear();
            }}
          >
            {/* Falling Items */}
            {game2Items.map(item => (
              <div
                key={`item2-${item.id}`}
                className="absolute transition-opacity duration-150"
                style={{
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                  transform: 'translate(-50%, -50%)',
                  opacity: item.collected ? 0 : 1,
                }}
              >
                {item.type === 'cig' ? (
                  <div className="relative">
                    <Image
                      src="/cig.png"
                      alt=""
                      width={35}
                      height={35}
                      className="drop-shadow-[0_0_8px_rgba(0,255,0,0.5)]"
                    />
                  </div>
                ) : (
                  <div className="relative w-10 h-10 flex items-center justify-center">
                    <div
                      className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-xl animate-pulse"
                      style={{
                        boxShadow: '0 0 15px rgba(255,0,0,0.8), 0 0 30px rgba(255,0,0,0.4)',
                      }}
                    >
                      💣
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Player Character */}
            <div
              className="absolute bottom-4 transition-all duration-75"
              style={{
                left: `${game2PlayerX}%`,
                transform: 'translateX(-50%)',
              }}
            >
              <div className="relative w-20 h-20 md:w-28 md:h-28">
                <Image
                  src="/ep1.jpg"
                  alt=""
                  fill
                  className="object-contain"
                  style={{
                    filter: game2Flash === 'red'
                      ? 'drop-shadow(0 0 20px rgba(255,0,0,0.9)) brightness(1.5)'
                      : game2Flash === 'green'
                      ? 'drop-shadow(0 0 15px rgba(0,255,0,0.8))'
                      : 'drop-shadow(0 0 10px rgba(0,255,0,0.3))',
                  }}
                  unoptimized
                />
              </div>
              {/* Collection zone indicator */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-green-500/30 rounded-full" />
            </div>

            {/* Game Over Screen */}
            {game2Over && (
              <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-10">
                <div className="text-red-500 text-4xl md:text-6xl font-bold mb-4 glitch" data-text="GAME OVER">
                  GAME OVER
                </div>
                <div className="text-green-400 text-2xl md:text-3xl mb-2">
                  CIGS COLLECTED: {game2Score}
                </div>
                {game2HighScore > 0 && game2Score >= game2HighScore && (
                  <div className="text-yellow-400 text-lg mb-4 animate-pulse">
                    NEW HIGH SCORE!
                  </div>
                )}
                {game2HighScore > 0 && game2Score < game2HighScore && (
                  <div className="text-zinc-500 text-sm mb-4">
                    HIGH SCORE: {game2HighScore}
                  </div>
                )}
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startGame2();
                    }}
                    className="text-green-400 hover:text-white text-lg px-6 py-2 border border-green-800 hover:border-green-400 transition-colors cursor-pointer"
                  >
                    [RETRY]
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      stopGame2();
                    }}
                    className="text-zinc-500 hover:text-white text-lg px-6 py-2 border border-zinc-800 hover:border-zinc-600 transition-colors cursor-pointer"
                  >
                    [EXIT]
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Game 2 Instructions */}
          <div className="p-4 text-center text-zinc-600 text-xs font-mono border-t border-zinc-900">
            {game2Over ? "CLICK RETRY TO PLAY AGAIN" : `${isMobile ? "TOUCH LEFT/RIGHT" : "← → or A/D"} TO MOVE • COLLECT CIGS • AVOID BOMBS`}
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect, useRef, useState, useCallback, useContext } from "react";
import { CanvasContext } from "./DraggableCanvas";

type GameMode = "pacman" | "snake";
type GamePhase = "start" | "playing" | "over" | "won";

// ─── Constants ────────────────────────────────────────────────────────────────
const GRID = 11;
const TILE = 40;
const SIZE = GRID * TILE;

// Pac-Man: how long (ms) each one-tile move takes — also controls smoothness
const PAC_TICK = 220;
const GHOST_TICK = 520;
const SNAKE_TICK = 150;

// ─── Maze ─────────────────────────────────────────────────────────────────────
const MAZE = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const isOpen = (x: number, y: number) =>
  x >= 0 && y >= 0 && x < GRID && y < GRID && MAZE[y][x] === 0;

// ─── BFS pathfinding ──────────────────────────────────────────────────────────
function bfsNext(sx: number, sy: number, tx: number, ty: number) {
  if (sx === tx && sy === ty) return { x: sx, y: sy };
  type N = { x: number; y: number; first: { x: number; y: number } | null };
  const visited = new Set([`${sx},${sy}`]);
  const q: N[] = [{ x: sx, y: sy, first: null }];
  const dirs = [
    { x: 1, y: 0 }, { x: -1, y: 0 },
    { x: 0, y: 1 }, { x: 0, y: -1 },
  ];
  while (q.length) {
    const cur = q.shift()!;
    for (const d of [...dirs].sort(() => Math.random() - 0.5)) {
      const nx = cur.x + d.x, ny = cur.y + d.y;
      const key = `${nx},${ny}`;
      if (!visited.has(key) && isOpen(nx, ny)) {
        visited.add(key);
        const first = cur.first ?? { x: nx, y: ny };
        if (nx === tx && ny === ty) return first;
        q.push({ x: nx, y: ny, first });
      }
    }
  }
  return { x: sx, y: sy };
}

// ─── Component ────────────────────────────────────────────────────────────────
const MiniGameTile = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameMode, setGameMode] = useState<GameMode>("pacman");
  const { setIsInteractingWithTile } = useContext(CanvasContext);
  const [isHovered, setIsHovered] = useState(false);
  const isHoveredRef = useRef(false);
  const rafRef = useRef<number>();

  // ── Scratch Card State ────────────────────────────────────────────────────
  const [isUnlocked, setIsUnlocked] = useState(false);
  const scratchRef = useRef<HTMLCanvasElement>(null);
  const isInteractingRef = useRef(false);
  const scratchLastPos = useRef<{ x: number; y: number } | null>(null);
  const scratchDist = useRef(0);

  // ── Phase (start / playing / over / won) ─────────────────────────────────
  const phaseRef = useRef<GamePhase>("start");
  const [, forceRender] = useState(0); // trigger re-render when phase changes

  const setPhase = (p: GamePhase) => {
    phaseRef.current = p;
    forceRender(n => n + 1);
  };

  // ── Timing ────────────────────────────────────────────────────────────────
  const lastPacTickRef = useRef(0);
  const lastGhostTickRef = useRef(0);
  const lastSnakeTickRef = useRef(0);

  // ── Snake state ───────────────────────────────────────────────────────────
  const snakeBody = useRef([{ x: 5, y: 5 }]);
  const snakeDir = useRef({ x: 0, y: 0 });
  const snakeQueued = useRef({ x: 0, y: 0 });
  const snakeFood = useRef({ x: 2, y: 3 });
  const snakeScore = useRef(0);

  // ── Pac-Man grid state ────────────────────────────────────────────────────
  const pacGrid = useRef({ x: 1, y: 1 });          // logical grid cell
  const pacPrev = useRef({ x: 1, y: 1 });          // previous grid cell
  const pacDir = useRef({ x: 0, y: 0 });
  const pacQueued = useRef({ x: 0, y: 0 });
  const pacDots = useRef<boolean[][]>([]);
  const pacScore = useRef(0);

  // Ghost — grid + prev for interpolation
  const ghostGrid = useRef({ x: 9, y: 9 });
  const ghostPrev = useRef({ x: 9, y: 9 });

  // Track when the last tick fired so we can interpolate between prev → grid
  const lastPacTickTimeRef = useRef(0);
  const lastGhostTickTimeRef = useRef(0);

  // ── Helpers ───────────────────────────────────────────────────────────────
  function spawnFood(body: { x: number; y: number }[]) {
    let nx: number, ny: number;
    do {
      nx = Math.floor(Math.random() * GRID);
      ny = Math.floor(Math.random() * GRID);
    } while (body.some(s => s.x === nx && s.y === ny));
    return { x: nx, y: ny };
  }

  // ── Scratch Logic ──────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = scratchRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    // Fill with paper-like texture
    ctx.fillStyle = "#cbd5e1"; // slate-300
    ctx.fillRect(0, 0, SIZE, SIZE);

    // Add noise
    ctx.fillStyle = "rgba(0,0,0,0.04)";
    for (let i = 0; i < 2000; i++) {
      ctx.fillRect(Math.random() * SIZE, Math.random() * SIZE, 2, 2);
    }

    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 45;
  }, []);

  const handleScratchStart = useCallback((e: React.PointerEvent) => {
    if (isUnlocked) return;
    e.stopPropagation();
    setIsInteractingWithTile(true);
    isInteractingRef.current = true;

    const canvas = scratchRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    scratchLastPos.current = { x, y };

    const ctx = canvas.getContext("2d")!;
    ctx.beginPath();
    ctx.arc(x, y, 22.5, 0, Math.PI * 2);
    ctx.fill();
  }, [isUnlocked, setIsInteractingWithTile]);

  const handleScratchMove = useCallback((e: React.PointerEvent) => {
    if (!isInteractingRef.current || isUnlocked) return;
    e.stopPropagation();
    const canvas = scratchRef.current;
    if (!canvas || !scratchLastPos.current) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const ctx = canvas.getContext("2d")!;
    ctx.beginPath();
    ctx.moveTo(scratchLastPos.current.x, scratchLastPos.current.y);
    ctx.lineTo(x, y);
    ctx.stroke();

    const dx = x - scratchLastPos.current.x;
    const dy = y - scratchLastPos.current.y;
    scratchDist.current += Math.sqrt(dx * dx + dy * dy);
    scratchLastPos.current = { x, y };

    if (scratchDist.current > 3500 && !isUnlocked) {
      setIsUnlocked(true);
      setIsInteractingWithTile(false);
      isInteractingRef.current = false;
    }
  }, [isUnlocked, setIsInteractingWithTile]);

  const handleScratchEnd = useCallback((e: React.PointerEvent) => {
    if (isUnlocked) return;
    e.stopPropagation();
    isInteractingRef.current = false;
    scratchLastPos.current = null;
    setIsInteractingWithTile(false);
  }, [isUnlocked, setIsInteractingWithTile]);

  // ── Init ──────────────────────────────────────────────────────────────────
  const initPacman = useCallback(() => {
    pacDots.current = MAZE.map((row, y) =>
      row.map((cell, x) => cell === 0 && !(x === 1 && y === 1)),
    );
    pacGrid.current = { x: 1, y: 1 };
    pacPrev.current = { x: 1, y: 1 };
    pacDir.current = { x: 0, y: 0 };
    pacQueued.current = { x: 0, y: 0 };
    pacScore.current = 0;
    ghostGrid.current = { x: 9, y: 9 };
    ghostPrev.current = { x: 9, y: 9 };
    lastPacTickRef.current = 0;
    lastGhostTickRef.current = 0;
    lastPacTickTimeRef.current = 0;
    lastGhostTickTimeRef.current = 0;
  }, []);

  const initSnake = useCallback(() => {
    snakeBody.current = [{ x: 5, y: 5 }];
    snakeDir.current = { x: 0, y: 0 };
    snakeQueued.current = { x: 0, y: 0 };
    snakeFood.current = spawnFood([{ x: 5, y: 5 }]);
    snakeScore.current = 0;
    lastSnakeTickRef.current = 0;
  }, []);

  const resetGame = useCallback(() => {
    if (gameMode === "pacman") initPacman();
    else initSnake();
    setPhase("start");
  }, [gameMode, initPacman, initSnake]);

  useEffect(() => { resetGame(); }, [gameMode]);

  useEffect(() => {
    const stop = () => {
      isInteractingRef.current = false;
    };
    window.addEventListener("pointerup", stop);
    return () => window.removeEventListener("pointerup", stop);
  }, []);

  // ── Step functions ────────────────────────────────────────────────────────
  const stepSnake = useCallback(() => {
    const q = snakeQueued.current, c = snakeDir.current;
    // commit queued dir (no 180° reverse)
    if (q.x !== 0 || q.y !== 0) {
      if (!((q.x === -c.x) || (q.y === -c.y && q.x === 0 && c.x === 0))) {
        snakeDir.current = { ...q };
      }
    }
    if (snakeDir.current.x === 0 && snakeDir.current.y === 0) return;

    const head = {
      x: snakeBody.current[0].x + snakeDir.current.x,
      y: snakeBody.current[0].y + snakeDir.current.y,
    };
    if (head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID ||
      snakeBody.current.some(s => s.x === head.x && s.y === head.y)) {
      setPhase("over"); return;
    }
    const ate = head.x === snakeFood.current.x && head.y === snakeFood.current.y;
    const next = [head, ...snakeBody.current];
    if (!ate) next.pop();
    else { snakeScore.current += 10; snakeFood.current = spawnFood(next); }
    snakeBody.current = next;
  }, []);

  const stepPacman = useCallback((now: number) => {
    // Try to commit queued turn
    const q = pacQueued.current;
    if (q.x !== 0 || q.y !== 0) {
      const tx = pacGrid.current.x + q.x, ty = pacGrid.current.y + q.y;
      if (isOpen(tx, ty)) {
        pacDir.current = { ...q };
        pacQueued.current = { x: 0, y: 0 };
      }
    }

    // Move
    const d = pacDir.current;
    if (d.x === 0 && d.y === 0) return;
    const nx = pacGrid.current.x + d.x, ny = pacGrid.current.y + d.y;
    if (!isOpen(nx, ny)) return; // wall — keep trying next tick

    pacPrev.current = { ...pacGrid.current };
    pacGrid.current = { x: nx, y: ny };
    lastPacTickTimeRef.current = now;

    if (pacDots.current[ny]?.[nx]) {
      pacDots.current[ny][nx] = false;
      pacScore.current += 10;
    }
    if (pacDots.current.every(row => row.every(v => !v))) setPhase("won");
  }, []);

  const stepGhost = useCallback((now: number) => {
    const { x: px, y: py } = pacGrid.current;
    const next = bfsNext(ghostGrid.current.x, ghostGrid.current.y, px, py);
    ghostPrev.current = { ...ghostGrid.current };
    ghostGrid.current = next;
    lastGhostTickTimeRef.current = now;

    if (next.x === px && next.y === py) setPhase("over");
  }, []);

  // ── Draw helpers ──────────────────────────────────────────────────────────
  const drawMaze = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, SIZE, SIZE);
    ctx.fillStyle = "#1a1aff";
    for (let y = 0; y < GRID; y++)
      for (let x = 0; x < GRID; x++)
        if (MAZE[y][x] === 1)
          ctx.fillRect(x * TILE + 1, y * TILE + 1, TILE - 2, TILE - 2);
  };

  // Draw start screen on top of the maze/board
  const drawStartScreen = (ctx: CanvasRenderingContext2D, mode: GameMode) => {
    ctx.fillStyle = "rgba(0,0,0,0.82)";
    ctx.fillRect(0, 0, SIZE, SIZE);

    if (mode === "pacman") {
      // Pac-Man icon
      ctx.fillStyle = "#ffe000";
      ctx.beginPath();
      ctx.arc(SIZE / 2, SIZE / 2 - 38, 22, 0.25 * Math.PI, 1.75 * Math.PI);
      ctx.lineTo(SIZE / 2, SIZE / 2 - 38);
      ctx.closePath();
      ctx.fill();
    } else {
      // Snake icon — simple 3-segment L
      ctx.fillStyle = "#4ade80";
      [[4, 5], [5, 5], [5, 6]].forEach(([gx, gy]) =>
        ctx.fillRect(gx * TILE + 8, gy * TILE + 8, TILE - 16, TILE - 16)
      );
      ctx.fillStyle = "#ff4444";
      ctx.beginPath();
      ctx.arc(7 * TILE + TILE / 2, 5 * TILE + TILE / 2, 7, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = "#fff";
    ctx.font = "bold 15px monospace";
    ctx.textAlign = "center";
    ctx.fillText(mode === "pacman" ? "PAC-MAN" : "SNAKE", SIZE / 2, SIZE / 2 + 10);

    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "12px monospace";
    ctx.fillText("Press any arrow key", SIZE / 2, SIZE / 2 + 32);
    ctx.fillText("to start", SIZE / 2, SIZE / 2 + 48);
  };

  const drawEndScreen = (ctx: CanvasRenderingContext2D, phase: GamePhase, score: number) => {
    ctx.fillStyle = "rgba(0,0,0,0.78)";
    ctx.fillRect(0, 0, SIZE, SIZE);
    if (phase === "won") {
      ctx.fillStyle = "#ffe000";
      ctx.font = "bold 22px monospace";
      ctx.textAlign = "center";
      ctx.fillText("YOU WIN!", SIZE / 2, SIZE / 2 - 14);
    } else {
      ctx.fillStyle = "#ff4444";
      ctx.font = "bold 22px monospace";
      ctx.textAlign = "center";
      ctx.fillText("GAME OVER", SIZE / 2, SIZE / 2 - 14);
    }
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.font = "12px monospace";
    ctx.fillText(`Score: ${score}`, SIZE / 2, SIZE / 2 + 8);
    ctx.fillText("Space to restart", SIZE / 2, SIZE / 2 + 26);
  };

  // Lerp a pixel position between prev and current grid cell
  const lerpPx = (prev: number, cur: number, t: number) =>
    (prev + (cur - prev) * t) * TILE + TILE / 2;

  // ── Render Pac-Man ────────────────────────────────────────────────────────
  const renderPacman = (ctx: CanvasRenderingContext2D, now: number) => {
    drawMaze(ctx);

    // Dots
    ctx.fillStyle = "#ffd700";
    for (let y = 0; y < GRID; y++)
      for (let x = 0; x < GRID; x++)
        if (pacDots.current[y]?.[x]) {
          ctx.beginPath();
          ctx.arc(x * TILE + TILE / 2, y * TILE + TILE / 2, 3, 0, Math.PI * 2);
          ctx.fill();
        }

    const phase = phaseRef.current;

    if (phase === "start") {
      // Static Pac-Man at spawn, no ghost shown
      ctx.fillStyle = "#ffe000";
      ctx.beginPath();
      ctx.arc(1 * TILE + TILE / 2, 1 * TILE + TILE / 2, TILE / 2 - 4, 0.25 * Math.PI, 1.75 * Math.PI);
      ctx.lineTo(1 * TILE + TILE / 2, 1 * TILE + TILE / 2);
      ctx.closePath();
      ctx.fill();
      drawStartScreen(ctx, "pacman");
      return;
    }

    // Interpolation factor: how far between prev and current tick (0→1)
    const pacT = Math.min(1, (now - lastPacTickTimeRef.current) / PAC_TICK);
    const ghostT = Math.min(1, (now - lastGhostTickTimeRef.current) / GHOST_TICK);

    // Ghost (interpolated)
    const gx = lerpPx(ghostPrev.current.x, ghostGrid.current.x, ghostT);
    const gy = lerpPx(ghostPrev.current.y, ghostGrid.current.y, ghostT);
    const r = TILE / 2 - 5;
    ctx.fillStyle = "#ff0000";
    ctx.beginPath();
    ctx.arc(gx, gy, r, Math.PI, 0, false);
    ctx.lineTo(gx + r, gy + r);
    const fw = (r * 2) / 3;
    ctx.arc(gx + r - fw * 0.5, gy + r, fw * 0.5, 0, Math.PI, false);
    ctx.arc(gx + r - fw * 1.5, gy + r, fw * 0.5, 0, Math.PI, false);
    ctx.arc(gx + r - fw * 2.5, gy + r, fw * 0.5, 0, Math.PI, false);
    ctx.lineTo(gx - r, gy);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.ellipse(gx - r * 0.35, gy - r * 0.15, 2.5, 3.5, 0, 0, Math.PI * 2);
    ctx.ellipse(gx + r * 0.35, gy - r * 0.15, 2.5, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#00f";
    ctx.beginPath();
    ctx.arc(gx - r * 0.35, gy - r * 0.15 + 1, 1.5, 0, Math.PI * 2);
    ctx.arc(gx + r * 0.35, gy - r * 0.15 + 1, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Pac-Man (interpolated)
    const px = lerpPx(pacPrev.current.x, pacGrid.current.x, pacT);
    const py = lerpPx(pacPrev.current.y, pacGrid.current.y, pacT);
    const mouth = 0.06 + 0.2 * Math.abs(Math.sin(now / 140));
    // Rotation from direction
    const d = pacDir.current;
    let rot = 0;
    if (d.x === -1) rot = Math.PI;
    else if (d.y === 1) rot = Math.PI / 2;
    else if (d.y === -1) rot = -Math.PI / 2;

    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(rot);
    ctx.fillStyle = "#ffe000";
    ctx.beginPath();
    ctx.arc(0, 0, TILE / 2 - 4, mouth * Math.PI, (2 - mouth) * Math.PI);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // HUD
    ctx.fillStyle = "#fff";
    ctx.font = "bold 12px monospace";
    ctx.textAlign = "left";
    ctx.fillText(`SCORE: ${pacScore.current}`, 8, 18);

    if (phase === "over") drawEndScreen(ctx, "over", pacScore.current);
    if (phase === "won") drawEndScreen(ctx, "won", pacScore.current);
  };

  // ── Render Snake ──────────────────────────────────────────────────────────
  const renderSnake = (ctx: CanvasRenderingContext2D, now: number) => {
    ctx.fillStyle = "#09110d";
    ctx.fillRect(0, 0, SIZE, SIZE);

    // Subtle grid
    ctx.strokeStyle = "rgba(255,255,255,0.03)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID; i++) {
      ctx.beginPath(); ctx.moveTo(i * TILE, 0); ctx.lineTo(i * TILE, SIZE); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * TILE); ctx.lineTo(SIZE, i * TILE); ctx.stroke();
    }
    ctx.strokeStyle = "rgba(74,222,128,0.15)";
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, SIZE - 2, SIZE - 2);

    const phase = phaseRef.current;

    if (phase === "start") {
      drawStartScreen(ctx, "snake");
      return;
    }

    // Food
    const p = 0.82 + 0.18 * Math.abs(Math.sin(now / 300));
    ctx.fillStyle = "#ff4444";
    ctx.beginPath();
    ctx.arc(
      snakeFood.current.x * TILE + TILE / 2,
      snakeFood.current.y * TILE + TILE / 2,
      (TILE / 2 - 7) * p, 0, Math.PI * 2,
    );
    ctx.fill();

    // Body
    snakeBody.current.forEach((s, i) => {
      const isHead = i === 0;
      const fade = Math.max(0.45, 1 - i / (snakeBody.current.length + 5));
      ctx.fillStyle = isHead ? `rgba(80,230,100,${fade})` : `rgba(34,180,70,${fade})`;
      ctx.beginPath();
      if (ctx.roundRect)
        ctx.roundRect(s.x * TILE + 3, s.y * TILE + 3, TILE - 6, TILE - 6, isHead ? 7 : 4);
      else
        ctx.fillRect(s.x * TILE + 3, s.y * TILE + 3, TILE - 6, TILE - 6);
      ctx.fill();
    });

    ctx.fillStyle = "#fff";
    ctx.font = "bold 12px monospace";
    ctx.textAlign = "left";
    ctx.fillText(`SCORE: ${snakeScore.current}`, 8, 18);

    if (phase === "over") drawEndScreen(ctx, "over", snakeScore.current);
  };

  // ── Game loop ─────────────────────────────────────────────────────────────
  const loop = useCallback((now: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) { rafRef.current = requestAnimationFrame(loop); return; }

    const phase = phaseRef.current;

    if (gameMode === "pacman") {
      if (!lastPacTickRef.current) lastPacTickRef.current = now;
      if (!lastGhostTickRef.current) lastGhostTickRef.current = now;

      if (phase === "playing") {
        if (now - lastPacTickRef.current >= PAC_TICK) {
          stepPacman(now);
          lastPacTickRef.current = now;
        }
        if (now - lastGhostTickRef.current >= GHOST_TICK) {
          stepGhost(now);
          lastGhostTickRef.current = now;
        }
      }
      renderPacman(ctx, now);
    } else {
      if (!lastSnakeTickRef.current) lastSnakeTickRef.current = now;

      if (phase === "playing") {
        if (now - lastSnakeTickRef.current >= SNAKE_TICK) {
          stepSnake();
          lastSnakeTickRef.current = now;
        }
      }
      renderSnake(ctx, now);
    }

    rafRef.current = requestAnimationFrame(loop);
  }, [gameMode, stepPacman, stepGhost, stepSnake]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(loop);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [loop]);

  // ── Keyboard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!isHoveredRef.current || !isUnlocked) return;
      if ([" ", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key))
        e.preventDefault();

      const phase = phaseRef.current;

      // Space: restart from over/won
      if (e.key === " " && (phase === "over" || phase === "won")) {
        resetGame(); return;
      }

      let d = { x: 0, y: 0 };
      if (e.key === "ArrowUp" || e.key === "w") d = { x: 0, y: -1 };
      else if (e.key === "ArrowDown" || e.key === "s") d = { x: 0, y: 1 };
      else if (e.key === "ArrowLeft" || e.key === "a") d = { x: -1, y: 0 };
      else if (e.key === "ArrowRight" || e.key === "d") d = { x: 1, y: 0 };
      else return;

      // Any arrow on start screen → begin playing
      if (phase === "start") setPhase("playing");

      if (gameMode === "pacman") {
        pacQueued.current = d;
      } else {
        const c = snakeDir.current;
        if (!((d.x === -c.x && c.x !== 0) || (d.y === -c.y && c.y !== 0))) {
          snakeQueued.current = d;
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [gameMode, resetGame, isUnlocked]);

  // ── JSX ───────────────────────────────────────────────────────────────────
  return (
    <div
      className="relative flex flex-col items-center select-none"
      onPointerEnter={() => {
        setIsInteractingWithTile(true);
        setIsHovered(true);
        isHoveredRef.current = true;
      }}
      onPointerLeave={() => {
        setIsInteractingWithTile(false);
        setIsHovered(false);
        isHoveredRef.current = false;
      }}
    >
      {/* Mode switcher */}
      <div
        className={`w-full flex justify-between items-center mb-2 px-1 cursor-pointer transition-opacity duration-300 ${isUnlocked ? "opacity-40 hover:opacity-100" : "opacity-0 pointer-events-none"
          }`}
        onClick={e => {
          if (!isUnlocked) return;
          e.stopPropagation();
          setGameMode(m => m === "pacman" ? "snake" : "pacman");
        }}
      >
        <span className="text-xs tracking-widest font-bold">{gameMode.toUpperCase()}</span>
        <span className="text-xs tracking-widest opacity-30 hover:underline">
          {gameMode === "pacman" ? "SNAKE" : "PAC-MAN"} ↹
        </span>
      </div>

      {/* Canvas */}
      <div
        className={`relative p-1.5 rounded-2xl shadow-inner border border-border/10 bg-gradient-to-br ${gameMode === "snake"
          ? "from-green-500/20 to-emerald-500/10"
          : "from-yellow-500/20 to-orange-500/10"
          }`}
      >
        <canvas
          ref={canvasRef}
          width={SIZE}
          height={SIZE}
          className="rounded-xl shadow-md block outline-none"
          style={{
            touchAction: "none",
            opacity: isHovered || !isUnlocked ? 1 : 0.8,
            transition: "opacity 0.2s",
          }}
        />

        {/* Scratch Overlay */}
        <canvas
          ref={scratchRef}
          width={SIZE}
          height={SIZE}
          className={`absolute top-1.5 left-1.5 rounded-xl block outline-none z-10 cursor-crosshair transition-opacity duration-1000 ${isUnlocked ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          style={{ touchAction: "none" }}
          onPointerDown={handleScratchStart}
          onPointerMove={handleScratchMove}
          onPointerUp={handleScratchEnd}
          onPointerLeave={handleScratchEnd}
          onPointerCancel={handleScratchEnd}
        />

        {/* Scratch Hint */}
        <div
          className={`absolute inset-0 flex items-center justify-center pointer-events-none z-20 transition-opacity duration-700 ${isUnlocked ? "opacity-0" : "opacity-100"}`}
        >
          <span className="text-[30px] font-bold text-black/30 tracking-[0.2em] font-heading lowercase select-none">
            scratch me
          </span>
        </div>
      </div>
    </div>
  );
};

export default MiniGameTile;
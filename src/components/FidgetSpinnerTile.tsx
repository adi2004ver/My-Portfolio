import { useEffect, useRef, useContext, useCallback } from "react";
import { CanvasContext } from "./DraggableCanvas";

const FidgetSpinnerTile = () => {
  const { setIsInteractingWithTile } = useContext(CanvasContext);
  const rotationRef = useRef(0);
  const velocityRef = useRef(0);
  const isDraggingRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const spinnerRef = useRef<SVGSVGElement>(null);
  const rafRef = useRef<number>();

  const loop = useCallback(() => {
    // Apply very low friction (99.7% retention per frame) for long-lasting spins
    if (!isDraggingRef.current) {
      velocityRef.current *= 0.997;
    }

    // Stop complete micro-rotations to save resources
    if (!isDraggingRef.current && Math.abs(velocityRef.current) < 0.05) {
      velocityRef.current = 0;
    }

    // Clamp max velocity to maintain visual stability while allowing insane speeds
    if (velocityRef.current > 80) velocityRef.current = 80;
    if (velocityRef.current < -80) velocityRef.current = -80;

    if (velocityRef.current !== 0 || isDraggingRef.current) {
      rotationRef.current += velocityRef.current;

      if (spinnerRef.current) {
        spinnerRef.current.style.transform = `rotate(${rotationRef.current}deg)`;
      }
    }

    rafRef.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [loop]);

  useEffect(() => {
    const stop = () => {
      isDraggingRef.current = false;
      lastPosRef.current = null;
    };
    window.addEventListener("pointerup", stop);
    return () => window.removeEventListener("pointerup", stop);
  }, []);
  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    isDraggingRef.current = true;
    lastPosRef.current = { x: e.clientX, y: e.clientY };
    setIsInteractingWithTile(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || !lastPosRef.current || !spinnerRef.current) return;

    e.stopPropagation();

    const rect = spinnerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const lastAngle = Math.atan2(lastPosRef.current.y - centerY, lastPosRef.current.x - centerX);
    const currAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);

    let delta = currAngle - lastAngle;

    // Normalize delta across the -PI to PI boundary
    if (delta > Math.PI) delta -= Math.PI * 2;
    if (delta < -Math.PI) delta += Math.PI * 2;

    // Convert radians to degrees for velocity
    // Increased multiplier for extremely fast flick spin building
    velocityRef.current = delta * (180 / Math.PI) * 3.5;

    // We update rotation locally here so drag follows finger precisely
    rotationRef.current += delta * (180 / Math.PI);
    if (spinnerRef.current) {
      spinnerRef.current.style.transform = `rotate(${rotationRef.current}deg)`;
    }

    lastPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    e.stopPropagation();
    isDraggingRef.current = false;
    lastPosRef.current = null;
    setIsInteractingWithTile(false);
  };

  return (
    <div
      className="w-full h-full relative cursor-grab active:cursor-grabbing touch-none flex items-center justify-center p-2 rounded-full"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <div className="flex items-center justify-center w-full h-full relative pointer-events-none">
        <svg
          ref={spinnerRef}
          viewBox="0 0 100 100"
          className="w-full h-full text-yellow-400 drop-shadow-xl origin-center"
          style={{ willChange: "transform" }}
        >
          {/* Central bearing */}
          <circle cx="50" cy="50" r="14" fill="currentColor" />
          <circle cx="50" cy="50" r="5" fill="var(--background)" />
          {/* Lobe 1 (Top) */}
          <circle cx="50" cy="18" r="18" fill="currentColor" />
          <circle cx="50" cy="18" r="8" fill="var(--background)" />
          {/* Lobe 2 (Bottom Right) */}
          <circle cx="77.7" cy="66" r="18" fill="currentColor" />
          <circle cx="77.7" cy="66" r="8" fill="var(--background)" />
          {/* Lobe 3 (Bottom Left) */}
          <circle cx="22.3" cy="66" r="18" fill="currentColor" />
          <circle cx="22.3" cy="66" r="8" fill="var(--background)" />
        </svg>
      </div>
    </div>
  );
};

export default FidgetSpinnerTile;

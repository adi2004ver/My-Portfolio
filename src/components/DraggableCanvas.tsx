import { useState, useRef, useEffect, ReactNode, useCallback, useMemo, createContext } from "react";
import { motion, useMotionValue, useSpring, PanInfo } from "framer-motion";

export const CanvasContext = createContext({
  setIsInteractingWithTile: (_value: boolean) => { }
});
import { useIsMobile } from "@/hooks/use-mobile";

interface DraggableCanvasProps {
  children: ReactNode;
  width?: number;
  height?: number;
  initialFocus?: { x: number; y: number };
}

const DraggableCanvas = ({
  children,
  width = 2200,
  height = 1700,
  initialFocus,
}: DraggableCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingCanvas = useRef(false);
  const [showHint, setShowHint] = useState(true);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const isMobile = useIsMobile();

  // Mobile: scale down the canvas
  const scale = isMobile ? 0.7 : 1;
  const scaledW = width * scale;
  const scaledH = height * scale;

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const bounds = useMemo(() => {
    const xPad = 720; // Decreased by ~10%
    const yPad = 400; // Increased by ~20%
    const xBounds =
      viewportSize.width >= scaledW
        ? { min: (viewportSize.width - scaledW) / 2, max: (viewportSize.width - scaledW) / 2 }
        : { min: -(scaledW - viewportSize.width) - xPad, max: xPad };

    const yBounds =
      viewportSize.height >= scaledH
        ? { min: (viewportSize.height - scaledH) / 2, max: (viewportSize.height - scaledH) / 2 }
        : { min: -(scaledH - viewportSize.height) - yPad, max: yPad };

    return { minX: xBounds.min, maxX: xBounds.max, minY: yBounds.min, maxY: yBounds.max };
  }, [scaledH, scaledW, viewportSize.height, viewportSize.width]);

  // Edge fade state
  const [edgeFade, setEdgeFade] = useState({ top: 0, bottom: 0, left: 0, right: 0 });
  const [isInteractingWithTile, setIsInteractingWithTile] = useState(false);

  const updateEdgeFade = useCallback(() => {
    const cx = x.get();
    const cy = y.get();
    const threshold = 120;
    const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

    setEdgeFade({
      top: clamp01((cy - bounds.minY) / threshold),    // near top edge when cy close to minY
      bottom: clamp01((bounds.maxY - cy) / threshold) < 0.3 ? 1 - clamp01((bounds.maxY - cy) / threshold) / 0.3 : 0,
      left: clamp01(1 - (cx - bounds.minX) / threshold),
      right: clamp01(1 - (bounds.maxX - cx) / threshold),
    });
  }, [bounds, x, y]);

  useEffect(() => {
    const updateViewport = () => {
      setViewportSize({ width: window.innerWidth, height: window.innerHeight });
    };
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  const getClampedPosition = useCallback(
    (targetX: number, targetY: number) => ({
      x: Math.max(bounds.minX, Math.min(bounds.maxX, targetX)),
      y: Math.max(bounds.minY, Math.min(bounds.maxY, targetY)),
    }),
    [bounds]
  );

  useEffect(() => {
    if (viewportSize.width > 0 && viewportSize.height > 0) {
      const focusX = (initialFocus?.x ?? width / 2) * scale;
      const focusY = (initialFocus?.y ?? height / 2) * scale;
      const clamped = getClampedPosition(
        -(focusX - viewportSize.width / 2),
        -(focusY - viewportSize.height / 2)
      );
      x.set(clamped.x);
      y.set(clamped.y);
    }
  }, [getClampedPosition, height, initialFocus, viewportSize, width, x, y, scale]);

  const handleDrag = (_: any, info: PanInfo) => {
    const clamped = getClampedPosition(x.get() + info.delta.x, y.get() + info.delta.y);
    x.set(clamped.x);
    y.set(clamped.y);
    updateEdgeFade();
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      if (isDraggingCanvas.current) return; // Pointer priority: ignore scroll if dragging
      setShowHint(false);

      const modeFactor = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? viewportSize.height || 1 : 1;
      const wheelScale = 1.0;

      const rawDeltaX = event.deltaX * modeFactor * wheelScale;
      const rawDeltaY = event.deltaY * modeFactor * wheelScale;

      // Clamp large deltas for smooth, consistent scroll
      const deltaX = Math.max(-50, Math.min(50, rawDeltaX));
      const deltaY = Math.max(-50, Math.min(50, rawDeltaY));

      const nextX = x.get() - deltaX;
      const nextY = y.get() - deltaY;
      const clamped = getClampedPosition(nextX, nextY);

      x.set(clamped.x);
      y.set(clamped.y);
      updateEdgeFade();
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [getClampedPosition, updateEdgeFade, viewportSize.height, x, y]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden touch-none"
    >
      <motion.div
        className="absolute origin-top-left"
        style={{ x, y, width, height, scale }}
        drag={!isInteractingWithTile}
        dragMomentum={false}
        dragElastic={0}
        onDragStart={() => {
          setShowHint(false);
          isDraggingCanvas.current = true;
        }}
        onDragEnd={() => {
          isDraggingCanvas.current = false;
        }}
        onDrag={handleDrag}
        dragConstraints={{ left: bounds.minX, right: bounds.maxX, top: bounds.minY, bottom: bounds.maxY }}
      >
        <CanvasContext.Provider value={{ setIsInteractingWithTile }}>
          {children}
        </CanvasContext.Provider>
      </motion.div>

      {/* Edge fade indicators */}
      <div className="pointer-events-none absolute inset-0 z-30">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary/30 transition-opacity duration-300" style={{ opacity: edgeFade.top > 0 ? 0.6 : 0 }} />
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-primary/30 transition-opacity duration-300" style={{ opacity: edgeFade.bottom > 0 ? 0.6 : 0 }} />
        <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-primary/30 transition-opacity duration-300" style={{ opacity: edgeFade.left > 0 ? 0.6 : 0 }} />
        <div className="absolute top-0 right-0 bottom-0 w-1.5 bg-primary/30 transition-opacity duration-300" style={{ opacity: edgeFade.right > 0 ? 0.6 : 0 }} />
      </div>
    </div>
  );
};

export default DraggableCanvas;

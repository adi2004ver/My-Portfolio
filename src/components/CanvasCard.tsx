import { motion } from "framer-motion";
import { ReactNode, useRef, useContext } from "react";
import { cn } from "@/lib/utils";
import { CanvasContext } from "./DraggableCanvas";

interface CanvasCardProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  rotation?: number;
  variant?: "card" | "polaroid" | "sticker" | "note";
  onClick?: () => void;
}

const CanvasCard = ({ 
  children, 
  className, 
  style, 
  rotation = 0,
  variant = "card",
  onClick
}: CanvasCardProps) => {
  const { setIsInteractingWithTile } = useContext(CanvasContext);
  const entranceDelay = useRef(Math.random() * 0.3);
  const floatDelay = useRef(Math.random() * 2.2);
  const baseStyles = {
    card: "bg-card text-card-foreground rounded-2xl shadow-2xl border border-border/30",
    polaroid: "bg-white p-2 pb-6 shadow-xl rounded-sm",
    sticker: "bg-gradient-to-br from-accent/90 to-accent rounded-xl shadow-lg px-4 py-3 text-accent-foreground",
    note: "bg-yellow-100 dark:bg-yellow-200 p-4 shadow-md text-yellow-900 font-medium rounded-sm rotate-1",
  };

  return (
    <motion.div
      className={cn(
        "absolute select-none",
        baseStyles[variant],
        onClick && "cursor-pointer",
        className
      )}
      style={{
        ...style,
        rotate: rotation,
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        opacity: { duration: 0.45, delay: entranceDelay.current },
        scale: { duration: 0.45, delay: entranceDelay.current },
      }}
      whileHover={{ 
        scale: 1.02, 
        zIndex: 50,
        transition: { duration: 0.2 } 
      }}
      onClick={onClick}
      onPointerEnter={() => setIsInteractingWithTile(true)}
      onPointerLeave={() => setIsInteractingWithTile(false)}
      onPointerDown={(e) => {
        setIsInteractingWithTile(true);
        if (onClick) e.stopPropagation();
      }}
    >
      {children}
    </motion.div>
  );
};

export default CanvasCard;

import { useContext } from "react";
import { CanvasContext } from "./DraggableCanvas";

const DrawTile = () => {
  const { setIsInteractingWithTile } = useContext(CanvasContext);

  return (
    <textarea
      className="w-full h-full resize-none p-6 bg-transparent border-none outline-none text-gray-900 text-lg leading-relaxed placeholder:text-gray-800/60 font-sans focus:ring-0 font-medium"
      placeholder="Start typing your notes here..."
      onFocus={() => setIsInteractingWithTile(true)}
      onBlur={() => setIsInteractingWithTile(false)}
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    />
  );
};

export default DrawTile;

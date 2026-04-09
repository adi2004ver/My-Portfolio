import { motion } from "framer-motion";

const Sticker = ({ src, left, top, rotation, size }) => {
  return (
    <motion.img
      src={src}
      alt="sticker"
      className="absolute select-none pointer-events-none drop-shadow-[0_10px_20px_rgba(0,0,0,0.25)]"
      style={{
        left,
        top,
        width: size,
        transform: `rotate(${rotation}deg)`,
      }}
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 4, repeat: Infinity }}
    />
  );
};

export default Sticker;
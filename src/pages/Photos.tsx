import { motion } from "framer-motion";
import { photos } from "@/data/photos";

const Photos = () => (
  <div className="min-h-screen bg-background">
    <main className="pt-4 pb-28 px-[2px]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="columns-2 sm:columns-3 md:columns-4 gap-[4px] space-y-[4px]"
      >
        {photos.map((src, i) => (
          <motion.img
            key={`${src}-${i}`}
            src={src}
            alt={`Photo ${i + 1}`}
            loading="lazy"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.02 }}
            className="w-full mb-[4px] break-inside-avoid object-cover"
          />
        ))}
      </motion.div>
    </main>
  </div>
);

export default Photos;
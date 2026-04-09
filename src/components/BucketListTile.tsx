import { motion } from "framer-motion";
import { certifications } from "@/data/profile";

const BucketListTile = () => (
  <div className="p-1">
    <p className="text-sm font-bold text-foreground font-heading mb-4 lowercase tracking-wide">
      certifications
    </p>
    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-muted">
      {certifications.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="flex items-start leading-tight"
        >
          <span className="text-[12px] text-muted-foreground font-medium">
            • {item.title} <span className="opacity-70">({item.provider})</span>
          </span>
        </motion.div>
      ))}
    </div>
  </div>
);

export default BucketListTile;

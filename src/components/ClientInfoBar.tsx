import { Monitor, Clock } from "lucide-react";
import { useClientInfo } from "@/hooks/use-client-info";
import { motion } from "framer-motion";

const ClientInfoBar = () => {
  const { browser, os, time } = useClientInfo();

  if (!browser) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="flex items-center justify-center gap-4 text-xs text-muted-foreground/80 py-3 px-4"
    >
      <div className="flex items-center gap-1.5">
        <Monitor className="w-3 h-3" />
        <span>{browser} on {os}</span>
      </div>
      <div className="w-px h-3 bg-border" />
      <div className="flex items-center gap-1.5">
        <Clock className="w-3 h-3" />
        <span>{time}</span>
      </div>
    </motion.div>
  );
};

export default ClientInfoBar;

import { Home, FolderOpen, Sparkles, Camera, Mail, Moon, Sun, Volume2, VolumeX } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "@/hooks/use-theme";
import { useSound } from "@/hooks/use-sound";
import { useAltName } from "@/hooks/use-alt-name";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: FolderOpen, label: "Projects", path: "/projects" },
  { icon: Sparkles, label: "Beyond Work", path: "/beyond-work" },
  { icon: Camera, label: "Photos", path: "/photos" },
  { icon: Mail, label: "Contact", path: "/contact" },
];

const NavigationDock = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { soundEnabled, toggleSound, playClick } = useSound();
  const { isAltName, toggleAltName } = useAltName();

  const handleNavClick = (path: string) => {
    playClick();
    navigate(path);
  };

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
      style={{ left: "50%", x: "-50%" }}
      className="fixed bottom-4 sm:bottom-6 z-50 w-fit"
    >
      <div className="nav-dock flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-2xl whitespace-nowrap">
        {navItems.map((baseItem) => {
          const item = { ...baseItem };
          if (item.path === "/beyond-work") {
            item.label = isAltName ? "Side Quests" : "Beyond Work";
          }
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => {
                if (item.path === "/beyond-work") {
                  toggleAltName();
                }
                handleNavClick(item.path);
              }}
              className={cn(
                "nav-button flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                isActive
                  ? "bg-card-foreground text-card shadow-sm"
                  : "text-muted-foreground hover:text-card-foreground hover:bg-muted/60"
              )}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
              title={item.label}
            >
              <Icon className="w-4 h-4" />
              {isActive && (
                <motion.span
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "auto", opacity: 1 }}
                  className="text-xs font-medium hidden sm:inline overflow-hidden whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </button>
          );
        })}

        <div className="w-px h-6 bg-border mx-1 sm:mx-1.5" />

        <button
          onClick={() => { playClick(); toggleTheme(); }}
          className="nav-button flex items-center justify-center p-2 rounded-xl text-muted-foreground hover:text-card-foreground hover:bg-muted/60 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          title={theme === "dark" ? "Light mode" : "Dark mode"}
        >
          <motion.div initial={false} animate={{ rotate: theme === "dark" ? 180 : 0 }} transition={{ duration: 0.3 }}>
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </motion.div>
        </button>

        <button
          onClick={toggleSound}
          className={cn(
            "nav-button flex items-center justify-center p-2 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            soundEnabled
              ? "text-muted-foreground hover:text-card-foreground hover:bg-muted/60"
              : "text-muted-foreground/50 hover:text-muted-foreground hover:bg-muted/40"
          )}
          aria-label={soundEnabled ? "Mute interface sounds" : "Enable interface sounds"}
          title={soundEnabled ? "Mute sounds" : "Enable sounds"}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>
    </motion.nav>
  );
};

export default NavigationDock;

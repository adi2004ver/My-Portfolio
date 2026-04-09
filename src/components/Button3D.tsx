import { forwardRef, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useSound } from "@/hooks/use-sound";

interface Button3DProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button3D = forwardRef<HTMLButtonElement, Button3DProps>(
  ({ className, children, variant = "default", size = "md", onClick, ...props }, ref) => {
    const { playClick } = useSound();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      playClick();
      onClick?.(e);
    };

    const sizeClasses = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
    };

    const variantClasses = {
      default: "bg-card text-card-foreground border-border shadow-[0_4px_0_0_hsl(var(--border))] hover:shadow-[0_2px_0_0_hsl(var(--border))] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px]",
      outline: "bg-transparent text-foreground border-2 border-current shadow-[0_4px_0_0_currentColor] hover:shadow-[0_2px_0_0_currentColor] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px]",
      ghost: "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-100 ease-out border select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-60 disabled:cursor-not-allowed",
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        type={props.type ?? "button"}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button3D.displayName = "Button3D";

export default Button3D;

import { cn } from "@/lib/utils";
// Served from /public with a stable URL so index.html can `<link rel="preload">` it as the LCP element.
const bitcoinLogo = "/bitcoin-logo.png";

interface AnimatedBrandLogoProps {
  variant?: "full" | "compact" | "icon";
  size?: "sm" | "md" | "lg";
  className?: string;
  showText?: boolean;
  animated?: boolean;
}

export const AnimatedBrandLogo = ({ 
  variant = "full", 
  size = "md", 
  className,
  showText = true,
  animated = true
}: AnimatedBrandLogoProps) => {
  const sizeConfig = {
    sm: { container: "w-8 h-8", icon: "w-4 h-4", title: "text-[15px]", subtitle: "text-[9px]" },
    md: { container: "w-10 h-10", icon: "w-5 h-5", title: "text-base", subtitle: "text-[10px]" },
    lg: { container: "w-12 h-12", icon: "w-6 h-6", title: "text-lg", subtitle: "text-xs" }
  };

  const config = sizeConfig[size];

  return (
    <div 
      className={cn(
        "flex items-center gap-2.5 select-none group",
        className
      )}
    >
      {/* Brand Logo Mark — identical treatment across full / compact / icon variants */}
      <div className={cn(
        "relative flex items-center justify-center shrink-0 rounded-xl p-0.5 transition-all duration-500",
        animated && "group-hover:scale-[1.05]",
        config.container
      )}>
        <img
          src={bitcoinLogo}
          alt="Bitcoin Calculator logo"
          className="w-full h-full object-contain block"
          loading="eager"
          decoding="async"
        />
      </div>

      {/* Clean Typography */}
      {showText && variant !== "icon" && (
        <div className="flex flex-col leading-none">
          <span className={cn(
            "font-semibold tracking-[-0.02em] text-foreground",
            config.title
          )}>
            Bitcoin<span className="font-normal text-foreground/60 ml-1">Calculator</span>
          </span>
          {variant === "full" && (
            <span className={cn(
              "font-semibold tracking-[0.15em] uppercase text-foreground mt-0.5",
              config.subtitle
            )}>
              Tools
            </span>
          )}
        </div>
      )}
    </div>
  );
};

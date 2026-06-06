import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, TrendingUp, Shield, Zap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { useIntersectionAnimation } from "@/hooks/useIntersectionAnimation";
import { useLiveBitcoinPrice } from "@/hooks/useLiveBitcoinPrice";
import { useNumberCounter } from "@/hooks/useNumberCounter";

export const ProfessionalHeroSection = () => {
  const { t } = useLanguage();
  const { ref, isVisible } = useIntersectionAnimation({ threshold: 0.1 });
  const { price, priceChangePercentage24h, isLoading } = useLiveBitcoinPrice('USD');
  const calculatorCount = useNumberCounter({ end: 45, duration: 2000, isActive: isVisible });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const isPositive = priceChangePercentage24h >= 0;

  return (
    <section
      ref={ref}
      className="relative flex items-center justify-center overflow-hidden"
      style={{
        background: 'var(--gradient-hero-mesh)'
      }}
      role="banner"
      aria-labelledby="hero-title">

      {/* Animated Gradient Mesh Background - Subtle & Performant
          Mobile mesh shrunk from 250/200 → 180/150 to cut paint cost on low-end GPUs.
          motion-safe: gates the float animation for reduced-motion users. */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute top-[20%] left-[40%] w-[180px] h-[180px] md:w-[500px] md:h-[500px] rounded-full opacity-30 blur-xl md:blur-3xl motion-safe:animate-float-gentle transform-gpu will-change-transform"
          style={{
            background: 'radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)',
            animationDuration: '20s'
          }} />

        <div
          className="absolute top-0 right-[20%] w-[150px] h-[150px] md:w-[400px] md:h-[400px] rounded-full opacity-20 blur-xl md:blur-3xl motion-safe:animate-float transform-gpu will-change-transform"
          style={{
            background: 'radial-gradient(circle, hsl(var(--accent)) 0%, transparent 70%)',
            animationDuration: '25s',
            animationDelay: '5s'
          }} />

      </div>
      
      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-5 sm:px-6 pt-24 sm:pt-28 md:pt-32 pb-10 md:pb-12">
        <div className="max-w-5xl mx-auto">
          {/* Compact Live Price Badge */}
          <div className="flex justify-center mb-5 sm:mb-8 md:mb-10 motion-safe:animate-fade-in">
            <Badge
              variant="outline"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-card/60 backdrop-blur-xl border-border/50 shadow-sm hover:bg-card/80 hover:border-primary/30 hover:shadow-md transition-all max-w-[92vw]">

              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse shrink-0" />
                <span className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wide">Live BTC</span>
              </div>
              <div className="h-3.5 sm:h-4 w-px bg-border/50" />
              <span className="text-xs sm:text-sm font-mono font-bold text-foreground">
                {isLoading ? '...' : formatPrice(price)}
              </span>
              {!isLoading &&
              <span className={`text-[10px] sm:text-xs font-medium ${isPositive ? 'text-success' : 'text-destructive'}`}>
                  {isPositive ? '+' : ''}{priceChangePercentage24h.toFixed(1)}%
                </span>
              }
            </Badge>
          </div>

          {/* Hero Headline - Tighter, Bolder, Premium */}
          <div className="text-center mb-7 sm:mb-8 md:mb-10 space-y-4 sm:space-y-6 motion-safe:animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h1
              id="hero-title"
              className="text-[2rem] leading-[1.15] sm:text-display-lg md:text-display-xl lg:text-display-2xl sm:leading-[1.1] font-bold text-foreground tracking-tight px-1">

              Free Bitcoin Calculators
              <br />
              That Get You{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">
                  Results
                </span>
                {/* Glow Effect */}
                <span
                  className="absolute inset-0 blur-2xl opacity-20 bg-gradient-to-r from-primary via-primary-glow to-primary"
                  aria-hidden="true" />

              </span>
            </h1>
            
            {/* Refined Subtitle - Larger, Better Contrast */}
            <p className="text-[15px] sm:text-body-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2 sm:px-0">Calculate Bitcoin profit, DCA returns, retirement projections and investment growth free, instant, no signup required.

            </p>
          </div>

          {/* Trust Benefits — wraps cleanly on 320–360px; vertical dividers hidden on xs and replaced by gap spacing. */}
          <div
            className="flex items-center justify-center gap-x-3 gap-y-2 sm:gap-x-4 md:gap-x-6 mb-6 flex-wrap motion-safe:animate-fade-in"
            style={{ animationDelay: '0.2s' }}
          >
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-success" />
              <span className="font-semibold text-foreground">100% Free</span>
            </div>
            <div className="hidden sm:block w-px h-3.5 sm:h-4 bg-border" aria-hidden="true" />
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent" aria-hidden="true" />
              <span className="font-semibold text-foreground">No Signup</span>
            </div>
            <div className="hidden sm:block w-px h-3.5 sm:h-4 bg-border" aria-hidden="true" />
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" aria-hidden="true" />
              <span className="font-semibold text-foreground">Real-Time Data</span>
            </div>
          </div>

          {/* Scrolling Trust Metrics Marquee — decorative; key facts already announced above.
              Replaced framer-motion with a Tailwind motion-safe fade so we can drop the dep. */}
          <div
            className="relative mb-8 md:mb-10 max-w-xl sm:max-w-2xl mx-auto overflow-hidden space-y-2 motion-safe:animate-fade-in"
            style={{ animationDelay: '0.25s' }}
            aria-hidden="true"
          >
            {/* Fade edges — wider on mobile so pills dissolve cleanly instead of getting clipped */}
            <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-20 bg-gradient-to-r from-background via-background/90 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-20 bg-gradient-to-l from-background via-background/90 to-transparent z-10 pointer-events-none" />

            {/* Row 1 — scrolls left */}
            <div className="flex gap-2.5 animate-marquee-left">
              {[...Array(2)].map((_, setIndex) => (
                <div key={setIndex} className="flex gap-2.5 shrink-0">
                  {[
                    { icon: <TrendingUp className="w-3 h-3 text-primary" />, text: `${calculatorCount}+ Calculators` },
                    { icon: <Shield className="w-3 h-3 text-accent" />, text: "99.9% Accuracy" },
                    { icon: <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />, text: "30s Live Updates" },
                    { icon: <Zap className="w-3 h-3 text-primary" />, text: "Instant Results" },
                    { icon: <Shield className="w-3 h-3 text-accent" />, text: "No Data Collection" },
                    { icon: <TrendingUp className="w-3 h-3 text-primary" />, text: "Real-Time Prices" },
                  ].map((item, i) => (
                    <div
                      key={`l-${setIndex}-${i}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card/30 backdrop-blur-sm border border-border/15 whitespace-nowrap"
                    >
                      {item.icon}
                      <span className="text-[11px] font-medium text-muted-foreground">{item.text}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Row 2 — scrolls right (unique items) */}
            <div className="flex gap-2.5 animate-marquee-right">
              {[...Array(2)].map((_, setIndex) => (
                <div key={setIndex} className="flex gap-2.5 shrink-0">
                  {[
                    { icon: <Zap className="w-3 h-3 text-accent" />, text: "100% Free Forever" },
                    { icon: <Shield className="w-3 h-3 text-primary" />, text: "No Signup Required" },
                    { icon: <TrendingUp className="w-3 h-3 text-accent" />, text: "Historical Data Since 2013" },
                    { icon: <div className="w-1.5 h-1.5 bg-primary rounded-full" />, text: "Browser-Only Processing" },
                    { icon: <Zap className="w-3 h-3 text-primary" />, text: "CoinGecko Verified" },
                    { icon: <Shield className="w-3 h-3 text-accent" />, text: "Zero Tracking" },
                  ].map((item, i) => (
                    <div
                      key={`r-${setIndex}-${i}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card/30 backdrop-blur-sm border border-border/15 whitespace-nowrap"
                    >
                      {item.icon}
                      <span className="text-[11px] font-medium text-muted-foreground">{item.text}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Primary CTA - Gradient Border Glow */}
          <div className="flex flex-col items-center gap-4 motion-safe:animate-fade-in px-3 sm:px-2" style={{ animationDelay: '0.3s' }}>
            <div className="relative group w-full sm:w-auto max-w-sm mx-1">
              {/* Glow layer — mx-1 wrapper prevents -inset-[1px] blur from clipping focus ring on <400px viewports */}
              <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-primary via-accent to-primary opacity-60 blur-sm group-hover:opacity-90 group-hover:blur-md transition-all duration-500" />
              <Button
                size="xl"
                className="relative w-full sm:w-auto min-h-[52px] bg-foreground text-background hover:bg-foreground/90 shadow-lg transition-all duration-300 rounded-xl"
                asChild>
                <Link to="/calculators">
                  <span className="flex items-center justify-center gap-2">
                    Start Free Calculations
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>);

};

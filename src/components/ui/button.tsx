import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "btn-press inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ember))] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:transform-none touch-manipulation [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[hsl(var(--ink))] text-[hsl(var(--surface-paper))] hover:bg-[hsl(var(--ink))]/90 shadow-[0_10px_28px_-14px_hsl(0_0%_0%/0.45)] hover:shadow-[0_14px_36px_-14px_hsl(0_0%_0%/0.55)]",
        ember: "bg-[hsl(var(--ember))] text-white hover:bg-[hsl(var(--ember))]/92 shadow-[0_10px_28px_-12px_hsl(13_79%_45%/0.55)] hover:shadow-[0_16px_40px_-14px_hsl(13_79%_45%/0.7)]",
        secondary: "bg-[hsl(var(--surface-warm))] text-foreground hover:bg-[hsl(var(--surface-warm))]/70 border border-[hsl(var(--hairline))]",
        ghost: "hover:bg-[hsl(var(--muted))] hover:text-foreground rounded-lg",
        outline: "border border-[hsl(var(--hairline))] bg-transparent text-foreground hover:bg-[hsl(var(--muted))]/60"
      },
      size: {
        default: "h-11 px-5 py-2 min-h-[44px]",
        sm: "h-9 px-4 min-h-[40px] text-[13px]",
        lg: "h-12 px-7 min-h-[48px] text-base",
        xl: "h-[52px] px-9 min-h-[52px] text-base font-semibold",
        icon: "h-10 w-10 min-h-[44px] min-w-[44px]",
        "icon-sm": "h-8 w-8 min-h-[36px] min-w-[36px]",
        "icon-lg": "h-12 w-12 min-h-[52px] min-w-[52px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";
import { cn } from "../../lib/utils";

// Minimal, tokenized badge variants (dark theme)
const badgeVariants = cva(
  "inline-flex items-center rounded-[6px] border px-2.5 py-0.5 text-xs font-semibold focus:outline-none",
  {
    variants: {
      variant: {
        // Default grayscale style
        subtle: "border-[#4F4F59] bg-[#191921] text-white",
        outline: "border-[#4F4F59] bg-transparent text-white",
        // Semantic accents
        success: "border-[#1d3b2d] bg-[#0b3d2c] text-[#8AF0C6]",
        warning: "border-[#3f3419] bg-[#3a2e14] text-[#FFE28A]",
        danger: "border-[#3f1e22] bg-[#3a161b] text-[#FFABBA]",
        info: "border-[#24324a] bg-[#1a2233] text-[#A7C5FF]",
      },
    },
    defaultVariants: {
      variant: "subtle",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

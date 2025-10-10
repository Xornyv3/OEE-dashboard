import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";
import { cn } from "../../lib/utils";

// Minimal, tokenized badge variants (dark theme)
const badgeVariants = cva(
  "inline-flex items-center rounded-[6px] border px-2.5 py-0.5 text-xs font-semibold focus:outline-none",
  {
    variants: {
      variant: {
        // All variants use dark-neutral style to keep UI grayscale
        subtle: "border-[#4F4F59] bg-[#191921] text-white",
        info: "border-[#4F4F59] bg-[#191921] text-white",
        success: "border-[#4F4F59] bg-[#191921] text-white",
        warning: "border-[#4F4F59] bg-[#191921] text-white",
        danger: "border-[#4F4F59] bg-[#191921] text-white",
        outline: "border-[#4F4F59] bg-transparent text-white",
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

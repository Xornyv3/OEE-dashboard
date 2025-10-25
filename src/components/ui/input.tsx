import * as React from "react";
import { cn } from "../../lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-[6px] border border-[#4F4F59] bg-[#151518] px-4 py-2 text-base text-white placeholder:text-[#9B9BA6] focus-visible:outline-none focus-visible:border-action-interactiveBlue focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-[#146EF5]/30 data-[accent=green]:focus-visible:border-[#05C168] data-[accent=green]:focus-visible:ring-[#05C168]/30 data-[accent=yellow]:focus-visible:border-[#FF9E2C] data-[accent=yellow]:focus-visible:ring-[#FF9E2C]/30 data-[accent=red]:focus-visible:border-[#FF5A65] data-[accent=red]:focus-visible:ring-[#FF5A65]/30 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };

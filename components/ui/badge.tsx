import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "doto inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] leading-none transition-colors",
  {
    variants: {
      variant: {
        default: "border-line bg-surface-2/80 text-fg-muted backdrop-blur-sm",
        accent: "border-transparent bg-accent text-accent-fg",
        outline: "border-line-strong bg-transparent text-fg-muted",
        progress: "border-accent/35 bg-accent/10 text-accent-hi",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };

import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "neutral" | "terracotta" | "sage" | "amber" | "outline";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "neutral",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  const baseStyles = "inline-flex items-center font-medium rounded-full select-none";

  const variants = {
    neutral: "bg-ceramic-200 text-charcoal-800",
    terracotta: "bg-terracotta-100 text-terracotta-800 border border-terracotta-200",
    sage: "bg-sage-100 text-sage-800 border border-sage-200",
    amber: "bg-amber-100 text-amber-900 border border-amber-200",
    outline: "border border-ceramic-300 text-charcoal-700 bg-transparent",
  };

  const sizes = {
    sm: "text-[11px] px-2 py-0.5 gap-1",
    md: "text-xs px-2.5 py-1 gap-1.5",
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
}

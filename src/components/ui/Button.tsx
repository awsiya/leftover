import React, { forwardRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "terracotta";
  size?: "sm" | "md" | "lg";
  href?: string;
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", href, children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-colors duration-150 rounded-editorial focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none";

    const variants = {
      primary:
        "bg-terracotta-500 text-white hover:bg-terracotta-600 active:bg-terracotta-700 shadow-subtle",
      terracotta:
        "bg-terracotta-600 text-white hover:bg-terracotta-700 active:bg-terracotta-800 shadow-subtle",
      secondary:
        "bg-charcoal-900 text-ceramic-50 hover:bg-charcoal-800 active:bg-charcoal-950 shadow-subtle",
      outline:
        "border border-ceramic-300 bg-ceramic-50/80 text-charcoal-800 hover:bg-ceramic-100 hover:border-ceramic-400 active:bg-ceramic-200",
      ghost:
        "text-charcoal-700 hover:bg-ceramic-200/60 hover:text-charcoal-950 active:bg-ceramic-200",
    };

    const sizes = {
      sm: "text-xs px-3 py-1.5 gap-1.5",
      md: "text-sm px-4 py-2 gap-2",
      lg: "text-base px-6 py-3 gap-2.5",
    };

    const combinedClassName = cn(baseStyles, variants[variant], sizes[size], className);

    if (href) {
      return (
        <Link href={href} className={combinedClassName}>
          {children}
        </Link>
      );
    }

    return (
      <button ref={ref} className={combinedClassName} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

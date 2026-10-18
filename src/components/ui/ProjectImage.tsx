"use client";

import React, { useState } from "react";
import Image, { ImageProps } from "next/image";
import { Layers } from "lucide-react";

interface ProjectImageProps extends Omit<ImageProps, "onError"> {
  fallbackTitle?: string;
  categoryLabel?: string;
}

/**
 * Editorial image component with automatic error recovery and architectural tile pattern fallback.
 * Prevents broken image icons if external CDN or Unsplash experiences outages.
 */
export function ProjectImage({
  src,
  alt,
  className = "",
  fallbackTitle = "Tile Project",
  categoryLabel = "Curated Plan",
  ...props
}: ProjectImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (hasError || !src || typeof src !== "string" || src.trim() === "") {
    return (
      <div className={`relative flex flex-col items-center justify-center bg-gradient-to-br from-ceramic-100 via-ceramic-200 to-sand-200 text-charcoal-700 p-6 text-center select-none overflow-hidden ${className}`}>
        {/* Subtle decorative geometric tile grid pattern */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, #b85d38 1px, transparent 1px),
              linear-gradient(to bottom, #b85d38 1px, transparent 1px)
            `,
            backgroundSize: "24px 24px",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-editorial bg-white/90 text-terracotta-700 shadow-subtle border border-ceramic-300">
            <Layers className="h-6 w-6" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-terracotta-700 bg-white/80 px-2 py-0.5 rounded-full border border-ceramic-300">
            {categoryLabel}
          </span>
          <span className="font-serif text-sm font-semibold text-charcoal-900 max-w-[200px] line-clamp-1">
            {fallbackTitle}
          </span>
          <span className="text-[10px] text-charcoal-500 font-mono">
            Architectural Cut Template Ready
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt || fallbackTitle}
        className={`transition-all duration-500 ${
          isLoading ? "scale-105 blur-sm grayscale" : "scale-100 blur-0 grayscale-0"
        } object-cover`}
        onLoad={() => setIsLoading(false)}
        onError={() => setHasError(true)}
        {...props}
      />
    </div>
  );
}

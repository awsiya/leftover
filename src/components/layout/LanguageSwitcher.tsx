"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Globe, ChevronDown, Check } from "lucide-react";
import {
  LOCALES,
  AppLocale,
  LOCALE_CONFIGS,
  isValidLocale,
  DEFAULT_LOCALE,
} from "@/lib/i18n/config";
import { normalizePath, buildLocalizedPath } from "@/lib/i18n/metadata";

interface LanguageSwitcherProps {
  className?: string;
  variant?: "header" | "footer";
}

export function LanguageSwitcher({ className = "", variant = "header" }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Determine current active locale from pathname
  let currentLocale: AppLocale = DEFAULT_LOCALE;
  if (pathname) {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length > 0 && isValidLocale(segments[0])) {
      currentLocale = segments[0];
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectLocale = (targetLocale: AppLocale) => {
    setIsOpen(false);
    if (targetLocale === currentLocale) return;

    const normalized = normalizePath(pathname || "/");
    const targetPath = buildLocalizedPath(targetLocale, normalized);
    router.push(targetPath);
  };

  const activeConfig = LOCALE_CONFIGS[currentLocale];

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Select language"
        className={`inline-flex items-center gap-1.5 rounded-editorial transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 ${
          variant === "header"
            ? "px-2.5 py-1.5 text-xs font-semibold text-charcoal-700 hover:text-charcoal-900 bg-ceramic-100 hover:bg-ceramic-200 border border-ceramic-300"
            : "px-3 py-1.5 text-xs text-charcoal-400 hover:text-charcoal-200 bg-charcoal-800 border border-charcoal-700"
        }`}
      >
        <Globe className="h-3.5 w-3.5 opacity-80" aria-hidden="true" />
        <span className="font-medium">{activeConfig.nativeLabel}</span>
        <span className="text-[10px] uppercase font-bold text-terracotta-600 ml-0.5">
          ({activeConfig.code})
        </span>
        <ChevronDown
          className={`h-3 w-3 opacity-60 transition-transform ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 z-50 mt-1.5 w-44 origin-top-right rounded-editorial bg-white p-1 text-xs shadow-floating border border-ceramic-300 ring-1 ring-black/5 focus:outline-none animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-charcoal-400 border-b border-ceramic-200 mb-1">
            Languages ({LOCALES.length})
          </div>

          {LOCALES.map((loc) => {
            const config = LOCALE_CONFIGS[loc];
            const isSelected = loc === currentLocale;

            return (
              <button
                key={loc}
                type="button"
                role="menuitem"
                onClick={() => handleSelectLocale(loc)}
                className={`flex w-full items-center justify-between px-2.5 py-1.5 rounded text-left transition-colors ${
                  isSelected
                    ? "bg-terracotta-50 text-terracotta-700 font-bold"
                    : "text-charcoal-700 hover:bg-ceramic-100"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold uppercase w-5 text-charcoal-400">
                    {config.code}
                  </span>
                  <span>{config.nativeLabel}</span>
                </div>
                {isSelected && (
                  <Check className="h-3.5 w-3.5 text-terracotta-600" aria-hidden="true" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AccordionItemProps {
  id: string;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function AccordionItem({ id, title, children, defaultOpen = false }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-ceramic-300 py-3 last:border-b-0">
      <button
        type="button"
        id={`accordion-btn-${id}`}
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${id}`}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between py-2 text-left text-base font-medium text-charcoal-900 transition-colors hover:text-terracotta-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 focus-visible:ring-offset-2 rounded"
      >
        <span className="font-serif text-lg">{title}</span>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-charcoal-500 transition-transform duration-200",
            isOpen && "rotate-180 text-terracotta-600"
          )}
          aria-hidden="true"
        />
      </button>
      <div
        id={`accordion-content-${id}`}
        role="region"
        aria-labelledby={`accordion-btn-${id}`}
        className={cn(
          "grid transition-all duration-200 ease-in-out",
          isOpen ? "grid-rows-[1fr] opacity-100 mt-2 pb-2" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden text-sm leading-relaxed text-charcoal-700">
          {children}
        </div>
      </div>
    </div>
  );
}

export function Accordion({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("divide-y divide-ceramic-200 rounded-editorial border border-ceramic-300 bg-white p-6 shadow-subtle", className)}>
      {children}
    </div>
  );
}

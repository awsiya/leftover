"use client";

import React, { useState } from "react";
import { FileDown, Loader2, ShieldCheck, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ProjectCheckoutButtonProps {
  projectId: string;
  projectSlug: string;
  projectTitle: string;
  verificationStatus: string;
  priceCents?: number;
  className?: string;
}

export function ProjectCheckoutButton({
  projectSlug,
  verificationStatus,
  priceCents = 499,
  className = "",
}: ProjectCheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isVerified = verificationStatus === "verified";
  const formattedPrice = `$${(priceCents / 100).toFixed(2)}`;

  const handleCheckout = async () => {
    if (!isVerified) {
      setErrorMessage(
        "This project is in peer-review verification and cannot be purchased until physical workshop builds are completed."
      );
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: projectSlug,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to initialize checkout.");
      }

      if (data.sessionUrl) {
        window.location.href = data.sessionUrl;
      } else {
        throw new Error("No checkout session URL returned.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrorMessage(msg);
      setIsLoading(false);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Button
        variant="primary"
        size="lg"
        onClick={handleCheckout}
        disabled={isLoading || !isVerified}
        className={`w-full justify-center shadow-subtle ${
          !isVerified ? "opacity-75 cursor-not-allowed bg-charcoal-600 hover:bg-charcoal-600" : ""
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Connecting to Stripe Checkout...</span>
          </>
        ) : (
          <>
            <FileDown className="h-5 w-5" />
            <span>
              {isVerified
                ? `Purchase Printable Plan — ${formattedPrice}`
                : "Plan Pending Physical Verification"}
            </span>
          </>
        )}
      </Button>

      {/* Verification Notice */}
      <div className="flex items-center justify-between text-[11px] text-charcoal-600 pt-0.5">
        {isVerified ? (
          <span className="flex items-center gap-1 text-sage-700">
            <ShieldCheck className="h-3.5 w-3.5 text-sage-600" />
            <span>Physically verified plan • Instant PDF access</span>
          </span>
        ) : (
          <span className="flex items-center gap-1 text-amber-700">
            <ShieldAlert className="h-3.5 w-3.5 text-amber-600" />
            <span>Reviewing safety checklist • Not yet for sale</span>
          </span>
        )}
        <span>PCI-compliant Stripe checkout</span>
      </div>

      {errorMessage && (
        <div className="rounded border border-amber-300 bg-amber-50 p-2 text-xs text-amber-900 mt-2">
          {errorMessage}
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Lock, Shield, AlertTriangle, KeyRound, Mail, CheckCircle2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loginMethod, setLoginMethod] = useState<"password" | "otp">("password");

  // Password Login State
  const [email, setEmail] = useState("piyakshi90@gmail.com");
  const [password, setPassword] = useState("");

  // OTP Login State
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpSuccessMessage, setOtpSuccessMessage] = useState<string | null>(null);

  // Common State
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handle Password Sign In
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Fallback for developer environment
        if (
          process.env.NODE_ENV === "development" &&
          (error.message.includes("fetch failed") || error.message.includes("Invalid login credentials"))
        ) {
          router.push("/admin");
          return;
        }
        setErrorMessage(error.message);
      } else if (data.session) {
        router.push("/admin");
      }
    } catch {
      if (process.env.NODE_ENV === "development") {
        router.push("/admin");
        return;
      }
      setErrorMessage("An unexpected error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Requesting OTP
  const handleSendOtp = async () => {
    setOtpSending(true);
    setErrorMessage(null);
    setOtpSuccessMessage(null);

    try {
      const res = await fetch("/api/admin/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email || "piyakshi90@gmail.com" }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Failed to dispatch security code.");
      } else {
        setOtpSent(true);
        setOtpSuccessMessage(data.message);
      }
    } catch {
      setErrorMessage("Network error while dispatching security code.");
    } finally {
      setOtpSending(false);
    }
  };

  // Handle Verifying OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/admin/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: otpCode.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Invalid verification code.");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setErrorMessage("Network error verifying security code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-ceramic-100 min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-charcoal-600 hover:text-terracotta-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Public Site</span>
          </Link>
        </div>

        {/* Login Card */}
        <Card className="bg-white border-ceramic-300 shadow-card">
          <CardHeader className="text-center space-y-2 pb-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-editorial bg-charcoal-900 text-white shadow-subtle">
              <Lock className="h-6 w-6 text-terracotta-400" />
            </div>
            <CardTitle className="text-2xl font-bold">Admin Portal</CardTitle>
            <CardDescription>
              Authenticated management portal for project concepts, physical verification audits, and printable plan versions.
            </CardDescription>

            {/* Login Method Toggle */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setLoginMethod("password");
                  setErrorMessage(null);
                }}
                className={`py-2 px-3 text-xs font-semibold rounded-editorial flex items-center justify-center gap-1.5 transition-colors ${
                  loginMethod === "password"
                    ? "bg-terracotta-600 text-white shadow-subtle"
                    : "bg-ceramic-100 text-charcoal-700 hover:bg-ceramic-200"
                }`}
              >
                <KeyRound className="h-3.5 w-3.5" />
                <span>Password Login</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginMethod("otp");
                  setErrorMessage(null);
                }}
                className={`py-2 px-3 text-xs font-semibold rounded-editorial flex items-center justify-center gap-1.5 transition-colors ${
                  loginMethod === "otp"
                    ? "bg-terracotta-600 text-white shadow-subtle"
                    : "bg-ceramic-100 text-charcoal-700 hover:bg-ceramic-200"
                }`}
              >
                <Mail className="h-3.5 w-3.5" />
                <span>Email OTP Login</span>
              </button>
            </div>
          </CardHeader>

          <CardContent>
            {/* METHOD 1: Password Login */}
            {loginMethod === "password" && (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <Input
                  label="Admin User ID / Email"
                  type="email"
                  placeholder="piyakshi90@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <Input
                  label="Password"
                  type="password"
                  placeholder="piyakshi"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                {errorMessage && (
                  <div className="rounded-editorial border border-red-300 bg-red-50 p-3 text-xs text-red-900 flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="secondary"
                  size="md"
                  disabled={loading}
                  className="w-full justify-center mt-2"
                >
                  <Shield className="h-4 w-4" />
                  <span>{loading ? "Authenticating..." : "Sign In to Admin Portal"}</span>
                </Button>
              </form>
            )}

            {/* METHOD 2: Email OTP Login */}
            {loginMethod === "otp" && (
              <div className="space-y-4">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-editorial text-xs text-amber-900 space-y-1">
                  <p className="font-semibold flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-amber-700" />
                    <span>Dual-Channel OTP Broadcast</span>
                  </p>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Clicking &ldquo;Send Login Code&rdquo; will dispatch a 6-digit security OTP to both:
                    <br />
                    <strong>&bull; piyakshi90@gmail.com</strong>
                    <br />
                    <strong>&bull; one2ai@aol.com</strong>
                  </p>
                </div>

                {!otpSent ? (
                  <Button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={otpSending}
                    variant="primary"
                    size="md"
                    className="w-full justify-center"
                  >
                    {otpSending ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Sending Code via Resend...</span>
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4" />
                        <span>Send 6-Digit Login Code</span>
                      </>
                    )}
                  </Button>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    {otpSuccessMessage && (
                      <div className="rounded-editorial border border-emerald-300 bg-emerald-50 p-3 text-xs text-emerald-900 flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{otpSuccessMessage}</span>
                      </div>
                    )}

                    <Input
                      label="Enter 6-Digit Security Code"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]{6}"
                      maxLength={6}
                      placeholder="123456"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      required
                      autoFocus
                    />

                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        variant="secondary"
                        size="md"
                        disabled={loading || otpCode.trim().length !== 6}
                        className="flex-1 justify-center"
                      >
                        <Shield className="h-4 w-4" />
                        <span>{loading ? "Verifying..." : "Verify Code & Enter"}</span>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="md"
                        disabled={otpSending}
                        onClick={handleSendOtp}
                      >
                        <RefreshCw className={`h-4 w-4 ${otpSending ? "animate-spin" : ""}`} />
                      </Button>
                    </div>
                  </form>
                )}

                {errorMessage && (
                  <div className="rounded-editorial border border-red-300 bg-red-50 p-3 text-xs text-red-900 flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-2 border-t border-ceramic-200 text-center text-xs text-charcoal-500 pt-4">
            <p className="flex items-center justify-center gap-1">
              <Shield className="h-3.5 w-3.5 text-sage-600" />
              <span>Multi-Channel Admin Notifications Enabled</span>
            </p>
            <p className="text-[11px] text-charcoal-400">
              Updates broadcast to: piyakshi90@gmail.com &bull; one2ai@aol.com
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

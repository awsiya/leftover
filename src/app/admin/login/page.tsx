"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Lock, Shield, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(
      "Notice: Administrative Supabase Authentication is scheduled for Phase 5. Production permissions are restricted."
    );
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
              Restricted management portal for projects, translations, and PDF plan verification.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Admin Email Address"
                type="email"
                placeholder="admin@leftovertileplanner.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {statusMessage && (
                <div className="rounded-editorial border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900 flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{statusMessage}</span>
                </div>
              )}

              <Button
                type="submit"
                variant="secondary"
                size="md"
                className="w-full justify-center mt-2"
              >
                <Shield className="h-4 w-4" />
                <span>Sign In to Admin Portal</span>
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-2 border-t border-ceramic-200 text-center text-xs text-charcoal-500 pt-4">
            <p className="flex items-center justify-center gap-1">
              <Shield className="h-3.5 w-3.5 text-sage-600" />
              <span>Protected by Supabase Row Level Security</span>
            </p>
            <p className="text-[11px] text-charcoal-400">
              Unauthorized access attempts are logged and monitored.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

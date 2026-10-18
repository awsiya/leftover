import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Grid, Shield, ExternalLink, ListChecks } from "lucide-react";
import { verifyAdminSession } from "@/lib/auth/admin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifyAdminSession();

  if (!session.isAdmin) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-ceramic-100 flex flex-col text-charcoal-900">
      {/* Admin Top Navigation Bar */}
      <header className="bg-charcoal-900 text-white border-b border-charcoal-800 sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-2 font-serif text-lg font-bold">
              <span className="flex h-7 w-7 items-center justify-center rounded bg-terracotta-500 text-white text-xs">
                <Grid className="h-4 w-4" />
              </span>
              <span>Leftover Tile <span className="text-terracotta-400 font-sans text-xs uppercase tracking-wider font-semibold ml-1.5">Admin</span></span>
            </Link>

            <nav className="hidden sm:flex items-center gap-4 text-xs font-medium text-charcoal-300">
              <Link href="/admin" className="hover:text-white transition-colors flex items-center gap-1.5 py-1">
                <ListChecks className="h-4 w-4" />
                <span>Projects (20)</span>
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="hidden md:flex items-center gap-1.5 text-charcoal-400">
              <Shield className="h-3.5 w-3.5 text-emerald-400" />
              <span>Signed in as <strong className="text-white">{session.email}</strong></span>
            </div>

            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1 text-charcoal-300 hover:text-white bg-charcoal-800 px-2.5 py-1.5 rounded transition-colors"
            >
              <span>View Public Site</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="flex-1 py-8">{children}</main>
    </div>
  );
}

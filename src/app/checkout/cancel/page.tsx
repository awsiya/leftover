import React from "react";
import Link from "next/link";
import { ArrowLeft, Calculator, Grid, HelpCircle } from "lucide-react";
import { Card, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface CancelPageProps {
  searchParams: Promise<{
    project_slug?: string;
  }>;
}

export default async function CheckoutCancelPage({ searchParams }: CancelPageProps) {
  const { project_slug } = await searchParams;

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6 sm:py-24 space-y-6">
      <Card className="bg-white border-ceramic-300 p-8 text-center space-y-4 shadow-subtle">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ceramic-100 text-charcoal-700 mx-auto">
          <HelpCircle className="h-6 w-6" />
        </div>

        <h1 className="font-serif text-2xl font-bold text-charcoal-900 tracking-tight">
          Checkout Was Canceled
        </h1>

        <CardDescription className="text-xs text-charcoal-600 max-w-md mx-auto leading-relaxed">
          No charges were made to your account. Your leftover tile inventory calculations are
          still saved if you would like to continue exploring DIY plans or try another project.
        </CardDescription>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          {project_slug && (
            <Link href={`/projects/${project_slug}`}>
              <Button variant="secondary" size="sm" className="flex items-center gap-1.5">
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Return to Project</span>
              </Button>
            </Link>
          )}

          <Link href="/calculator">
            <Button variant="primary" size="sm" className="flex items-center gap-1.5">
              <Calculator className="h-3.5 w-3.5" />
              <span>Open Tile Calculator</span>
            </Button>
          </Link>

          <Link href="/projects">
            <Button variant="outline" size="sm" className="flex items-center gap-1.5">
              <Grid className="h-3.5 w-3.5" />
              <span>Browse All Projects</span>
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

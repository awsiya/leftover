"use server";

import { requireAdmin } from "@/lib/auth/admin";
import { TWENTY_PROJECT_CONCEPTS } from "@/lib/data/seededProjects";
import { createPlanDownloadToken } from "@/lib/pdf/downloadProtection";
import { getFrozenPlanVersion } from "@/lib/pdf/versionStore";

export interface GeneratePlanDownloadUrlResult {
  success: boolean;
  downloadUrl?: string;
  token?: string;
  expiresAt?: number;
  versionLabel?: string;
  checksum?: string;
  error?: string;
}

/**
 * Server action allowing administrators to generate an authenticated preview download URL
 * for any plan version directly from the Admin console.
 */
export async function generateAdminPlanDownloadUrl(
  projectId: string,
  versionLabel = "v1.0.0"
): Promise<GeneratePlanDownloadUrlResult> {
  const admin = await requireAdmin();

  const project = TWENTY_PROJECT_CONCEPTS.find(
    (p) => p.id === projectId || p.slug === projectId
  );

  if (!project) {
    return { success: false, error: "Project not found." };
  }

  const snapshot = getFrozenPlanVersion(project.slug, versionLabel);
  if (!snapshot) {
    return { success: false, error: "Plan version snapshot could not be generated." };
  }

  // Generate an admin preview token (valid for 15 minutes)
  const token = createPlanDownloadToken({
    projectId: project.id,
    projectSlug: project.slug,
    planVersion: versionLabel,
    customerEmail: `admin-preview (${admin.email})`,
    expiresInSeconds: 900, // 15 mins
    maxAccessCount: 50,
    isAdminPreview: true,
  });

  return {
    success: true,
    downloadUrl: `/api/plans/${token.token}/download`,
    token: token.token,
    expiresAt: token.expiresAt,
    versionLabel: snapshot.versionLabel,
    checksum: snapshot.checksum,
  };
}

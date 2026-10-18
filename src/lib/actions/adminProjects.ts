"use server";

import { revalidatePath } from "next/cache";
import { TWENTY_PROJECT_CONCEPTS, SeededProject } from "@/lib/data/seededProjects";
import { requireAdmin } from "@/lib/auth/admin";
import {
  validateProjectVerification,
  VerificationEvidenceInput,
  ProjectVerificationStatus,
} from "@/lib/types/verification";

// In-memory persistent store for development/runtime mutations
const projectsStore: SeededProject[] = [...TWENTY_PROJECT_CONCEPTS];

/**
 * Lists all projects for the admin dashboard with optional status/category filtering.
 */
export async function getAdminProjects(filters?: {
  status?: string;
  category?: string;
  search?: string;
}): Promise<SeededProject[]> {
  await requireAdmin();

  let list = [...projectsStore];

  if (filters?.status && filters.status !== "all") {
    list = list.filter((p) => p.verificationStatus === filters.status);
  }

  if (filters?.category && filters.category !== "all") {
    list = list.filter((p) => p.categorySlug === filters.category);
  }

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.translations.en.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q)
    );
  }

  return list;
}

/**
 * Gets a single project by ID or slug for admin.
 */
export async function getAdminProjectById(idOrSlug: string): Promise<SeededProject | null> {
  await requireAdmin();
  const project = projectsStore.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
  return project || null;
}

/**
 * Public helper to retrieve a project by ID or slug from live store.
 */
export async function getLiveProjectById(idOrSlug: string): Promise<SeededProject | null> {
  const project = projectsStore.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
  return project || null;
}

/**
 * Updates a project's verification status with mandatory physical evidence verification.
 * CRITICAL RULE: Projects CANNOT be marked as 'verified' without documented physical test evidence.
 */
export async function updateProjectVerification(
  projectId: string,
  targetStatus: ProjectVerificationStatus,
  evidence?: VerificationEvidenceInput | null
): Promise<{ success: boolean; project?: SeededProject; errors?: string[] }> {
  const admin = await requireAdmin();

  const projectIndex = projectsStore.findIndex((p) => p.id === projectId);
  if (projectIndex === -1) {
    return { success: false, errors: ["Project not found."] };
  }

  // Enforce physical evidence validation rule
  const validation = validateProjectVerification(targetStatus, evidence);
  if (!validation.allowed) {
    return {
      success: false,
      errors: validation.errors,
    };
  }

  const existing = projectsStore[projectIndex];
  const updated: SeededProject = {
    ...existing,
    verificationStatus: targetStatus,
    verifiedAt: targetStatus === "verified" ? evidence?.verifiedAt || new Date().toISOString() : null,
    verifiedBy: targetStatus === "verified" ? evidence?.verifiedBy || admin.email : null,
    verificationNotes:
      targetStatus === "verified"
        ? evidence?.verificationNotes || existing.verificationNotes
        : existing.verificationNotes,
  };

  projectsStore[projectIndex] = updated;

  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath(`/projects/${existing.slug}`);

  return {
    success: true,
    project: updated,
  };
}

/**
 * Creates or updates an entire project record from admin form input.
 */
export async function saveAdminProject(
  projectData: SeededProject
): Promise<{ success: boolean; project?: SeededProject; errors?: string[] }> {
  await requireAdmin();

  // Price constraint: integer 499 cents ($4.99)
  if (projectData.priceCents !== 499) {
    return {
      success: false,
      errors: ["Price must be fixed at 499 cents ($4.99 USD) as per application pricing rules."],
    };
  }

  // Verification status rule: cannot set to verified without evidence
  if (projectData.verificationStatus === "verified") {
    if (!projectData.verifiedAt || !projectData.verifiedBy || !projectData.verificationNotes) {
      return {
        success: false,
        errors: [
          "Cannot set status to 'verified' without verifier name, timestamp, and physical test notes.",
        ],
      };
    }
  }

  const existingIndex = projectsStore.findIndex((p) => p.id === projectData.id);
  if (existingIndex >= 0) {
    projectsStore[existingIndex] = projectData;
  } else {
    projectsStore.unshift(projectData);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  revalidatePath("/projects");

  return {
    success: true,
    project: projectData,
  };
}

/**
 * Deletes a project record.
 */
export async function deleteAdminProject(
  projectId: string
): Promise<{ success: boolean; errors?: string[] }> {
  await requireAdmin();

  const index = projectsStore.findIndex((p) => p.id === projectId);
  if (index === -1) {
    return { success: false, errors: ["Project not found."] };
  }

  projectsStore.splice(index, 1);

  revalidatePath("/admin");
  revalidatePath("/admin/projects");

  return { success: true };
}

import { z } from "zod";

export const verificationEvidenceSchema = z.object({
  verifiedAt: z.string().datetime("Must be a valid ISO timestamp"),
  verifiedBy: z.string().min(2, "Verifier identifier or name must be at least 2 characters"),
  testBuildDate: z.string().min(4, "Test build date is required"),
  prototypeDimensionsVerified: z.literal(true, {
    errorMap: () => ({ message: "Physical prototype dimensions must be measured and verified" }),
  }),
  cutSafetyVerified: z.literal(true, {
    errorMap: () => ({ message: "Cutting safety and edge smoothness must be verified" }),
  }),
  structuralStabilityVerified: z.literal(true, {
    errorMap: () => ({ message: "Structural load and substrate stability must be physically verified" }),
  }),
  materialAdhesionVerified: z.literal(true, {
    errorMap: () => ({ message: "Adhesive bonding and grout cure must be verified" }),
  }),
  verificationNotes: z
    .string()
    .min(20, "Verification notes must be at least 20 characters documenting physical build results"),
  evidencePhotoUrl: z.string().url("Evidence photo must be a valid URL").optional().or(z.literal("")),
});

export type VerificationEvidence = z.infer<typeof verificationEvidenceSchema>;

export interface VerificationEvidenceInput {
  verifiedAt?: string;
  verifiedBy?: string;
  testBuildDate?: string;
  prototypeDimensionsVerified?: boolean;
  cutSafetyVerified?: boolean;
  structuralStabilityVerified?: boolean;
  materialAdhesionVerified?: boolean;
  verificationNotes?: string;
  evidencePhotoUrl?: string;
}

export type ProjectVerificationStatus = "draft" | "reviewing" | "verified" | "archived";

/**
 * Validates whether a project satisfies all criteria to be marked as 'verified'.
 * Throws or returns validation errors if physical evidence is missing.
 */
export function validateProjectVerification(
  targetStatus: ProjectVerificationStatus,
  evidence?: VerificationEvidenceInput | null
): { allowed: boolean; errors: string[] } {
  if (targetStatus !== "verified") {
    // Draft, reviewing, or archived do not require physical build evidence
    return { allowed: true, errors: [] };
  }

  if (!evidence) {
    return {
      allowed: false,
      errors: [
        "A project cannot be marked as 'verified' without documented physical test build evidence.",
      ],
    };
  }

  const result = verificationEvidenceSchema.safeParse(evidence);
  if (!result.success) {
    return {
      allowed: false,
      errors: result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
    };
  }

  return { allowed: true, errors: [] };
}

/**
 * Guard that enforces that unverified projects CANNOT be purchased or sold.
 */
export function assertProjectCanBeSold(project: {
  id: string;
  slug: string;
  title: string;
  verification_status: ProjectVerificationStatus;
}): void {
  if (project.verification_status !== "verified") {
    throw new Error(
      `COMMERCE SECURITY VIOLATION: Project "${project.title}" (${project.slug}) is in '${project.verification_status}' status. Only physically verified project plans can be sold.`
    );
  }
}

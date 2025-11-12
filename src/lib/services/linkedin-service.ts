/**
 * LinkedIn Integration Service
 * Handles OAuth 2.0 authentication and data fetching from LinkedIn
 */

import type {
  ResumeContent,
  Experience,
  Education,
  Certification,
  Link,
} from "@/lib/api/types";

/**
 * LinkedIn OAuth Configuration
 * These values should be set from environment variables
 */
export const LINKEDIN_CONFIG = {
  clientId: import.meta.env.VITE_LINKEDIN_CLIENT_ID || "",
  clientSecret: import.meta.env.VITE_LINKEDIN_CLIENT_SECRET || "",
  redirectUri:
    import.meta.env.VITE_LINKEDIN_REDIRECT_URI ||
    "http://localhost:5173/auth/linkedin/callback",
  authorizationUrl: "https://www.linkedin.com/oauth/v2/authorization",
  tokenUrl: "https://www.linkedin.com/oauth/v2/accessToken",
  apiUrl: "https://api.linkedin.com/v2",
};

/**
 * LinkedIn API Response Types
 */
export interface LinkedInProfile {
  id: string;
  localizedFirstName: string;
  localizedLastName: string;
  profilePicture?: {
    displayImage: string;
  };
}

export interface LinkedInEmail {
  elements: Array<{
    handle: string;
  }>;
}

export interface LinkedInPosition {
  companyName: string;
  title: string;
  description: string;
  startDate?: {
    year: number;
    month: number;
  };
  endDate?: {
    year: number;
    month: number;
  };
  location?: string;
  isCurrentRole?: boolean;
}

export interface LinkedInEducation {
  schoolName: string;
  fieldOfStudy: string;
  degreeType?: string;
  startDate?: {
    year: number;
    month: number;
  };
  endDate?: {
    year: number;
    month: number;
  };
  grade?: string;
}

export interface LinkedInSkill {
  name: string;
  endorsementCount: number;
}

export interface LinkedInCertification {
  name: string;
  authority?: string;
  issueDate?: {
    year: number;
    month: number;
  };
  expirationDate?: {
    year: number;
    month: number;
  };
  credentialUrl?: string;
  credentialId?: string;
}

/**
 * Generate LinkedIn OAuth authorization URL
 */
export function getLinkedInAuthUrl(
  state: string,
  scope: string[] = ["openid", "profile", "email"],
): string {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: LINKEDIN_CONFIG.clientId,
    redirect_uri: LINKEDIN_CONFIG.redirectUri,
    state,
    scope: scope.join(" "),
  });

  return `${LINKEDIN_CONFIG.authorizationUrl}?${params.toString()}`;
}

/**
 * Exchange authorization code for access token
 * This should be called from the client, but the actual token exchange
 * must happen on the backend to keep the client secret secure
 */
export async function exchangeCodeForToken(code: string): Promise<{
  access_token: string;
  expires_in: number;
  token_type: string;
}> {
  // Call backend endpoint to exchange code for token
  // The backend will securely exchange the code using the client secret
  const response = await fetch("/api/auth/linkedin/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code,
      redirectUri: LINKEDIN_CONFIG.redirectUri,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      error: "Failed to exchange authorization code for token",
    }));
    throw new Error(
      error.error || "Failed to exchange authorization code for token",
    );
  }

  return response.json();
}

/**
 * Fetch LinkedIn profile information
 */
export async function fetchLinkedInProfile(
  accessToken: string,
): Promise<LinkedInProfile> {
  const response = await fetch(`${LINKEDIN_CONFIG.apiUrl}/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "LinkedIn-Version": "202310",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch LinkedIn profile");
  }

  return response.json();
}

/**
 * Fetch LinkedIn email address
 */
export async function fetchLinkedInEmail(accessToken: string): Promise<string> {
  const response = await fetch(
    `${LINKEDIN_CONFIG.apiUrl}/emailAddress?q=members&projection=(elements*(handle~))`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "LinkedIn-Version": "202310",
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch LinkedIn email");
  }

  const data: LinkedInEmail = await response.json();
  return data.elements?.[0]?.handle || "";
}

/**
 * Fetch LinkedIn work experience
 */
export async function fetchLinkedInExperience(
  accessToken: string,
): Promise<LinkedInPosition[]> {
  const response = await fetch(
    `${LINKEDIN_CONFIG.apiUrl}/me?projection=(positions)`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "LinkedIn-Version": "202310",
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch LinkedIn experience");
  }

  const data = await response.json();
  return data.positions || [];
}

/**
 * Fetch LinkedIn education
 */
export async function fetchLinkedInEducation(
  accessToken: string,
): Promise<LinkedInEducation[]> {
  const response = await fetch(
    `${LINKEDIN_CONFIG.apiUrl}/me?projection=(educations)`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "LinkedIn-Version": "202310",
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch LinkedIn education");
  }

  const data = await response.json();
  return data.educations || [];
}

/**
 * Fetch LinkedIn skills
 */
export async function fetchLinkedInSkills(
  accessToken: string,
): Promise<LinkedInSkill[]> {
  const response = await fetch(
    `${LINKEDIN_CONFIG.apiUrl}/me?projection=(skills)`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "LinkedIn-Version": "202310",
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch LinkedIn skills");
  }

  const data = await response.json();
  return data.skills || [];
}

/**
 * Fetch LinkedIn certifications
 */
export async function fetchLinkedInCertifications(
  accessToken: string,
): Promise<LinkedInCertification[]> {
  const response = await fetch(
    `${LINKEDIN_CONFIG.apiUrl}/me?projection=(certifications)`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "LinkedIn-Version": "202310",
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch LinkedIn certifications");
  }

  const data = await response.json();
  return data.certifications || [];
}

/**
 * Convert LinkedIn experience to Resume Experience
 */
export function convertLinkedInExperience(
  positions: LinkedInPosition[],
): Experience[] {
  return positions.map((position) => {
    const startDate = position.startDate
      ? `${position.startDate.year}-${String(position.startDate.month).padStart(2, "0")}`
      : "";
    const endDate = position.endDate
      ? `${position.endDate.year}-${String(position.endDate.month).padStart(2, "0")}`
      : "";

    return {
      id: crypto.randomUUID(),
      company: position.companyName,
      position: position.title,
      startDate,
      endDate,
      current: position.isCurrentRole || false,
      description: position.description || "",
      highlights: [],
    };
  });
}

/**
 * Convert LinkedIn education to Resume Education
 */
export function convertLinkedInEducation(
  educations: LinkedInEducation[],
): Education[] {
  return educations.map((edu) => {
    const startDate = edu.startDate
      ? `${edu.startDate.year}-${String(edu.startDate.month).padStart(2, "0")}`
      : "";
    const endDate = edu.endDate
      ? `${edu.endDate.year}-${String(edu.endDate.month).padStart(2, "0")}`
      : "";

    return {
      id: crypto.randomUUID(),
      institution: edu.schoolName,
      degree: edu.degreeType || "",
      field: edu.fieldOfStudy,
      startDate,
      endDate,
      current: false,
      gpa: edu.grade,
    };
  });
}

/**
 * Convert LinkedIn certifications to Resume Certifications
 */
export function convertLinkedInCertifications(
  certs: LinkedInCertification[],
): Certification[] {
  return certs.map((cert) => {
    const date = cert.issueDate
      ? `${cert.issueDate.year}-${String(cert.issueDate.month).padStart(2, "0")}`
      : "";
    const expiryDate = cert.expirationDate
      ? `${cert.expirationDate.year}-${String(cert.expirationDate.month).padStart(2, "0")}`
      : undefined;

    return {
      id: crypto.randomUUID(),
      name: cert.name,
      issuer: cert.authority || "",
      date,
      expiryDate,
      credentialId: cert.credentialId,
      url: cert.credentialUrl,
    };
  });
}

/**
 * Parse LinkedIn profile data into ResumeContent format
 */
export function parseLinkedInProfile(
  profile: LinkedInProfile,
  email: string,
  positions: LinkedInPosition[],
  educations: LinkedInEducation[],
  skills: LinkedInSkill[],
  certifications: LinkedInCertification[],
): Partial<ResumeContent> {
  const technicalSkills = skills

    .sort((a, b) => b.endorsementCount - a.endorsementCount)

    .slice(0, 10)

    .map((s) => s.name);

  const linkedInProfile: Link = {
    id: crypto.randomUUID(),
    label: "LinkedIn",
    url: `https://www.linkedin.com/in/${profile.id}`,
    type: "linkedin",
  };

  return {
    personalInfo: {
      name: `${profile.localizedFirstName} ${profile.localizedLastName}`,
      email,
      phone: "", // LinkedIn API doesn't provide phone in public profile
      location: "", // Would need additional API call
      summary: "", // Would need additional API call for headline/about
    },
    experience: convertLinkedInExperience(positions),
    education: convertLinkedInEducation(educations),
    skills: {
      technical: technicalSkills,
      languages: [],
      tools: [],
      soft: [],
    },
    certifications: convertLinkedInCertifications(certifications),
    links: [linkedInProfile],
  };
}

/**
 * Main LinkedIn import handler
 */
export async function importFromLinkedInOAuth(
  accessToken: string,
): Promise<Partial<ResumeContent>> {
  try {
    // Call backend to fetch LinkedIn profile data
    // This keeps the access token secure and avoids CORS issues
    const response = await fetch("/api/auth/linkedin/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accessToken,
      }),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: "Failed to fetch LinkedIn profile" }));
      throw new Error(error.error || "Failed to fetch LinkedIn profile");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to import from LinkedIn",
    );
  }
}

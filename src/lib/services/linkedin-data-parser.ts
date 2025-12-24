/**
 * LinkedIn Data Export Parser
 * Parses LinkedIn data export ZIP files to extract resume information
 *
 * LinkedIn exports include CSV files for:
 * - Profile.csv - Basic profile information
 * - Positions.csv - Work experience
 * - Education.csv - Education history
 * - Skills.csv - Skills
 * - Certifications.csv - Professional certifications
 * - Languages.csv - Languages spoken
 * - Connections.csv - Network connections (not used for resume)
 * - Messages.csv - Messages (not used for resume)
 * - etc.
 */

import type {
  ResumeContent,
  PersonalInfo,
  Experience,
  Education,
  Skills,
  Certification,
  Link,
} from "@/lib/api/types";
import JSZip from "jszip";
import Papa from "papaparse";

/**
 * LinkedIn CSV file types we care about for resume building
 */
type LinkedInCSVType =
  | "Profile"
  | "Positions"
  | "Education"
  | "Skills"
  | "Certifications"
  | "Languages"
  | "Email Addresses";

/**
 * Raw LinkedIn Profile CSV row
 */
interface LinkedInProfileRow {
  "First Name"?: string;
  "Last Name"?: string;
  "Maiden Name"?: string;
  "Headline"?: string;
  "Summary"?: string;
  "Industry"?: string;
  "Zip Code"?: string;
  "Geo Location"?: string;
  "Twitter Handles"?: string;
  "Websites"?: string;
  "Instant Messengers"?: string;
  "Birth Date"?: string;
  "Address"?: string;
}

/**
 * Raw LinkedIn Position CSV row
 */
interface LinkedInPositionRow {
  "Company Name"?: string;
  "Title"?: string;
  "Description"?: string;
  "Location"?: string;
  "Started On"?: string;
  "Finished On"?: string;
}

/**
 * Raw LinkedIn Education CSV row
 */
interface LinkedInEducationRow {
  "School Name"?: string;
  "Start Date"?: string;
  "End Date"?: string;
  "Notes"?: string;
  "Degree Name"?: string;
  "Activities"?: string;
}

/**
 * Raw LinkedIn Skills CSV row
 */
interface LinkedInSkillRow {
  "Name"?: string;
}

/**
 * Raw LinkedIn Certification CSV row
 */
interface LinkedInCertificationRow {
  "Name"?: string;
  "Url"?: string;
  "Authority"?: string;
  "Started On"?: string;
  "Finished On"?: string;
  "License Number"?: string;
}

/**
 * Raw LinkedIn Language CSV row
 */
interface LinkedInLanguageRow {
  "Name"?: string;
  "Proficiency"?: string;
}

/**
 * Raw LinkedIn Email CSV row
 */
interface LinkedInEmailRow {
  "Email Address"?: string;
  "Confirmed"?: string;
  "Primary"?: string;
  "Updated On"?: string;
}

/**
 * Parsed LinkedIn data structure
 */
export interface ParsedLinkedInData {
  profile?: LinkedInProfileRow;
  positions?: LinkedInPositionRow[];
  education?: LinkedInEducationRow[];
  skills?: LinkedInSkillRow[];
  certifications?: LinkedInCertificationRow[];
  languages?: LinkedInLanguageRow[];
  emails?: LinkedInEmailRow[];
}

/**
 * Parse results with validation
 */
export interface LinkedInParseResult {
  success: boolean;
  data?: Partial<ResumeContent>;
  warnings?: string[];
  error?: string;
}

/**
 * Parse a CSV string to rows
 */
function parseCSV<T>(csvContent: string): T[] {
  const result = Papa.parse<T>(csvContent, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
  });

  if (result.errors.length > 0) {
    console.warn("CSV parse warnings:", result.errors);
  }

  return result.data;
}

/**
 * Find CSV file in ZIP by partial name match
 */
async function findCSVFile(
  zip: JSZip,
  searchName: LinkedInCSVType,
): Promise<string | null> {
  const files = Object.keys(zip.files);
  const csvFile = files.find(
    (name) =>
      name.toLowerCase().includes(searchName.toLowerCase()) &&
      name.endsWith(".csv"),
  );
  if (!csvFile) return null;
  return await zip.files[csvFile].async("string");
}

/**
 * Parse LinkedIn date format (YYYY-MM or Month YYYY)
 * Returns ISO date string (YYYY-MM)
 */
function parseLinkedInDate(dateStr?: string): string {
  if (!dateStr || dateStr.trim() === "") return "";

  const trimmed = dateStr.trim();

  // Handle YYYY-MM format
  if (/^\d{4}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }

  // Handle "Month YYYY" format (e.g., "January 2020")
  const monthYearMatch = trimmed.match(
    /^(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})$/i,
  );
  if (monthYearMatch) {
    const months: Record<string, string> = {
      january: "01",
      february: "02",
      march: "03",
      april: "04",
      may: "05",
      june: "06",
      july: "07",
      august: "08",
      september: "09",
      october: "10",
      november: "11",
      december: "12",
    };
    const month = months[monthYearMatch[1].toLowerCase()];
    return `${monthYearMatch[2]}-${month}`;
  }

  // Handle "YYYY" format
  if (/^\d{4}$/.test(trimmed)) {
    return `${trimmed}-01`;
  }

  // Handle "Mon YYYY" format (e.g., "Jan 2020")
  const shortMonthMatch = trimmed.match(
    /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})$/i,
  );
  if (shortMonthMatch) {
    const months: Record<string, string> = {
      jan: "01",
      feb: "02",
      mar: "03",
      apr: "04",
      may: "05",
      jun: "06",
      jul: "07",
      aug: "08",
      sep: "09",
      oct: "10",
      nov: "11",
      dec: "12",
    };
    const month = months[shortMonthMatch[1].toLowerCase()];
    return `${shortMonthMatch[2]}-${month}`;
  }

  return "";
}

/**
 * Parse description into paragraphs and bullet points
 */
function parseDescription(description?: string): {
  description: string;
  highlights: string[];
} {
  if (!description) {
    return { description: "", highlights: [] };
  }

  const lines = description.split(/\n/);
  const paragraphs: string[] = [];
  const bullets: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Check if line is a bullet point
    if (
      trimmed.startsWith("•") ||
      trimmed.startsWith("-") ||
      trimmed.startsWith("*") ||
      /^\d+[.)]/.test(trimmed)
    ) {
      // Remove bullet character and add to highlights
      const bulletText = trimmed.replace(/^[•\-*]|\d+[.)]/, "").trim();
      if (bulletText) {
        bullets.push(bulletText);
      }
    } else {
      paragraphs.push(trimmed);
    }
  }

  return {
    description: paragraphs.join(" "),
    highlights: bullets,
  };
}

/**
 * Categorize skills into technical, soft, and tools
 */
function categorizeSkills(skillNames: string[]): Skills {
  // Common technical skills keywords
  const technicalKeywords = [
    "javascript",
    "typescript",
    "python",
    "java",
    "c++",
    "c#",
    "go",
    "rust",
    "ruby",
    "php",
    "swift",
    "kotlin",
    "scala",
    "sql",
    "html",
    "css",
    "react",
    "angular",
    "vue",
    "node",
    "django",
    "flask",
    "spring",
    ".net",
    "aws",
    "azure",
    "gcp",
    "docker",
    "kubernetes",
    "terraform",
    "graphql",
    "rest",
    "api",
    "machine learning",
    "ai",
    "data science",
    "analytics",
    "algorithm",
    "database",
    "mongodb",
    "postgresql",
    "mysql",
    "redis",
    "elasticsearch",
    "devops",
    "ci/cd",
    "agile",
    "scrum",
    "microservices",
    "cloud",
    "linux",
    "unix",
    "networking",
    "security",
    "testing",
    "automation",
  ];

  // Common tools keywords
  const toolKeywords = [
    "git",
    "github",
    "gitlab",
    "jira",
    "confluence",
    "slack",
    "figma",
    "sketch",
    "adobe",
    "photoshop",
    "illustrator",
    "xd",
    "invision",
    "vscode",
    "visual studio",
    "intellij",
    "eclipse",
    "jenkins",
    "circleci",
    "travis",
    "postman",
    "insomnia",
    "datadog",
    "splunk",
    "grafana",
    "tableau",
    "power bi",
    "excel",
    "notion",
    "trello",
    "asana",
    "monday",
    "salesforce",
    "hubspot",
    "zendesk",
    "intercom",
  ];

  // Common soft skills keywords
  const softKeywords = [
    "leadership",
    "communication",
    "teamwork",
    "collaboration",
    "problem solving",
    "critical thinking",
    "creativity",
    "adaptability",
    "time management",
    "organization",
    "presentation",
    "negotiation",
    "conflict resolution",
    "mentoring",
    "coaching",
    "strategic",
    "planning",
    "decision making",
    "emotional intelligence",
    "empathy",
    "customer service",
    "public speaking",
    "writing",
    "research",
    "attention to detail",
    "multitasking",
    "flexibility",
    "initiative",
    "work ethic",
    "professionalism",
  ];

  const technical: string[] = [];
  const tools: string[] = [];
  const soft: string[] = [];

  for (const skill of skillNames) {
    const skillLower = skill.toLowerCase();

    if (technicalKeywords.some((kw) => skillLower.includes(kw))) {
      technical.push(skill);
    } else if (toolKeywords.some((kw) => skillLower.includes(kw))) {
      tools.push(skill);
    } else if (softKeywords.some((kw) => skillLower.includes(kw))) {
      soft.push(skill);
    } else {
      // Default to technical for unrecognized skills
      technical.push(skill);
    }
  }

  return {
    technical,
    languages: [], // Languages handled separately
    tools,
    soft,
  };
}

/**
 * Parse websites from LinkedIn profile field
 */
function parseWebsites(websitesStr?: string): Link[] {
  if (!websitesStr) return [];

  const links: Link[] = [];
  // LinkedIn exports websites as comma or newline separated URLs
  const urls = websitesStr.split(/[,\n]/).map((s) => s.trim()).filter(Boolean);

  for (const url of urls) {
    const id = crypto.randomUUID();

    // Determine link type based on URL
    let type: Link["type"] = "website";
    let label = "Website";

    if (url.includes("github.com")) {
      type = "github";
      label = "GitHub";
    } else if (url.includes("twitter.com") || url.includes("x.com")) {
      type = "twitter";
      label = "Twitter";
    } else if (url.includes("dribbble.com")) {
      type = "dribbble";
      label = "Dribbble";
    } else if (url.includes("codepen.io")) {
      type = "codepen";
      label = "CodePen";
    } else if (url.includes("figma.com")) {
      type = "figma";
      label = "Figma";
    } else if (url.includes("youtube.com")) {
      type = "youtube";
      label = "YouTube";
    } else if (url.includes("instagram.com")) {
      type = "instagram";
      label = "Instagram";
    } else if (url.includes("facebook.com")) {
      type = "facebook";
      label = "Facebook";
    } else if (url.includes("twitch.tv")) {
      type = "twitch";
      label = "Twitch";
    }

    links.push({ id, label, url, type });
  }

  return links;
}

/**
 * Convert parsed LinkedIn data to ResumeContent
 */
function convertToResumeContent(
  data: ParsedLinkedInData,
): { content: Partial<ResumeContent>; warnings: string[] } {
  const warnings: string[] = [];

  // Get primary email
  const primaryEmail =
    data.emails?.find((e) => e["Primary"] === "Yes" || e["Confirmed"] === "Yes")?.["Email Address"] ||
    data.emails?.[0]?.["Email Address"] ||
    "";

  // Parse profile
  const personalInfo: PersonalInfo = {
    firstName: data.profile?.["First Name"] || "",
    lastName: data.profile?.["Last Name"] || "",
    nameOrder: "firstLast",
    title: data.profile?.["Headline"] || "",
    email: primaryEmail,
    phone: "", // LinkedIn exports don't include phone numbers
    location: data.profile?.["Geo Location"] || data.profile?.["Address"] || "",
    summary: data.profile?.["Summary"] || "",
  };

  if (!personalInfo.firstName && !personalInfo.lastName) {
    warnings.push("No name found in LinkedIn data");
  }

  // Parse positions/experience
  const experience: Experience[] = (data.positions || []).map((pos) => {
    const { description, highlights } = parseDescription(pos["Description"]);
    const startDate = parseLinkedInDate(pos["Started On"]);
    const endDate = parseLinkedInDate(pos["Finished On"]);

    return {
      id: crypto.randomUUID(),
      company: pos["Company Name"] || "",
      position: pos["Title"] || "",
      startDate,
      endDate,
      current: !endDate || endDate === "",
      description,
      highlights,
    };
  });

  if (experience.length === 0) {
    warnings.push("No work experience found in LinkedIn data");
  }

  // Parse education
  const education: Education[] = (data.education || []).map((edu) => {
    const startDate = parseLinkedInDate(edu["Start Date"]);
    const endDate = parseLinkedInDate(edu["End Date"]);

    // Try to extract degree and field from "Degree Name"
    // Common formats: "Bachelor of Science, Computer Science" or "Master's degree, Business Administration"
    let degree = "";
    let field = "";
    const degreeName = edu["Degree Name"] || "";

    if (degreeName.includes(",")) {
      const parts = degreeName.split(",").map((s) => s.trim());
      degree = parts[0] || "";
      field = parts.slice(1).join(", ");
    } else {
      degree = degreeName;
    }

    return {
      id: crypto.randomUUID(),
      institution: edu["School Name"] || "",
      degree,
      field,
      startDate,
      endDate,
      current: !endDate || endDate === "",
      honors: edu["Activities"]
        ? edu["Activities"].split(/[,\n]/).map((s) => s.trim()).filter(Boolean)
        : undefined,
    };
  });

  // Parse skills
  const skillNames = (data.skills || [])
    .map((s) => s["Name"])
    .filter((s): s is string => !!s);
  const skills = categorizeSkills(skillNames);

  // Add languages to skills
  if (data.languages && data.languages.length > 0) {
    skills.languages = data.languages
      .map((lang) => lang["Name"])
      .filter((s): s is string => !!s);
  }

  // Parse certifications
  const certifications: Certification[] = (data.certifications || []).map((cert) => ({
    id: crypto.randomUUID(),
    name: cert["Name"] || "",
    issuer: cert["Authority"] || "",
    date: parseLinkedInDate(cert["Started On"]),
    expiryDate: cert["Finished On"] ? parseLinkedInDate(cert["Finished On"]) : undefined,
    credentialId: cert["License Number"] || undefined,
    url: cert["Url"] || undefined,
  }));

  // Parse links
  const links: Link[] = [
    // Add LinkedIn profile link
    {
      id: crypto.randomUUID(),
      label: "LinkedIn",
      url: "https://www.linkedin.com/in/",
      type: "linkedin" as const,
    },
    ...parseWebsites(data.profile?.["Websites"]),
  ];

  // Add Twitter if present
  if (data.profile?.["Twitter Handles"]) {
    const handles = data.profile["Twitter Handles"].split(",").map((s) => s.trim()).filter(Boolean);
    for (const handle of handles) {
      links.push({
        id: crypto.randomUUID(),
        label: "Twitter",
        url: handle.startsWith("http") ? handle : `https://twitter.com/${handle.replace("@", "")}`,
        type: "twitter",
      });
    }
  }

  return {
    content: {
      personalInfo,
      experience,
      education,
      skills,
      certifications,
      links,
    },
    warnings,
  };
}

/**
 * Parse LinkedIn ZIP export file
 */
export async function parseLinkedInZip(file: File): Promise<LinkedInParseResult> {
  try {
    // Validate file type
    if (!file.name.endsWith(".zip")) {
      return {
        success: false,
        error: "Please upload a ZIP file from LinkedIn data export",
      };
    }

    // Load ZIP file - use arrayBuffer for better compatibility
    const arrayBuffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);

    // Parse CSV files
    const parsedData: ParsedLinkedInData = {};

    // Profile
    const profileCSV = await findCSVFile(zip, "Profile");
    if (profileCSV) {
      const profiles = parseCSV<LinkedInProfileRow>(profileCSV);
      parsedData.profile = profiles[0];
    }

    // Positions (Experience)
    const positionsCSV = await findCSVFile(zip, "Positions");
    if (positionsCSV) {
      parsedData.positions = parseCSV<LinkedInPositionRow>(positionsCSV);
    }

    // Education
    const educationCSV = await findCSVFile(zip, "Education");
    if (educationCSV) {
      parsedData.education = parseCSV<LinkedInEducationRow>(educationCSV);
    }

    // Skills
    const skillsCSV = await findCSVFile(zip, "Skills");
    if (skillsCSV) {
      parsedData.skills = parseCSV<LinkedInSkillRow>(skillsCSV);
    }

    // Certifications
    const certificationsCSV = await findCSVFile(zip, "Certifications");
    if (certificationsCSV) {
      parsedData.certifications = parseCSV<LinkedInCertificationRow>(certificationsCSV);
    }

    // Languages
    const languagesCSV = await findCSVFile(zip, "Languages");
    if (languagesCSV) {
      parsedData.languages = parseCSV<LinkedInLanguageRow>(languagesCSV);
    }

    // Email Addresses
    const emailsCSV = await findCSVFile(zip, "Email Addresses");
    if (emailsCSV) {
      parsedData.emails = parseCSV<LinkedInEmailRow>(emailsCSV);
    }

    // Check if we found any useful data
    const hasProfile = !!parsedData.profile;
    const hasPositions = (parsedData.positions?.length ?? 0) > 0;
    const hasEducation = (parsedData.education?.length ?? 0) > 0;
    const hasSkills = (parsedData.skills?.length ?? 0) > 0;

    if (!hasProfile && !hasPositions && !hasEducation && !hasSkills) {
      return {
        success: false,
        error:
          "No recognizable LinkedIn data found in the ZIP file. Please make sure you're uploading your LinkedIn data export.",
      };
    }

    // Convert to ResumeContent
    const { content, warnings } = convertToResumeContent(parsedData);

    return {
      success: true,
      data: content,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  } catch (error) {
    console.error("Error parsing LinkedIn ZIP:", error);

    if (error instanceof Error) {
      if (error.message.includes("not a valid zip")) {
        return {
          success: false,
          error: "The file doesn't appear to be a valid ZIP file",
        };
      }
      return {
        success: false,
        error: `Failed to parse LinkedIn data: ${error.message}`,
      };
    }

    return {
      success: false,
      error: "Failed to parse LinkedIn data export",
    };
  }
}

/**
 * Validate if file is likely a LinkedIn export
 */
export function isLinkedInExport(file: File): boolean {
  // Check file extension
  if (!file.name.endsWith(".zip")) return false;

  // LinkedIn exports are typically named like "Complete_LinkedInDataExport_..."
  // or just have standard names from LinkedIn
  const commonPatterns = [
    "linkedin",
    "complete_",
    "data_export",
    "dataexport",
    "basic_linkedin",
  ];

  const fileNameLower = file.name.toLowerCase();
  return commonPatterns.some((pattern) => fileNameLower.includes(pattern));
}

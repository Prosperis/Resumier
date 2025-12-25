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
import * as pdfjsLib from "pdfjs-dist";

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
  Headline?: string;
  Summary?: string;
  Industry?: string;
  "Zip Code"?: string;
  "Geo Location"?: string;
  "Twitter Handles"?: string;
  Websites?: string;
  "Instant Messengers"?: string;
  "Birth Date"?: string;
  Address?: string;
}

/**
 * Raw LinkedIn Position CSV row
 */
interface LinkedInPositionRow {
  "Company Name"?: string;
  Title?: string;
  Description?: string;
  Location?: string;
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
  Notes?: string;
  "Degree Name"?: string;
  Activities?: string;
}

/**
 * Raw LinkedIn Skills CSV row
 */
interface LinkedInSkillRow {
  Name?: string;
}

/**
 * Raw LinkedIn Certification CSV row
 */
interface LinkedInCertificationRow {
  Name?: string;
  Url?: string;
  Authority?: string;
  "Started On"?: string;
  "Finished On"?: string;
  "License Number"?: string;
}

/**
 * Raw LinkedIn Language CSV row
 */
interface LinkedInLanguageRow {
  Name?: string;
  Proficiency?: string;
}

/**
 * Raw LinkedIn Email CSV row
 */
interface LinkedInEmailRow {
  "Email Address"?: string;
  Confirmed?: string;
  Primary?: string;
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
async function findCSVFile(zip: JSZip, searchName: LinkedInCSVType): Promise<string | null> {
  const files = Object.keys(zip.files);
  const csvFile = files.find(
    (name) => name.toLowerCase().includes(searchName.toLowerCase()) && name.endsWith(".csv"),
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

    // Use word boundary matching to avoid false positives like "digital" matching "git"
    const matchesKeyword = (keywords: string[]) =>
      keywords.some((kw) => {
        // For short keywords (<=3 chars), require word boundary match
        if (kw.length <= 3) {
          // Escape special regex characters
          const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          const regex = new RegExp(`\\b${escaped}\\b`, "i");
          return regex.test(skillLower);
        }
        return skillLower.includes(kw);
      });

    if (matchesKeyword(technicalKeywords)) {
      technical.push(skill);
    } else if (matchesKeyword(toolKeywords)) {
      tools.push(skill);
    } else if (matchesKeyword(softKeywords)) {
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
  const urls = websitesStr
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean);

  for (const url of urls) {
    const id = crypto.randomUUID();

    // Determine link type based on URL
    let type: Link["type"] = "website";
    let label = "Website";

    if (url.includes("linkedin.com")) {
      type = "linkedin";
      label = "LinkedIn";
    } else if (url.includes("github.com")) {
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
function convertToResumeContent(data: ParsedLinkedInData): {
  content: Partial<ResumeContent>;
  warnings: string[];
} {
  const warnings: string[] = [];

  // Get primary email
  const primaryEmail =
    data.emails?.find((e) => e["Primary"] === "Yes" || e["Confirmed"] === "Yes")?.[
      "Email Address"
    ] ||
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
        ? edu["Activities"]
            .split(/[,\n]/)
            .map((s) => s.trim())
            .filter(Boolean)
        : undefined,
    };
  });

  // Parse skills
  const skillNames = (data.skills || []).map((s) => s["Name"]).filter((s): s is string => !!s);
  console.log("Skills input to categorize:", skillNames);
  const skills = categorizeSkills(skillNames);
  console.log("Skills after categorize:", {
    technical: skills.technical,
    tools: skills.tools,
    soft: skills.soft,
  });

  // Add languages to skills (with proficiency if available)
  if (data.languages && data.languages.length > 0) {
    skills.languages = data.languages
      .map((lang) => {
        const name = lang["Name"];
        const proficiency = lang["Proficiency"];

        if (!name) return null;

        // Convert LinkedIn proficiency to level (1-5 scale)
        // Native/Full Professional = 5, Professional Working = 4, Limited Working = 3, Elementary = 2
        if (proficiency) {
          let level = 3; // Default to Limited Working
          if (
            proficiency.toLowerCase().includes("native") ||
            proficiency.toLowerCase().includes("full professional")
          ) {
            level = 5;
          } else if (proficiency.toLowerCase().includes("professional working")) {
            level = 4;
          } else if (proficiency.toLowerCase().includes("limited")) {
            level = 3;
          } else if (proficiency.toLowerCase().includes("elementary")) {
            level = 2;
          }

          // Return as "Name (Proficiency)" string for better display
          return `${name} (${proficiency})`;
        }

        return name;
      })
      .filter((s): s is string => !!s);
  }

  // Parse certifications
  console.log(
    "Certifications input:",
    data.certifications?.length,
    data.certifications?.map((c) => c.Name),
  );
  const certifications: Certification[] = (data.certifications || []).map((cert) => ({
    id: crypto.randomUUID(),
    name: cert["Name"] || "",
    issuer: cert["Authority"] || "",
    date: parseLinkedInDate(cert["Started On"]),
    expiryDate: cert["Finished On"] ? parseLinkedInDate(cert["Finished On"]) : undefined,
    credentialId: cert["License Number"] || undefined,
    url: cert["Url"] || undefined,
  }));
  console.log("Certifications after convert:", certifications.length);

  // Parse links from Websites field (already contains LinkedIn, GitHub, etc.)
  const links: Link[] = parseWebsites(data.profile?.["Websites"]);

  // Add Twitter if present (not already in links)
  if (data.profile?.["Twitter Handles"]) {
    const handles = data.profile["Twitter Handles"]
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
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

    // Detect if this is a Basic export (only Profile.csv) vs Complete export
    const isBasicExport = hasProfile && !hasPositions && !hasEducation && !hasSkills;

    // Convert to ResumeContent
    const { content, warnings } = convertToResumeContent(parsedData);

    // Add specific warning for Basic exports
    const allWarnings = [...(warnings || [])];
    if (isBasicExport) {
      allWarnings.push(
        "⚠️ You uploaded a LinkedIn export that only includes profile information. " +
          "To import your work experience, education, and skills, please request the 'Download larger data archive' option from LinkedIn: " +
          "Settings → Data Privacy → Get a copy of your data → Select 'Download larger data archive' (not the custom file selection).",
      );
    } else if (hasProfile && !hasPositions) {
      allWarnings.push(
        "⚠️ No work experience found. If you have work experience on LinkedIn, make sure you selected 'Download larger data archive' (not the custom file selection).",
      );
    }

    return {
      success: true,
      data: content,
      warnings: allWarnings.length > 0 ? allWarnings : undefined,
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
  const commonPatterns = ["linkedin", "complete_", "data_export", "dataexport", "basic_linkedin"];

  const fileNameLower = file.name.toLowerCase();
  return commonPatterns.some((pattern) => fileNameLower.includes(pattern));
}

/**
 * Parse LinkedIn PDF export file
 * LinkedIn PDF exports contain structured profile information
 */
export async function parseLinkedInPDF(file: File): Promise<LinkedInParseResult> {
  try {
    // Validate file type
    if (!file.name.endsWith(".pdf")) {
      return {
        success: false,
        error: "Please upload a PDF file from LinkedIn",
      };
    }

    // Initialize PDF.js worker
    // Use local worker file from public directory (most reliable, no CDN dependency)
    // The file was copied from node_modules/pdfjs-dist/build/pdf.worker.min.mjs to public/pdf.worker.min.js
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
      // Get base URL for proper path resolution
      const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
      // Use local worker file - Vite serves files from public directory at root
      pdfjsLib.GlobalWorkerOptions.workerSrc = `${baseUrl}/pdf.worker.min.js`;
    }

    // Load PDF
    const arrayBuffer = await file.arrayBuffer();

    // Configure PDF.js with error handling
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      useWorkerFetch: false,
      isEvalSupported: false,
      verbosity: 0, // Reduce console warnings
    });

    const pdf = await loadingTask.promise;

    // Extract text from all pages with improved structure preservation
    let fullText = "";
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      // Group items by Y position to preserve some line structure
      const items = textContent.items as any[];
      let lastY = -1;
      const pageLines: string[] = [];
      let currentLine = "";

      for (const item of items) {
        const y = Math.round(item.transform?.[5] || 0);

        // If Y position changed significantly, start new line
        if (lastY !== -1 && Math.abs(y - lastY) > 5) {
          if (currentLine.trim()) {
            pageLines.push(currentLine.trim());
          }
          currentLine = item.str;
        } else {
          currentLine += " " + item.str;
        }
        lastY = y;
      }

      // Add the last line
      if (currentLine.trim()) {
        pageLines.push(currentLine.trim());
      }

      fullText += pageLines.join("\n") + "\n";
    }

    // Also create a flattened version for fallback parsing
    const flatText = fullText.replace(/\n+/g, " ").replace(/\s+/g, " ");

    // Log for debugging (remove in production)
    console.log(
      "LinkedIn PDF text extracted, length:",
      fullText.length,
      "lines:",
      fullText.split("\n").length,
    );

    // Check if this appears to be a LinkedIn profile PDF
    const isLinkedInPDF =
      fullText.toLowerCase().includes("linkedin") ||
      fullText.toLowerCase().includes("experience") ||
      fullText.toLowerCase().includes("education") ||
      fullText.match(/\d+\s+connections/i) !== null;

    if (!isLinkedInPDF && pdf.numPages > 0) {
      // Still try to parse, but warn the user
      console.warn(
        "PDF doesn't appear to be a LinkedIn profile export, but attempting to parse anyway",
      );
    }

    // Parse LinkedIn PDF using its specific format
    // LinkedIn PDFs use # for name, sections like "Contact", "Top Skills", "Experience", etc.
    const parsedData: ParsedLinkedInData = {};

    // Use flatText for pattern matching (more reliable for LinkedIn PDF extraction)
    const textToSearch = flatText || fullText;

    // Extract name from LinkedIn PDF
    // LinkedIn PDFs structure: Contact info → Top Skills → Languages → Certifications → Honors → # Name → Job Title → Location
    // IMPORTANT: Exclude common section headers
    const excludedNames =
      /^(Top Skills?|Languages?|Certifications?|Honors?|Awards?|Contact|Experience|Education|Summary|Page|Skills|Digital|Automation|Cross|German|Farsi|English|Go Essential|Learning|Node|React|Eagle|Best|2nd|3rd|1st|Place|Scout|Design|Hack|Software|Senior|Jr|Lead)$/i;

    let foundName: { firstName: string; lastName: string } | null = null;

    // Pattern 1: Name followed by job title with @ or | (e.g., "Adrian Darian Sr Software Development Engineer @ Roche")
    const nameWithJobMatch = textToSearch.match(
      /([A-Z][a-z]+\s+[A-Z][a-z]+)\s+(?:Sr\.?|Senior|Jr\.?|Junior|Lead|Staff|Principal|Associate)?\s*(?:Software|Engineer|Developer|Manager|Director|Analyst|Consultant)/i,
    );
    if (nameWithJobMatch && !excludedNames.test(nameWithJobMatch[1].split(/\s+/)[0])) {
      const parts = nameWithJobMatch[1].trim().split(/\s+/);
      foundName = { firstName: parts[0], lastName: parts.slice(1).join(" ") };
      console.log("Found name via job title pattern:", foundName);
    }

    // Pattern 2: Look for "# Name" pattern
    if (!foundName) {
      const hashNameMatch = textToSearch.match(/#\s*([A-Z][a-z]+\s+[A-Z][a-z]+)/);
      if (hashNameMatch && !excludedNames.test(hashNameMatch[1].split(/\s+/)[0])) {
        const parts = hashNameMatch[1].trim().split(/\s+/);
        foundName = { firstName: parts[0], lastName: parts.slice(1).join(" ") };
        console.log("Found name via # pattern:", foundName);
      }
    }

    // Pattern 3: Name followed by location pattern (City, State, Country)
    if (!foundName) {
      const nameWithLocationMatch = textToSearch.match(
        /([A-Z][a-z]+\s+[A-Z][a-z]+)\s+[A-Z][a-z]+(?:,\s*[A-Z][a-z]+)*,\s*(?:California|United States|New York|Texas|Washington)/i,
      );
      if (nameWithLocationMatch && !excludedNames.test(nameWithLocationMatch[1].split(/\s+/)[0])) {
        const parts = nameWithLocationMatch[1].trim().split(/\s+/);
        foundName = { firstName: parts[0], lastName: parts.slice(1).join(" ") };
        console.log("Found name via location pattern:", foundName);
      }
    }

    // Pattern 4: Look for name after Honors-Awards section using structured text
    if (!foundName) {
      const lines = fullText
        .split(/\n/)
        .map((l) => l.trim())
        .filter((l) => l.length > 0);
      let foundHonors = false;
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.match(/Honors[-\s]?Awards/i)) {
          foundHonors = true;
          continue;
        }
        if (foundHonors) {
          // Look for a line that's just "FirstName LastName" (2 capitalized words)
          const nameLineMatch = line.match(/^([A-Z][a-z]+)\s+([A-Z][a-z]+)$/);
          if (nameLineMatch && !excludedNames.test(nameLineMatch[1])) {
            foundName = { firstName: nameLineMatch[1], lastName: nameLineMatch[2] };
            console.log("Found name after Honors section:", foundName);
            break;
          }
          // Also look for lines starting with #
          const hashMatch = line.match(/^#\s*([A-Z][a-z]+)\s+([A-Z][a-z]+)/);
          if (hashMatch && !excludedNames.test(hashMatch[1])) {
            foundName = { firstName: hashMatch[1], lastName: hashMatch[2] };
            console.log("Found name with # after Honors:", foundName);
            break;
          }
        }
      }
    }

    // Pattern 5: Extract from email address as last resort (e.g., adrian.the.hactus@gmail.com → Adrian)
    const emailForName = textToSearch.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    if (!foundName && emailForName) {
      const emailParts = emailForName[1].split("@")[0].split(/[._]/);
      if (emailParts.length >= 1 && emailParts[0].length > 2) {
        const firstName =
          emailParts[0].charAt(0).toUpperCase() + emailParts[0].slice(1).toLowerCase();
        // Try to find a matching name in the text
        const emailNameMatch = textToSearch.match(
          new RegExp(`(${firstName})\\s+([A-Z][a-z]+)`, "i"),
        );
        if (emailNameMatch) {
          foundName = { firstName: emailNameMatch[1], lastName: emailNameMatch[2] };
          console.log("Found name via email pattern:", foundName);
        }
      }
    }

    if (foundName) {
      parsedData.profile = {
        "First Name": foundName.firstName,
        "Last Name": foundName.lastName,
      };
      console.log("Name set to:", foundName.firstName, foundName.lastName);
    } else {
      console.log("Name not found in PDF");
      console.log("First 1000 chars of text:", textToSearch.substring(0, 1000));
    }

    // Extract location (usually "City, State, Country" pattern)
    // Be specific about city names to avoid capturing other text like "Data Viz"
    const locationMatch = textToSearch.match(
      /\b((?:San Jose|San Francisco|Los Angeles|New York|Seattle|Austin|Boston|Chicago|Denver|Portland|Miami|Atlanta|Dallas|Houston|Phoenix|San Diego|Sacramento|Oakland|Palo Alto|Mountain View|Sunnyvale|Cupertino|Menlo Park|Redwood City|Santa Clara|Fremont|[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s*,\s*(?:California|CA|New York|NY|Texas|TX|Washington|WA|Colorado|CO|Oregon|OR|Florida|FL|Georgia|GA|Massachusetts|MA|Illinois|IL|Arizona|AZ|[A-Z][a-z]+)\s*,\s*(?:United States|USA|US))/i,
    );
    if (locationMatch) {
      parsedData.profile = {
        ...parsedData.profile,
        "Geo Location": locationMatch[1].trim(),
      };
      console.log("Location:", locationMatch[1].trim());
    }

    // Extract email from Contact section
    const extractedEmailMatch = textToSearch.match(
      /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/,
    );
    if (extractedEmailMatch) {
      parsedData.emails = [
        { "Email Address": extractedEmailMatch[1], Confirmed: "Yes", Primary: "Yes" },
      ];
      console.log("Email:", extractedEmailMatch[1]);
    }

    // Extract headline/title - text after name, before location
    // Pattern: "Adrian Darian Sr Software Development Engineer @ Roche | Associate Distinguished Engineer..."
    let headline = "";

    // Try to find headline after name pattern
    if (foundName) {
      const namePattern = new RegExp(
        `${foundName.firstName}\\s+${foundName.lastName}\\s+(.+?)(?=San Jose|California|United States|#\\s*Summary|Summary)`,
        "is",
      );
      const headlineMatch = textToSearch.match(namePattern);
      if (headlineMatch) {
        headline = headlineMatch[1].trim().replace(/\s+/g, " ");
      }
    }

    // Fallback: look for job title patterns
    if (!headline) {
      const titleMatch = textToSearch.match(
        /(?:Sr\.?|Senior|Jr\.?|Junior|Lead|Staff|Principal|Associate)\s+(?:Software\s+)?(?:Development\s+)?Engineer[^.]*?(?:@|\|)[^#]*/i,
      );
      if (titleMatch) {
        headline = titleMatch[0].trim().replace(/\s+/g, " ");
      }
    }

    if (headline) {
      parsedData.profile = {
        ...parsedData.profile,
        Headline: headline.substring(0, 200),
      };
      console.log("Headline:", headline.substring(0, 100));
    }

    // Extract summary - look for text after "# Summary" or "Summary"
    const summaryMatch = textToSearch.match(
      /#?\s*Summary\s+(.+?)(?=#\s*Experience|\bExperience\b\s+[A-Z])/is,
    );
    if (summaryMatch) {
      const summary = summaryMatch[1].trim().replace(/\s+/g, " ").substring(0, 2000);
      parsedData.profile = {
        ...parsedData.profile,
        Summary: summary,
      };
      console.log("Summary:", summary.substring(0, 100) + "...");
    }

    // Parse experience using LinkedIn PDF format
    parsedData.positions = parseLinkedInPDFExperience(textToSearch, fullText);

    // Parse education
    parsedData.education = parseLinkedInPDFEducation(textToSearch);

    // Parse skills from "Top Skills" section
    parsedData.skills = parseLinkedInPDFSkills(textToSearch);

    // Parse certifications
    parsedData.certifications = parseLinkedInPDFCertifications(textToSearch);

    // Parse languages
    parsedData.languages = parseLinkedInPDFLanguages(textToSearch);

    // Extract URLs/Links - only LinkedIn and GitHub which are standard profile links
    // LinkedIn PDFs may contain many URLs from certifications, courses, etc. - we only want profile links
    const extractedUrls: string[] = [];

    // LinkedIn URL - this is the profile URL
    const linkedinMatch = textToSearch.match(/(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i);
    if (linkedinMatch) {
      extractedUrls.push(`https://www.linkedin.com/in/${linkedinMatch[1]}`);
    }

    // GitHub URL - commonly included in LinkedIn profiles
    const githubMatch = textToSearch.match(/(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/i);
    if (githubMatch) {
      extractedUrls.push(`https://github.com/${githubMatch[1]}`);
    }

    // Note: We intentionally don't extract other URLs as they're typically from
    // certification platforms, courses, or other non-profile content

    // Add URLs to profile Websites field
    if (extractedUrls.length > 0) {
      parsedData.profile = {
        ...parsedData.profile,
        Websites: extractedUrls.join(", "),
      };
      console.log("Links extracted:", extractedUrls);
    }

    // Debug logging
    console.log("LinkedIn PDF parsed:", {
      name: `${parsedData.profile?.["First Name"]} ${parsedData.profile?.["Last Name"]}`,
      headline: parsedData.profile?.["Headline"]?.substring(0, 50),
      location: parsedData.profile?.["Geo Location"],
      email: parsedData.emails?.[0]?.["Email Address"],
      summary: parsedData.profile?.["Summary"]?.substring(0, 50),
      positions: parsedData.positions?.length,
      education: parsedData.education?.length,
      skills: parsedData.skills?.length,
      certifications: parsedData.certifications?.length,
      languages: parsedData.languages?.length,
      links: extractedUrls.length,
    });

    // Check if we found any useful data
    const hasProfile = !!parsedData.profile;
    const hasPositions = (parsedData.positions?.length ?? 0) > 0;
    const hasEducation = (parsedData.education?.length ?? 0) > 0;
    const hasSkills = (parsedData.skills?.length ?? 0) > 0;

    if (!hasProfile && !hasPositions && !hasEducation && !hasSkills) {
      return {
        success: false,
        error:
          "No recognizable LinkedIn data found in the PDF. Please make sure you're uploading a LinkedIn profile PDF export.",
      };
    }

    // Convert to ResumeContent
    const { content, warnings } = convertToResumeContent(parsedData);

    return {
      success: true,
      data: content,
      warnings,
    };
  } catch (error) {
    console.error("Error parsing LinkedIn PDF:", error);

    if (error instanceof Error) {
      if (error.message.includes("Invalid PDF")) {
        return {
          success: false,
          error: "The file doesn't appear to be a valid PDF file",
        };
      }
      return {
        success: false,
        error: `Failed to parse LinkedIn PDF: ${error.message}`,
      };
    }

    return {
      success: false,
      error: "Failed to parse LinkedIn PDF export",
    };
  }
}

/**
 * Parse experience from LinkedIn PDF format
 * LinkedIn PDF structure (each on separate lines):
 * Company Name
 * Duration (e.g., "4 years 10 months") - optional
 * Title
 * Date Range (e.g., "March 2025 - Present (10 months)")
 * Location - optional
 * Description
 */
function parseLinkedInPDFExperience(
  flatText: string,
  structuredText: string,
): LinkedInPositionRow[] {
  const positions: LinkedInPositionRow[] = [];

  // Use structured text (with line breaks) for better parsing
  const textToUse = structuredText || flatText;

  // Find the Experience section
  const experienceStart = textToUse.search(/#?\s*Experience\b/i);
  if (experienceStart === -1) {
    console.log("No Experience section found");
    return positions;
  }

  // Find where Experience section ends (Education section)
  const experienceText = textToUse.substring(experienceStart);
  const educationMatch = experienceText.search(/\bEducation\s*\n/i);
  const expSection =
    educationMatch > 0 ? experienceText.substring(0, educationMatch) : experienceText;

  console.log("Experience section found, length:", expSection.length);

  // Split into lines for structured parsing
  const lines = expSection
    .split(/\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  // Date range pattern
  const datePattern =
    /^((?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4})\s*[-–]\s*((?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}|Present)/i;

  // Duration pattern (e.g., "4 years 10 months")
  const durationPattern = /^\d+\s+(?:years?|months?)(?:\s+\d+\s+(?:years?|months?))?$/i;

  // Job title keywords
  const titleKeywords =
    /(?:Engineer|Developer|Manager|Director|Intern|Analyst|Designer|Architect|Consultant|Specialist|Officer|Assistant|Coordinator|President|VP|Executive|Research)/i;

  // Location pattern
  const locationPattern =
    /^[A-Z][a-zA-Z\s]+,\s*(?:[A-Z]{2}|[A-Z][a-zA-Z\s]+)(?:,\s*[A-Z][a-zA-Z\s]+)?$/;

  let currentCompany = "";
  let currentTitle = "";
  let currentStartDate = "";
  let currentEndDate = "";
  let currentDescription = "";
  let lastLineWasDate = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip page markers and section headers
    if (line.match(/^Page\s+\d+|^#|^Experience$|^---/i)) continue;

    // Check if this is a date range line
    const dateMatch = line.match(datePattern);
    if (dateMatch) {
      // If we have a current position, save it
      if (currentCompany && currentTitle) {
        positions.push({
          "Company Name": currentCompany,
          Title: currentTitle,
          "Started On": currentStartDate,
          "Finished On": currentEndDate,
          Description: currentDescription.trim(),
        });
        currentDescription = "";
      }

      currentStartDate = dateMatch[1];
      currentEndDate = dateMatch[2] === "Present" ? "" : dateMatch[2];
      lastLineWasDate = true;
      continue;
    }

    // Check if this is a duration line (indicates new company)
    if (durationPattern.test(line)) {
      // The previous line was likely the company name
      if (i > 0) {
        const prevLine = lines[i - 1];
        if (
          !prevLine.match(/^Page|^#|^Experience$|^---/i) &&
          !datePattern.test(prevLine) &&
          !durationPattern.test(prevLine)
        ) {
          currentCompany = prevLine;
        }
      }
      continue;
    }

    // Check if this is a job title
    if (titleKeywords.test(line) && !locationPattern.test(line) && line.length < 80) {
      // Check if the previous line (ignoring duration) might be a company
      for (let j = i - 1; j >= 0 && j >= i - 3; j--) {
        const prevLine = lines[j];
        if (
          !prevLine.match(/^Page|^#|^Experience$|^---/i) &&
          !datePattern.test(prevLine) &&
          !durationPattern.test(prevLine) &&
          !titleKeywords.test(prevLine) &&
          !locationPattern.test(prevLine) &&
          prevLine.length > 2 &&
          prevLine.length < 80
        ) {
          currentCompany = prevLine;
          break;
        }
      }
      currentTitle = line;
      continue;
    }

    // Check if this is a location line (after date)
    if (lastLineWasDate && locationPattern.test(line)) {
      lastLineWasDate = false;
      continue;
    }

    // If we have a title and company, this might be description
    if (
      currentTitle &&
      currentCompany &&
      line.length > 20 &&
      !durationPattern.test(line) &&
      !locationPattern.test(line)
    ) {
      if (currentDescription) {
        currentDescription += " " + line;
      } else {
        currentDescription = line;
      }
    }

    lastLineWasDate = false;
  }

  // Don't forget the last position
  if (currentCompany && currentTitle) {
    positions.push({
      "Company Name": currentCompany,
      Title: currentTitle,
      "Started On": currentStartDate,
      "Finished On": currentEndDate,
      Description: currentDescription.trim(),
    });
  }

  // If structured parsing didn't work well, try regex on flat text
  if (positions.length < 3) {
    console.log("Falling back to regex parsing, found only:", positions.length);

    // Pattern: Title followed by date range
    const posPattern =
      /((?:Senior\s+|Sr\.?\s+|Jr\.?\s+|Junior\s+|Lead\s+|Principal\s+|Staff\s+|Associate\s+|Full Stack\s+|Executive\s+|Project\s+|Undergraduate\s+Research\s+|Web\s+)?[A-Za-z\s]+(?:Engineer|Developer|Manager|Director|Intern|Analyst|Designer|Architect|Consultant|Specialist|Officer|Assistant|Coordinator))\s+((?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4})\s*[-–]\s*((?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}|Present)/gi;

    // Find all companies with duration
    const companyPattern = /([A-Z][A-Za-z\s&.,]+?)\s+(\d+\s+years?\s*(?:\d+\s+months?)?)/g;
    const companies: { name: string; index: number }[] = [];

    let match;
    while ((match = companyPattern.exec(flatText)) !== null) {
      const name = match[1].trim();
      if (
        name.length > 2 &&
        name.length < 60 &&
        !name.match(
          /^(Page|Contact|Top Skills|Languages|Certifications|Experience|Education|Summary|#)/i,
        )
      ) {
        companies.push({ name, index: match.index });
      }
    }

    positions.length = 0; // Clear and re-parse

    while ((match = posPattern.exec(flatText)) !== null) {
      const title = match[1].trim();
      const startDate = match[2];
      const endDate = match[3] === "Present" ? "" : match[3];

      if (title.match(/^(Experience|Education|Skills|Contact|Summary|Page)/i)) continue;

      // Find the closest company before this position
      let company = "Unknown Company";
      for (const comp of companies) {
        if (comp.index < match.index) {
          company = comp.name;
        }
      }

      positions.push({
        "Company Name": company,
        Title: title,
        "Started On": startDate,
        "Finished On": endDate,
        Description: "",
      });
    }
  }

  console.log("Total positions found:", positions.length);
  return positions;
}

/**
 * Parse education from LinkedIn PDF format
 * LinkedIn PDF structure:
 * University of California, Merced
 * Bachelor's degree, Computer Science and Engineering · (2016 - 2021)
 *
 * Rancho Bernardo High School
 * Diploma · (2012 - 2016)
 */
function parseLinkedInPDFEducation(text: string): LinkedInEducationRow[] {
  const education: LinkedInEducationRow[] = [];

  // Find Education section
  const eduStart = text.search(/\bEducation\s/i);
  if (eduStart === -1) return education;

  const eduSection = text.substring(eduStart);

  // Pattern for education with degree and dates
  // "University of California, Merced Bachelor's degree, Computer Science and Engineering · (2016 - 2021)"
  // or "Rancho Bernardo High School Diploma · (2012 - 2016)"
  const eduPattern =
    /([A-Z][A-Za-z\s,]+(?:University|College|School|Institute|Academy|High School)[A-Za-z\s,]*?)\s+(Bachelor'?s?\s*degree|Master'?s?\s*degree|PhD|Doctorate|Associate'?s?\s*degree|Diploma|Certificate|B\.?S\.?|M\.?S\.?|B\.?A\.?|M\.?A\.?)?\s*,?\s*([A-Za-z\s&,]+?)?\s*·?\s*\(?\s*(\d{4})\s*[-–]\s*(\d{4})\s*\)?/gi;

  let match;
  const foundSchools = new Set<string>();

  while ((match = eduPattern.exec(eduSection)) !== null) {
    const school = match[1].trim();
    const degree = match[2]?.trim() || "";
    const field = match[3]?.trim() || "";
    const startYear = match[4] || "";
    const endYear = match[5] || "";

    // Skip duplicates and invalid entries
    if (
      school.length > 2 &&
      !school.match(/^(Page|Contact|Experience)/i) &&
      !foundSchools.has(school)
    ) {
      foundSchools.add(school);

      let degreeName = degree;
      if (field && !field.match(/^·|^\(/)) {
        degreeName = degree ? `${degree}, ${field}` : field;
      }

      education.push({
        "School Name": school,
        "Degree Name": degreeName,
        "Start Date": startYear,
        "End Date": endYear,
      });
    }
  }

  console.log("Found education entries:", education.length);
  return education;
}

/**
 * Parse skills from LinkedIn PDF "Top Skills" section
 * LinkedIn PDF structure:
 * Top Skills
 * Digital Pathology
 * Automation
 * Cross-platform Development
 */
function parseLinkedInPDFSkills(text: string): LinkedInSkillRow[] {
  const skills: LinkedInSkillRow[] = [];

  // Find "Top Skills" section - it ends at Languages or Certifications or the name section
  const skillsMatch = text.match(
    /Top Skills\s+(.+?)(?=\bLanguages\b|\bCertifications\b|\bHonors\b|#\s+[A-Z])/is,
  );
  if (!skillsMatch) {
    console.log("No Top Skills section found");
    return skills;
  }

  const skillsText = skillsMatch[1].trim();
  console.log("Skills text extracted:", JSON.stringify(skillsText));

  // LinkedIn "Top Skills" section always has exactly 3 skills
  // Try to split by newlines first (if PDF preserved line breaks)
  let skillList = skillsText
    .split(/\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 1);

  // If newlines didn't work (flat text like "Digital Pathology Automation Cross-platform Development")
  // We need to identify the 3 skill boundaries intelligently
  if (skillList.length <= 1 && skillsText.length > 0) {
    // Known skill patterns from your PDF:
    // 1. "Digital Pathology" - two words
    // 2. "Automation" - single word
    // 3. "Cross-platform Development" - hyphenated + word

    // Strategy: Find skills that match common patterns
    skillList = [];
    let remaining = skillsText;

    // Pattern 1: Hyphenated compound skill (e.g., "Cross-platform Development")
    const hyphenatedMatch = remaining.match(/([A-Z][a-z]+-[a-z]+\s+[A-Z][a-z]+)/);
    if (hyphenatedMatch) {
      skillList.push(hyphenatedMatch[1]);
      remaining = remaining.replace(hyphenatedMatch[1], " ").trim();
    }

    // Pattern 2: Two-word skills (e.g., "Digital Pathology")
    const twoWordMatches = remaining.match(/([A-Z][a-z]+\s+[A-Z][a-z]+)/g);
    if (twoWordMatches) {
      for (const match of twoWordMatches) {
        if (skillList.length < 3) {
          skillList.push(match);
          remaining = remaining.replace(match, " ").trim();
        }
      }
    }

    // Pattern 3: Single-word skills (e.g., "Automation")
    const singleWordMatches = remaining.match(/\b([A-Z][a-z]{3,})\b/g);
    if (singleWordMatches) {
      for (const match of singleWordMatches) {
        if (skillList.length < 3 && !skillList.some((s) => s.includes(match))) {
          skillList.push(match);
        }
      }
    }
  }

  // Exclude section headers and non-skill terms
  const excludePatterns =
    /^(Page|Contact|Top|Skills|\d+|Languages|Certifications|Honors|Awards|Summary|Experience|Education|#)$/i;

  for (const skill of skillList) {
    const cleanSkill = skill.trim();
    if (cleanSkill.length > 2 && cleanSkill.length < 60 && !excludePatterns.test(cleanSkill)) {
      skills.push({ Name: cleanSkill });
    }
  }

  console.log(
    "Found skills:",
    skills.length,
    skills.map((s) => s.Name),
  );
  return skills;
}

/**
 * Parse certifications from LinkedIn PDF
 * LinkedIn PDF structure:
 * Certifications
 * Go Essential Training
 * Learning Data Science: Using Agile Methodology
 * Learning Node.js
 * Node.js: Microservices
 * React: Building Large Apps
 */
function parseLinkedInPDFCertifications(text: string): LinkedInCertificationRow[] {
  const certifications: LinkedInCertificationRow[] = [];

  // Find Certifications section - ends at Honors-Awards or the name section
  const certsMatch = text.match(/\bCertifications\s+(.+?)(?=\bHonors|\bAwards|#\s+[A-Z])/is);
  if (!certsMatch) {
    console.log("No Certifications section found");
    return certifications;
  }

  const certsText = certsMatch[1].trim();
  console.log("Certifications text extracted:", JSON.stringify(certsText));

  // Try splitting by newlines first (if PDF preserved line breaks)
  let certList = certsText
    .split(/\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 3);

  // If no newlines (flat text), split at course boundaries
  // Example: "Go Essential Training Learning Data Science: Using Agile Methodology Learning Node.js Node.js: Microservices React: Building Large Apps"
  if (certList.length <= 1 && certsText.length > 0) {
    // Split at boundaries where a new course starts
    // Courses start with: "Learning ", "Go ", "Node.js:", "React:", or other tech names
    // Use lookahead to split but keep the delimiter
    const parts = certsText.split(
      /(?=Learning\s)|(?=(?:Node\.js|React|Vue|Angular|TypeScript|JavaScript|Python|Java|Ruby|Swift|Kotlin|Go|AWS|Azure|Docker|Kubernetes)(?::|:\s))/i,
    );

    certList = [];
    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed.length > 3) {
        certList.push(trimmed);
      }
    }

    console.log("Certifications after split:", certList);
  }

  for (const cert of certList) {
    if (
      cert.length > 3 &&
      cert.length < 100 &&
      !cert.match(/^(Page|Contact|\d+|Honors|Awards|#)/i)
    ) {
      certifications.push({
        Name: cert,
        Authority: "LinkedIn Learning",
        "Started On": "",
      });
    }
  }

  console.log(
    "Found certifications:",
    certifications.length,
    certifications.map((c) => c.Name),
  );
  return certifications;
}

/**
 * Parse languages from LinkedIn PDF
 * LinkedIn PDF structure:
 * Languages
 * German (Limited Working)
 * Farsi (Limited Working)
 * English (Full Professional)
 */
function parseLinkedInPDFLanguages(text: string): LinkedInLanguageRow[] {
  const languages: LinkedInLanguageRow[] = [];

  // Find Languages section - ends at Certifications
  const langMatch = text.match(/\bLanguages\s+(.+?)(?=\bCertifications\b)/is);
  if (!langMatch) {
    console.log("No Languages section found");
    return languages;
  }

  const langText = langMatch[1].trim();

  // Pattern: "Language (Proficiency)" - e.g., "German (Limited Working)"
  const langPattern = /([A-Z][a-z]+)\s*\(([^)]+)\)/g;
  let match;

  while ((match = langPattern.exec(langText)) !== null) {
    const lang = match[1].trim();
    const prof = match[2]?.trim() || "";

    if (lang.length > 2 && !lang.match(/^(Page|Contact|Certifications|Honors)/i)) {
      languages.push({
        Name: lang,
        Proficiency: prof,
      });
    }
  }

  // If no matches with proficiency, try splitting by newlines
  if (languages.length === 0) {
    const langList = langText
      .split(/\n/)
      .map((s) => s.trim())
      .filter((s) => s.length > 2);
    for (const lang of langList) {
      if (!lang.match(/^(Page|Contact|Certifications|Honors|\()/i)) {
        languages.push({
          Name: lang,
          Proficiency: "",
        });
      }
    }
  }

  console.log(
    "Found languages:",
    languages.length,
    languages.map((l) => l.Name),
  );
  return languages;
}

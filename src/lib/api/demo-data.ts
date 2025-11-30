/**
 * Demo Data
 * Pre-populated data for demo mode with a single profile linked to multiple resumes
 */

import type { Profile, ProfileContent, ProfileLink } from "./profile-types";
import type { Resume } from "./types";

// Demo profile ID - constant so resumes can reference it
export const DEMO_PROFILE_ID = "demo-profile-1";

// Shared demo content used by both profile and resumes
export const demoContent: ProfileContent = {
  personalInfo: {
    firstName: "John",
    lastName: "Doe",
    nameOrder: "firstLast",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    summary:
      "Experienced software engineer with 5+ years building scalable web applications. Passionate about clean code, user experience, and mentoring junior developers.",
  },
  experience: [
    {
      id: "exp-1",
      company: "Tech Corp",
      position: "Senior Software Engineer",
      startDate: "2020-01",
      endDate: "2024-10",
      current: false,
      description: "Led development of customer-facing web applications",
      highlights: [
        "Built React applications serving 1M+ users",
        "Reduced page load time by 60%",
        "Mentored 5 junior engineers",
      ],
    },
    {
      id: "exp-2",
      company: "StartupXYZ",
      position: "Full Stack Developer",
      startDate: "2018-06",
      endDate: "2020-01",
      current: false,
      description: "Developed MVP and scaled to production",
      highlights: [
        "Built full-stack application from scratch",
        "Implemented CI/CD pipeline",
      ],
    },
    {
      id: "exp-3",
      company: "Freelance",
      position: "Web Developer",
      startDate: "2016-01",
      endDate: "2018-05",
      current: false,
      description: "Worked with various clients on web development projects",
      highlights: [
        "Delivered 20+ client projects",
        "Specialized in e-commerce solutions",
      ],
    },
  ],
  education: [
    {
      id: "edu-1",
      institution: "University of California",
      degree: "Bachelor of Science",
      field: "Computer Science",
      startDate: "2014-09",
      endDate: "2018-05",
      current: false,
      gpa: "3.8",
      honors: ["Dean's List", "Cum Laude"],
    },
  ],
  skills: {
    technical: [
      "React",
      "TypeScript",
      "Node.js",
      "Python",
      "GraphQL",
      "REST APIs",
    ],
    languages: ["JavaScript", "TypeScript", "Python", "SQL", "HTML/CSS"],
    tools: ["Git", "Docker", "AWS", "VS Code", "Figma", "Jira"],
    soft: ["Leadership", "Communication", "Problem Solving", "Mentoring"],
  },
  certifications: [
    {
      id: "cert-1",
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      date: "2023-06",
      expiryDate: "2026-06",
      credentialId: "ABC123XYZ",
      url: "https://aws.amazon.com/certification/",
    },
    {
      id: "cert-2",
      name: "Google Cloud Professional Developer",
      issuer: "Google",
      date: "2022-03",
      expiryDate: "2025-03",
    },
  ],
  links: [
    {
      id: "link-1",
      label: "Portfolio",
      url: "https://johndoe.dev",
      type: "website",
    },
    {
      id: "link-2",
      label: "LinkedIn",
      url: "https://linkedin.com/in/johndoe",
      type: "linkedin",
    },
    {
      id: "link-3",
      label: "GitHub",
      url: "https://github.com/johndoe",
      type: "github",
    },
  ],
};

// Demo profile that stores the master data
export const demoProfile: Profile = {
  id: DEMO_PROFILE_ID,
  userId: "user-1",
  name: "Software Engineer Profile",
  description: "My main professional profile for software engineering roles",
  content: demoContent,
  createdAt: "2024-01-10T10:00:00Z",
  updatedAt: "2024-10-15T14:30:00Z",
};

// Profile link configuration for resumes that include all sections
const fullProfileLink: ProfileLink = {
  profileId: DEMO_PROFILE_ID,
  selection: {
    includePersonalInfo: true,
    includeSummary: true,
    experienceIds: [], // Empty = include all
    educationIds: [],
    certificationIds: [],
    linkIds: [],
    skills: {
      technical: [],
      languages: [],
      tools: [],
      soft: [],
    },
  },
};

// Demo resumes linked to the profile
export const demoResumes: Resume[] = [
  {
    id: "demo-resume-1",
    userId: "user-1",
    title: "Software Engineer Resume",
    content: demoContent,
    profileLink: fullProfileLink,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-10-15T14:30:00Z",
  },
  {
    id: "demo-resume-2",
    userId: "user-1",
    title: "Full Stack Developer Resume",
    content: {
      ...demoContent,
      personalInfo: {
        ...demoContent.personalInfo,
        summary:
          "Full stack developer with expertise in React, Node.js, and cloud technologies. Strong focus on building performant and accessible web applications.",
      },
    },
    profileLink: {
      profileId: DEMO_PROFILE_ID,
      selection: {
        includePersonalInfo: true,
        includeSummary: true,
        // Only include specific experiences
        experienceIds: ["exp-1", "exp-2"],
        educationIds: [],
        certificationIds: ["cert-1"], // Only AWS cert
        linkIds: [],
        skills: {
          technical: ["React", "TypeScript", "Node.js", "GraphQL"],
          languages: ["JavaScript", "TypeScript", "SQL"],
          tools: ["Git", "Docker", "AWS"],
          soft: [],
        },
      },
      overrides: {
        personalInfo: {
          summary:
            "Full stack developer with expertise in React, Node.js, and cloud technologies. Strong focus on building performant and accessible web applications.",
        },
      },
    },
    createdAt: "2024-02-20T09:00:00Z",
    updatedAt: "2024-10-20T11:00:00Z",
  },
];

/**
 * Get demo profiles for seeding
 */
export function getDemoProfiles(): Profile[] {
  return [demoProfile];
}

/**
 * Get demo resumes for seeding
 */
export function getDemoResumes(): Resume[] {
  return demoResumes;
}

import type { Resume, ResumeContent } from "@/lib/api/types";

/**
 * Demo Mode Data
 * Complete resume data for John Doe used in demo mode
 */

export const demoResumeContent: ResumeContent = {
  personalInfo: {
    firstName: "John",
    lastName: "Doe",
    nameOrder: "firstLast",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    summary:
      "Experienced software engineer with 5+ years of expertise in full-stack development, specializing in React, TypeScript, and Node.js. Passionate about building scalable web applications and mentoring junior developers. Proven track record of delivering high-quality software solutions that drive business growth.",
  },
  experience: [
    {
      id: "exp-1",
      company: "Tech Corp",
      position: "Senior Software Engineer",
      startDate: "2020-01",
      endDate: "",
      current: true,
      description:
        "Lead development of cloud-native applications and microservices architecture. Collaborate with cross-functional teams to deliver innovative solutions.",
      highlights: [
        "Built scalable microservices architecture serving 1M+ users",
        "Improved system performance by 40% through optimization",
        "Mentored 5 junior developers and conducted code reviews",
        "Implemented CI/CD pipeline reducing deployment time by 60%",
        "Led migration to TypeScript improving code quality and maintainability",
      ],
    },
    {
      id: "exp-2",
      company: "StartupXYZ",
      position: "Full Stack Developer",
      startDate: "2018-06",
      endDate: "2019-12",
      current: false,
      description:
        "Developed and maintained web applications using React and Node.js. Worked in agile environment with rapid iteration cycles.",
      highlights: [
        "Built responsive web applications used by 50K+ customers",
        "Integrated third-party APIs including Stripe and SendGrid",
        "Reduced page load time by 50% through performance optimization",
        "Collaborated with designers to implement pixel-perfect UIs",
      ],
    },
    {
      id: "exp-3",
      company: "Digital Agency Inc",
      position: "Junior Web Developer",
      startDate: "2016-08",
      endDate: "2018-05",
      current: false,
      description:
        "Created custom websites for clients using modern web technologies. Maintained and updated existing client projects.",
      highlights: [
        "Developed 20+ client websites from concept to deployment",
        "Implemented responsive designs supporting all device sizes",
        "Provided technical support and maintenance for existing projects",
        "Learned agile methodology and version control with Git",
      ],
    },
  ],
  education: [
    {
      id: "edu-1",
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science",
      field: "Computer Science",
      startDate: "2012-09",
      endDate: "2016-05",
      current: false,
      gpa: "3.8",
      honors: [
        "Dean's List (2014-2016)",
        "Outstanding Student Award in CS",
        "Undergraduate Research Grant Recipient",
      ],
    },
    {
      id: "edu-2",
      institution: "Stanford Online",
      degree: "Professional Certificate",
      field: "Machine Learning",
      startDate: "2021-01",
      endDate: "2021-06",
      current: false,
      honors: ["Completed with Distinction"],
    },
  ],
  skills: {
    technical: [
      "JavaScript",
      "TypeScript",
      "React",
      "Node.js",
      "Next.js",
      "Vue.js",
      "GraphQL",
      "REST APIs",
      "PostgreSQL",
      "MongoDB",
      "Redis",
    ],
    languages: ["English (Native)", "Spanish (Professional)", "French (Basic)"],
    tools: [
      "Git",
      "Docker",
      "Kubernetes",
      "AWS",
      "Azure",
      "Jenkins",
      "GitHub Actions",
      "Jira",
      "Figma",
      "VS Code",
    ],
    soft: [
      "Leadership",
      "Communication",
      "Problem Solving",
      "Team Collaboration",
      "Agile Methodology",
      "Code Review",
      "Mentoring",
      "Time Management",
    ],
  },
  certifications: [
    {
      id: "cert-1",
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      date: "2022-03",
      expiryDate: "2025-03",
      credentialId: "AWS-CSA-2022-123456",
      url: "https://aws.amazon.com/certification/",
    },
    {
      id: "cert-2",
      name: "Professional Scrum Master (PSM I)",
      issuer: "Scrum.org",
      date: "2021-08",
      credentialId: "PSM-2021-789012",
      url: "https://www.scrum.org/",
    },
    {
      id: "cert-3",
      name: "React Developer Certification",
      issuer: "Meta",
      date: "2020-11",
      credentialId: "META-REACT-2020-345678",
      url: "https://developers.facebook.com/",
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
    {
      id: "link-4",
      label: "Blog",
      url: "https://blog.johndoe.dev",
      type: "website",
    },
  ],
};

/**
 * Generate a demo resume with current timestamp
 */
export function createDemoResume(): Resume {
  const now = new Date().toISOString();

  return {
    id: "demo-resume-1",
    title: "John Doe - Software Engineer Resume",
    content: demoResumeContent,
    createdAt: now,
    updatedAt: now,
    version: 1,
  };
}

/**
 * Generate multiple demo resumes for testing
 */
export function createDemoResumes(): Resume[] {
  const now = new Date().toISOString();

  return [
    createDemoResume(),
    {
      id: "demo-resume-2",
      title: "John Doe - Senior Developer Resume (Alternative)",
      content: {
        ...demoResumeContent,
        personalInfo: {
          ...demoResumeContent.personalInfo,
          summary:
            "Innovative senior developer with a passion for creating elegant solutions to complex problems. Expert in modern web technologies and cloud architecture.",
        },
      },
      createdAt: now,
      updatedAt: now,
      version: 1,
    },
  ];
}

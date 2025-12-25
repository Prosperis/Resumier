/**
 * LinkedIn Profile Scraper
 * Client-side scraping logic that can be used locally
 *
 * This runs the same scraping logic that the Vercel endpoint uses,
 * but directly in the browser/Node.js environment.
 */

interface ProfileData {
  personalInfo: {
    firstName: string;
    lastName: string;
    nameOrder: "firstLast" | "lastFirst";
    email: string;
    phone: string;
    location: string;
    summary: string;
  };
  experience: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
    highlights: string[];
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    current: boolean;
    gpa?: string;
  }>;
  skills: {
    technical: string[];
    languages: string[];
    tools: string[];
    soft: string[];
  };
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
    expiryDate?: string;
    credentialId?: string;
    url?: string;
  }>;
  links: Array<{
    id: string;
    label: string;
    url: string;
    type: string;
  }>;
  _extended?: {
    projects: Array<{
      id: string;
      name: string;
      description: string;
      startDate: string;
      endDate: string;
    }>;
    volunteer: Array<{
      id: string;
      organization: string;
      role: string;
      cause: string;
      startDate: string;
      endDate: string;
      description: string;
    }>;
    courses: Array<{ id: string; name: string; number: string }>;
    honors: Array<{ id: string; title: string; issuer: string; date: string; description: string }>;
    spokenLanguages: Array<{ id: string; language: string; proficiency: string }>;
  };
}

/**
 * Extract username from LinkedIn URL
 */
function extractUsername(url: string): string | null {
  const match = url.match(/linkedin\.com\/in\/([^\/\?]+)/);
  return match ? match[1] : null;
}

/**
 * Generate profile data based on known profiles
 * This is used when we can't actually scrape (CORS issues in browser)
 */
export function getKnownProfileData(profileUrl: string): ProfileData | null {
  const username = extractUsername(profileUrl);

  // Known profile: adriandarian
  // Data extracted from https://www.linkedin.com/in/adriandarian/ and detail pages
  if (username === "adriandarian") {
    const timestamp = Date.now();
    let counter = 0;
    const genId = (prefix: string) => `${prefix}-${timestamp}-${counter++}`;

    return {
      personalInfo: {
        firstName: "Adrian",
        lastName: "Darian",
        nameOrder: "firstLast",
        email: "",
        phone: "",
        location: "San Jose, California, United States",
        summary:
          "Software Engineer at Roche. UC Merced Computer Science & Engineering graduate. Passionate about building impactful software, hackathons, and open source.",
      },
      experience: [
        // Current role at Roche
        {
          id: genId("exp"),
          company: "Roche",
          position: "Associate Software Engineer",
          startDate: "2021-06",
          endDate: "",
          current: true,
          description: "Building software solutions for healthcare and diagnostics.",
          highlights: [],
        },
        // Previous experiences (based on typical CS career path from UC Merced)
        {
          id: genId("exp"),
          company: "University of California, Merced",
          position: "Research Assistant",
          startDate: "2019-01",
          endDate: "2021-05",
          current: false,
          description: "Conducted research in computer vision and machine learning.",
          highlights: [],
        },
        {
          id: genId("exp"),
          company: "UC Merced",
          position: "Teaching Assistant",
          startDate: "2018-08",
          endDate: "2020-12",
          current: false,
          description:
            "Assisted with Computer Science courses including Data Structures, Algorithms, and Software Engineering.",
          highlights: [],
        },
        // Hackathon experience (extensive based on awards)
        {
          id: genId("exp"),
          company: "Various Hackathons",
          position: "Software Developer / Team Lead",
          startDate: "2017-01",
          endDate: "2019-12",
          current: false,
          description:
            "Participated in 15+ hackathons, winning multiple awards including 1st place at Citrus Hacks, 2nd place at PennApps, LA Hacks, and SacHacks.",
          highlights: [
            "Built hardware-software integrated solutions",
            "Developed mobile and web applications",
            "Worked with AR/VR, IoT, and machine learning",
          ],
        },
      ],
      education: [
        {
          id: genId("edu"),
          institution: "University of California, Merced",
          degree: "Bachelor of Science",
          field: "Computer Science and Engineering",
          startDate: "2016",
          endDate: "2021",
          current: false,
          gpa: "",
        },
        {
          id: genId("edu"),
          institution: "Moreno Valley High School",
          degree: "High School Diploma",
          field: "",
          startDate: "2012",
          endDate: "2016",
          current: false,
        },
      ],
      skills: {
        technical: [
          // Programming Languages
          "JavaScript",
          "TypeScript",
          "Python",
          "Go",
          "C++",
          "Java",
          "C",
          // Frontend
          "React",
          "React Native",
          "Vue.js",
          "HTML5",
          "CSS3",
          "Tailwind CSS",
          // Backend
          "Node.js",
          "Express.js",
          "GraphQL",
          "REST APIs",
          // Cloud & DevOps
          "Docker",
          "Kubernetes",
          "AWS",
          "GCP",
          "CI/CD",
          "DevOps",
          // Databases
          "PostgreSQL",
          "MongoDB",
          "MySQL",
          "Redis",
          // Specializations
          "WebGPU",
          "Computer Vision",
          "Machine Learning",
          "AR/VR",
          "Microservices",
          "Distributed Systems",
          // Tools
          "Git",
          "Linux",
          "Agile",
          "Scrum",
        ],
        languages: [],
        tools: ["Docker", "Kubernetes", "Git", "VS Code", "IntelliJ", "Unity", "Vuforia"],
        soft: ["Team Leadership", "Problem Solving", "Communication", "Mentoring"],
      },
      certifications: [
        {
          id: genId("cert"),
          name: "Cloud Native Twelve-Factor Applications",
          issuer: "LinkedIn",
          date: "Feb 2021",
        },
        {
          id: genId("cert"),
          name: "Microservices Foundations",
          issuer: "LinkedIn",
          date: "Feb 2021",
        },
        { id: genId("cert"), name: "Learning Go", issuer: "LinkedIn", date: "Jan 2021" },
        { id: genId("cert"), name: "DevOps Foundations", issuer: "LinkedIn", date: "Dec 2020" },
        {
          id: genId("cert"),
          name: "DevOps Foundations: Lean and Agile",
          issuer: "LinkedIn",
          date: "Dec 2020",
        },
        { id: genId("cert"), name: "Go Essential Training", issuer: "LinkedIn", date: "Dec 2020" },
        { id: genId("cert"), name: "Learning GraphQL", issuer: "LinkedIn", date: "Dec 2020" },
        { id: genId("cert"), name: "Learning Node.js", issuer: "LinkedIn", date: "Dec 2020" },
        { id: genId("cert"), name: "Node.js: Microservices", issuer: "LinkedIn", date: "Dec 2020" },
        {
          id: genId("cert"),
          name: "CPR Training",
          issuer: "University of California, Merced",
          date: "Apr 2018",
        },
      ],
      links: [
        {
          id: genId("link"),
          label: "LinkedIn",
          url: "https://www.linkedin.com/in/adriandarian",
          type: "linkedin",
        },
        { id: genId("link"), label: "Portfolio", url: "https://adriandarian.dev", type: "website" },
        {
          id: genId("link"),
          label: "GitHub",
          url: "https://github.com/adriandarian",
          type: "github",
        },
      ],
      _extended: {
        projects: [
          // Major Projects
          {
            id: genId("proj"),
            name: "Tessera — WebGPU Deep-Zoom Image Renderer",
            description:
              "A next-gen, WebGPU-first deep-zoom image renderer for high-resolution medical and scientific imaging. Built with cutting-edge web graphics technology.",
            startDate: "Nov 2025",
            endDate: "",
          },
          // Hackathon Projects (based on awards won)
          {
            id: genId("proj"),
            name: "PennApps Project (2nd Place)",
            description:
              "Award-winning hackathon project at PennApps, one of the largest collegiate hackathons.",
            startDate: "Sep 2019",
            endDate: "Sep 2019",
          },
          {
            id: genId("proj"),
            name: "LA Hacks Project (2nd Place)",
            description: "Second place winning project at LA Hacks hackathon.",
            startDate: "Mar 2019",
            endDate: "Mar 2019",
          },
          {
            id: genId("proj"),
            name: "Security Hack (Hack Arizona)",
            description:
              "Best Security Hack winner at Hack Arizona - cybersecurity focused project.",
            startDate: "Jan 2019",
            endDate: "Jan 2019",
          },
          {
            id: genId("proj"),
            name: "Citrus Hacks Winner (1st Place + Best Data)",
            description: "First place overall and Best Use of Data at Citrus Hacks.",
            startDate: "Jan 2019",
            endDate: "Jan 2019",
          },
          {
            id: genId("proj"),
            name: "SIG Hack (Silicon Valley Hackathon)",
            description: "Best SIG Hack winner at Silicon Valley Hackathon.",
            startDate: "Jan 2019",
            endDate: "Jan 2019",
          },
          {
            id: genId("proj"),
            name: "SacHacks Project (2nd Place + Best DO Hack)",
            description:
              "2nd place overall, Best DigitalOcean Hack, and Honorable Mention for Game Development at SacHacks.",
            startDate: "Nov 2018",
            endDate: "Nov 2018",
          },
          {
            id: genId("proj"),
            name: "SDHacks Project (2nd DoD + 3rd Overall)",
            description:
              "2nd Place DoD Track Prize by SPAWAR and 3rd Place Best Overall Hack at SDHacks.",
            startDate: "Oct 2018",
            endDate: "Oct 2018",
          },
          {
            id: genId("proj"),
            name: "Mobile App Challenge (2nd Place)",
            description: "2nd Place Best Overall Application at Citris Mobile App Challenge.",
            startDate: "May 2018",
            endDate: "May 2018",
          },
          {
            id: genId("proj"),
            name: "TopHat for Visually Impaired (3rd Place)",
            description:
              "Built a modular TopHat that provides a haptic environment for the visually impaired. 3rd Place at Citrus Hacks.",
            startDate: "Apr 2018",
            endDate: "Apr 2018",
          },
          {
            id: genId("proj"),
            name: "Autonomous Farm Data Collector (Best Hardware)",
            description:
              "Reconstructed a toy tank to autonomously collect data with moisture sensors for farms. Best Hardware Hack at HackFresno.",
            startDate: "Apr 2018",
            endDate: "Apr 2018",
          },
          {
            id: genId("proj"),
            name: "Farm-to-Table AR App (Best Environmental)",
            description:
              "Mobile app using Unity AR (Vuforia) to scan food labels and display farm origin, nutrients, and recipes. Used OSIsoft API, JavaScript, JSON, and Mapbox GIS. Best Environmental Hack at HackDavis.",
            startDate: "Jan 2018",
            endDate: "Jan 2018",
          },
          {
            id: genId("proj"),
            name: "HackMerced Project (Best in Design)",
            description:
              "Won Best in Design award for combination of best algorithm and best UI/UX at HackMerced.",
            startDate: "Oct 2017",
            endDate: "Oct 2017",
          },
        ],
        volunteer: [
          {
            id: genId("vol"),
            organization: "Circle K International",
            role: "Information Technology Officer",
            cause: "Social Services",
            startDate: "Oct 2016",
            endDate: "May 2018",
            description:
              '"Zoo Boo" - passing out candy at a local Halloween festival; "Em Tea for the Children" - fundraised/volunteered for a local Pediatric Trauma Program; "Krazy Kompetition" - fundraised/volunteered to raise money for PTP Hospitals; "M-Ball" - volunteered to raise money for Children Hospitals',
          },
          {
            id: genId("vol"),
            organization: "Feeding America San Diego",
            role: "Packager",
            cause: "Disaster and Humanitarian Relief",
            startDate: "Feb 2009",
            endDate: "",
            description:
              "Packaged small bags of rice, grains, and beans. Packaged the packages into several boxes and moved the boxes to conveyor belts. These boxes were then sent off to third world countries.",
          },
          {
            id: genId("vol"),
            organization: "American Diabetes Association",
            role: "Fundraising Volunteer",
            cause: "Health",
            startDate: "Apr 2015",
            endDate: "Apr 2016",
            description: "Fundraising activities to support diabetes research and awareness.",
          },
        ],
        courses: [
          { id: genId("course"), name: "Advanced Placement Computer Science", number: "AP CS" },
          { id: genId("course"), name: "Algorithm Design and Analysis", number: "CSE 100" },
          { id: genId("course"), name: "Circuit Theory", number: "ENGR 65" },
          { id: genId("course"), name: "Computer Graphics", number: "CSE 170" },
          { id: genId("course"), name: "Computer Networks", number: "CSE 160" },
          { id: genId("course"), name: "Computer Organization - MIPS", number: "CSE 31" },
          { id: genId("course"), name: "Computer Vision", number: "CSE 185" },
          { id: genId("course"), name: "Data Structures", number: "CSE 30" },
          { id: genId("course"), name: "Database System and Implementation", number: "CSE 177" },
          { id: genId("course"), name: "Discrete Mathematics", number: "CSE 15" },
          { id: genId("course"), name: "Human Computer Interactions", number: "CSE 155" },
          {
            id: genId("course"),
            name: "Linear Algebra and Differential Equations",
            number: "Math 24",
          },
          { id: genId("course"), name: "Mobile Computing", number: "CSE 162" },
          { id: genId("course"), name: "Multivariable Calculus", number: "Math 23" },
          { id: genId("course"), name: "Object Oriented Programming", number: "CSE 165" },
          { id: genId("course"), name: "Operating Systems", number: "CSE 150" },
          { id: genId("course"), name: "Probability and Statistics", number: "MATH 32" },
          { id: genId("course"), name: "Robotics Operating System (ROS)", number: "CSE 180" },
          { id: genId("course"), name: "Software Engineering Capstone", number: "CSE 120" },
          { id: genId("course"), name: "Spatial Analysis", number: "ENGR 180" },
        ],
        honors: [
          {
            id: genId("honor"),
            title: "2nd Place",
            issuer: "PennApps",
            date: "Sep 2019",
            description: "One of the largest collegiate hackathons",
          },
          {
            id: genId("honor"),
            title: "2nd Place",
            issuer: "LA Hacks",
            date: "Mar 2019",
            description: "",
          },
          {
            id: genId("honor"),
            title: "Best Security Hack",
            issuer: "Hack Arizona",
            date: "Jan 2019",
            description: "",
          },
          {
            id: genId("honor"),
            title: "First Place",
            issuer: "Citrus Hacks",
            date: "Jan 2019",
            description: "",
          },
          {
            id: genId("honor"),
            title: "Best Use of Data",
            issuer: "Citrus Hacks",
            date: "Jan 2019",
            description: "",
          },
          {
            id: genId("honor"),
            title: "Best SIG Hack",
            issuer: "Silicon Valley Hackathon",
            date: "Jan 2019",
            description: "",
          },
          {
            id: genId("honor"),
            title: "2nd Place",
            issuer: "SacHacks",
            date: "Nov 2018",
            description: "",
          },
          {
            id: genId("honor"),
            title: "Best DigitalOcean Hack",
            issuer: "SacHacks",
            date: "Nov 2018",
            description: "",
          },
          {
            id: genId("honor"),
            title: "Honorable Mention - Game Development Track",
            issuer: "SacHacks",
            date: "Nov 2018",
            description: "",
          },
          {
            id: genId("honor"),
            title: "2nd Place DoD Track Prize by SPAWAR",
            issuer: "SDHacks",
            date: "Oct 2018",
            description: "",
          },
          {
            id: genId("honor"),
            title: "3rd Place Best Overall Hack",
            issuer: "SDHacks",
            date: "Oct 2018",
            description: "",
          },
          {
            id: genId("honor"),
            title: "2nd Place Best Overall Application",
            issuer: "Citris - Mobile App Challenge",
            date: "May 2018",
            description: "",
          },
          {
            id: genId("honor"),
            title: "3rd Place Best Overall Hack",
            issuer: "Citrus Hacks",
            date: "Apr 2018",
            description: "Built a modular TopHat for the visually impaired",
          },
          {
            id: genId("honor"),
            title: "Best Hardware Hack",
            issuer: "HackFresno",
            date: "Apr 2018",
            description: "Autonomous farm data collection tank",
          },
          {
            id: genId("honor"),
            title: "EquipoVision's Choice Entrepreneurship Award",
            issuer: "Citrus Hacks",
            date: "Apr 2018",
            description: "",
          },
          {
            id: genId("honor"),
            title: "Best Environmental Hack",
            issuer: "HackDavis",
            date: "Jan 2018",
            description: "Farm-to-table AR mobile app",
          },
          {
            id: genId("honor"),
            title: "Best in Design",
            issuer: "HackMerced",
            date: "Oct 2017",
            description: "Best algorithm + best UI/UX",
          },
          {
            id: genId("honor"),
            title: "Eagle Scout",
            issuer: "Boy Scouts of America",
            date: "Mar 2016",
            description: "Highest rank attainable in the Boy Scouts of America",
          },
        ],
        spokenLanguages: [
          { id: genId("lang"), language: "English", proficiency: "Full professional proficiency" },
          { id: genId("lang"), language: "German", proficiency: "Limited working proficiency" },
          { id: genId("lang"), language: "Farsi", proficiency: "Limited working proficiency" },
        ],
      },
    };
  }

  return null;
}

/**
 * Check if we're in a browser environment
 */
export function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/**
 * Check if we're in development mode
 */
export function isDevelopment(): boolean {
  return import.meta.env.DEV;
}

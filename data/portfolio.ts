/**
 * UPDATE THIS FILE FIRST.
 * It controls the name, links, contact details, and projects throughout the site.
 * Empty links are intentionally hidden, so the starter never invents your identity or URLs.
 */
export const profile = {
  name: "Jerico Ibalin",
  firstName: "Jerico",
  role: "Web Developer & Digital Creative",
  tagline: "Thoughtful digital experiences. Built with purpose.",
  introduction:
    "I bring design thinking and practical problem-solving together to build responsive websites, useful digital systems, and experiences that feel considered from the first detail to the last.",
  location: "Philippines",
  email: "", // Add your real address, e.g. yourname@gmail.com
  github: "", // Add your real GitHub profile URL
  linkedin: "", // Add your real LinkedIn profile URL
  cvPdf: "", // Optional: add a PDF to /public and set this to /your-resume.pdf
} as const;

export type ProjectCategory = "Websites" | "Systems" | "UI/UX" | "Hardware";

export type Project = {
  slug: string;
  number: string;
  title: string;
  shortTitle: string;
  category: ProjectCategory;
  yearLabel: string;
  image: string;
  imageAlt: string;
  intro: string;
  overview: string;
  role: string;
  tools: string[];
  highlights: string[];
  approach: string;
  outcome: string;
  liveUrl?: string;
  repositoryUrl?: string;
  featured?: boolean;
  color: "rose" | "slate" | "plum" | "violet" | "sand" | "blue";
};

export const projects: Project[] = [
  {
    slug: "digital-wedding-invitations",
    number: "01",
    title: "Digital Wedding Invitations",
    shortTitle: "Digital Invitations",
    category: "Websites",
    yearLabel: "Selected work",
    image: "/projects/digital-invitations.svg",
    imageAlt: "Illustrative warm-toned wedding invitation website mockup",
    intro: "Personal celebrations, thoughtfully brought online.",
    overview:
      "Responsive wedding invitation websites designed around each couple's story. These projects bring the important event details together in one accessible, personal online experience.",
    role: "Web development · Layout design · Content integration",
    tools: ["Next.js", "React", "CSS", "Responsive design"],
    highlights: [
      "Responsive ceremony and reception information",
      "Interactive sections for photo galleries and the couple's story",
      "RSVP and guest information integration where required",
    ],
    approach:
      "Start with the couple's chosen style and information, then translate that into a visual system that works beautifully on both desktop and mobile.",
    outcome:
      "A flexible invitation format with a strong visual identity and practical information for guests.",
    featured: true,
    color: "rose",
  },
  {
    slug: "project-monitoring-system",
    number: "02",
    title: "Project & Inquiry Monitoring System",
    shortTitle: "Project Monitoring",
    category: "Systems",
    yearLabel: "Selected work",
    image: "/projects/project-dashboard.svg",
    imageAlt: "Illustrative dashboard for project progress, inquiries, and earnings",
    intro: "Making daily project operations easier to follow.",
    overview:
      "A Google Sheets-based workspace for managing client inquiries, project progress, checklists, payments, team responsibilities, and earnings.",
    role: "Workflow planning · Data organization · Dashboard design",
    tools: ["Google Sheets", "Formulas", "Google Forms", "Apps Script"],
    highlights: [
      "Inquiry and active-project organization",
      "Checklist, progress, and payment visibility",
      "Earnings and team contribution summaries",
    ],
    approach:
      "Organize related information into clearly defined sheets and connect routine inputs to useful summaries, reducing duplicated manual work.",
    outcome:
      "A practical monitoring system designed to make project status and operations easier to understand.",
    featured: true,
    color: "slate",
  },
  {
    slug: "shotify-music-app",
    number: "03",
    title: "Shotify Music App",
    shortTitle: "Shotify",
    category: "UI/UX",
    yearLabel: "Concept project",
    image: "/projects/shotify.svg",
    imageAlt: "Illustrative dark music app phone screen with colorful album artwork",
    intro: "A music experience made for discovery.",
    overview:
      "A mobile music application design concept exploring familiar listening patterns, discovery, and visual hierarchy in a compact interface.",
    role: "UI concept · Visual prototyping",
    tools: ["Figma", "Mobile UI", "Wireframing"],
    highlights: ["Mobile-first screen composition", "Clear playback and browsing patterns", "Consistent visual components"],
    approach:
      "Use spacing, contrast, and repeatable components to keep playback controls and music exploration intuitive.",
    outcome: "A UI/UX concept that demonstrates interface structure and visual design decisions.",
    color: "plum",
  },
  {
    slug: "violet-evergarden-flower-store",
    number: "04",
    title: "Violet Evergarden Flower Store",
    shortTitle: "Flower Store UI",
    category: "UI/UX",
    yearLabel: "Concept project",
    image: "/projects/flower-store.svg",
    imageAlt: "Illustrative elegant flower e-commerce web interface",
    intro: "An expressive storefront for thoughtful gifting.",
    overview:
      "A flower e-commerce interface concept focused on product presentation, gentle visual storytelling, and browsing simplicity.",
    role: "UI concept · E-commerce design",
    tools: ["Figma", "UI Design", "E-commerce UX"],
    highlights: ["Product-first visual hierarchy", "Soft editorial presentation", "Clear paths from browsing to purchase"],
    approach:
      "Pair a delicate visual identity with familiar shop patterns so product discovery stays clear.",
    outcome: "An e-commerce design concept balancing personality with usability.",
    color: "violet",
  },
  {
    slug: "smart-trash-bin",
    number: "05",
    title: "Smart Trash Bin",
    shortTitle: "Smart Trash Bin",
    category: "Hardware",
    yearLabel: "Academic project",
    image: "/projects/smart-bin.svg",
    imageAlt: "Illustrative Arduino Uno smart bin system diagram",
    intro: "A small idea with a practical purpose.",
    overview:
      "An academic Arduino Uno project exploring how simple electronics and sensing can support everyday automation.",
    role: "Academic project · Hardware exploration",
    tools: ["Arduino Uno", "Prototyping", "Basic electronics"],
    highlights: ["Microcontroller-based prototyping", "Practical automation concept", "Hardware-software integration"],
    approach:
      "Break a simple everyday problem into input, logic, and output, then prototype it with accessible components.",
    outcome: "Hands-on practice in basic electronic systems and practical prototyping.",
    color: "sand",
  },
  {
    slug: "barangay-appointment-system",
    number: "06",
    title: "Barangay Appointment System",
    shortTitle: "Appointment System",
    category: "Systems",
    yearLabel: "Academic project",
    image: "/projects/appointment-system.svg",
    imageAlt: "Illustrative appointment booking and scheduling interface",
    intro: "Clearer scheduling for everyday services.",
    overview:
      "An academic system concept for organizing barangay appointment requests and presenting scheduled services in a clearer workflow.",
    role: "Academic project · System design",
    tools: ["System planning", "Data organization", "Interface design"],
    highlights: ["Structured appointment information", "Service-oriented workflow", "Practical administrative use case"],
    approach:
      "Define the information people need to submit and the steps administrators need to review, then structure the interface around those tasks.",
    outcome: "An academic system project exploring more organized local-service scheduling.",
    color: "blue",
  },
];

export const competencies = [
  {
    number: "01",
    title: "Web & front-end",
    summary: "Responsive websites and clear user-facing experiences.",
    items: ["Next.js / React", "HTML / CSS", "TypeScript / JavaScript", "Responsive interfaces"],
  },
  {
    number: "02",
    title: "Design & prototyping",
    summary: "Translating ideas into organized visual systems.",
    items: ["Figma", "UI/UX concepts", "Visual hierarchy", "Design iteration"],
  },
  {
    number: "03",
    title: "Data & operations",
    summary: "Practical tracking tools and everyday workflow support.",
    items: ["Google Sheets", "Forms & Apps Script", "Data entry & processing", "Documentation"],
  },
  {
    number: "04",
    title: "Technical support",
    summary: "Helping people, systems, and equipment work reliably.",
    items: ["Level 1 troubleshooting", "IT equipment support", "System monitoring assistance", "Record keeping"],
  },
];

export const experience = [
  {
    period: "Hands-on experience",
    title: "IT & Administrative Support",
    category: "Operations · Technical support",
    description:
      "Supported day-to-day technical and administrative work through Level 1 troubleshooting, equipment maintenance and deployment, data encoding, record keeping, and departmental coordination.",
  },
  {
    period: "Selected projects",
    title: "Website Development & Digital Projects",
    category: "Web development · Design",
    description:
      "Created and customized responsive invitation websites, explored user interface designs, and built project tracking workflows using digital tools.",
  },
];

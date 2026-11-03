/**
 * UPDATE THIS FILE FIRST.
 * It controls the name, links, contact details, and projects throughout the site.
 * Empty links are intentionally hidden, so the starter never invents your identity or URLs.
 */
export const siteUrl = "https://project-jerico.vercel.app";

export const profile = {
  name: "Jerico Ibalin",
  firstName: "Jerico",
  role: "Web Developer & Digital Creative",
  tagline: "Thoughtful digital experiences. Built with purpose.",
  introduction:
    "I bring design thinking and practical problem-solving together to build responsive websites, useful digital systems, and experiences that feel considered from the first detail to the last.",
  location: "Philippines",
  resumeLocation: "San Antonio, Tigaon, Camarines Sur",
  resumeHeadline: "Inventory Controller | ERP Operator | Accounting & Data Analyst",
  phone: "+63 993 531 7727",
  email: "ibalin.jerico26@gmail.com",
  github: "https://github.com/bonnn34",
  facebook: "https://www.facebook.com/jerico.ibalin",
  behance: "https://www.behance.net/jericoibalin1",
  linkedin: "", // Add your real LinkedIn profile URL
  cvPdf: "/Jerico-Ibalin-Resume.pdf",
} as const;

export const atsResume = {
  summary:
    "Detail-oriented professional with experience in inventory control, warehouse operations, physical inventory auditing, accounting reconciliation, data analysis, and operational reporting. Experienced in managing ERP inventory transactions, reconciling physical and system records, analyzing sales and inventory variances, and preparing daily inventory and accounting reports. Skilled in SAP, Odoo ERP, Microsoft Excel, Google Sheets, and Google Apps Script, with a strong focus on data accuracy, reconciliation, process improvement, and operational efficiency.",
  coreCompetencies: [
    "SAP and Odoo ERP",
    "Inventory Control",
    "Warehouse Operations",
    "Inventory Auditing",
    "Inventory Reconciliation",
    "Accounting Reconciliation",
    "Variance Analysis",
    "Data Analysis",
    "Operational Reporting",
    "Data Validation",
    "Warehouse Transfers",
    "Stock Monitoring",
    "Process Improvement",
  ],
  experience: [
    {
      company: "Atlantic Bakery",
      location: "",
      title: "SAP Operator | Inventory Controller | Inventory Auditor | Accounting & Data Analyst",
      period: "July 2025 - Present",
      bullets: [
        "Manage SAP and Odoo ERP inventory transactions, including transfers, production issues, receipts, pull-outs, and inventory adjustments across multiple warehouse locations.",
        "Conduct physical inventory counts across warehouse locations and reconcile physical quantities with ERP records to identify overages, shortages, and discrepancies.",
        "Validate inventory data for products, ensuring consistency between physical counts, warehouse transactions, supporting documents, and system records.",
        "Monitor production and warehouse inventory movements involving raw materials, production stocks, finished goods, and transfers.",
        "Prepare inventory audit, reconciliation, and variance reports to support management review and operational decision-making.",
        "Reduced daily reconciliation time by automating reports with Google Apps Script, enabling faster cash-flow analysis for management.",
        "Analyze production, inventory, deliveries, transfers, rejects, purchase orders, accounts receivable, and ending balances as part of daily reconciliation.",
        "Use Microsoft Excel and Google Sheets to analyze operational, inventory, and accounting data and develop tracking and reporting tools.",
        "Use Google Apps Script to automate spreadsheet processes, improve data validation, and reduce repetitive work.",
        "Coordinate with warehouse, production, and accounting teams to investigate discrepancies, validate transactions, and ensure accurate and timely reporting.",
      ],
    },
    {
      company: "Department of Agrarian Reform Camarines Sur II",
      location: "Naga City, Philippines",
      title: "Technical Support / Encoder / Data Gathering Intern",
      period: "January 2025 - April 2025",
      bullets: [
        "Provided technical support for computer hardware, software, troubleshooting, maintenance, and equipment setup.",
        "Encoded, maintained, and validated operational data and supporting documents for reporting and administrative requirements.",
      ],
    },
  ],
  technicalSkills: [
    {
      category: "ERP and inventory systems",
      skills: ["SAP", "Odoo ERP", "Inventory transactions", "Stock movement monitoring", "Inventory adjustments", "Warehouse transfers"],
    },
    {
      category: "Data and reporting",
      skills: ["Microsoft Excel", "Google Sheets", "Google Apps Script", "Data validation", "Data reconciliation", "Data analysis", "Variance analysis", "Inventory reporting", "Accounting reconciliation"],
    },
    {
      category: "Excel and Google Sheets",
      skills: ["Pivot Tables", "XLOOKUP", "VLOOKUP", "SUMIFS", "COUNTIFS", "INDEX/MATCH", "FILTER", "Conditional Formatting", "Data Validation", "Spreadsheet automation"],
    },
    {
      category: "Inventory and warehouse operations",
      skills: ["Inventory control", "Physical inventory auditing", "Warehouse reconciliation", "Stock monitoring", "Transfer in/out", "Production inventory", "Inventory variance investigation"],
    },
  ],
  education: [
    {
      degree: "Bachelor of Science in Information Technology",
      period: "2021 - 2025",
      school: "Partido State University",
      department: "College of Engineering and Computational Science",
      location: "San Bautista St., Goa, Camarines Sur",
    },
  ],
} as const;

export type ProjectCategory = "Websites" | "Google Sheets Automation" | "UI/UX";

export type Project = {
  slug: string;
  number: string;
  title: string;
  shortTitle: string;
  category: ProjectCategory;
  yearLabel: string;
  image: string;
  imageAlt: string;
  imageAspectRatio?: string;
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
    image: "/porf-image/wedding.png",
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
    title: "Odoo Operations Control & Reconciliation",
    shortTitle: "Odoo Control Dashboard",
    category: "Google Sheets Automation",
    yearLabel: "Selected work",
    image: "/projects/google-sheets-automation-dashboard.png",
    imageAlt: "Google Sheets automation and dashboard showcase with an operations control panel, reconciliation reports, and exception workflows",
    imageAspectRatio: "16 / 9",
    intro:
      "A Google Sheets operations dashboard for reconciling Odoo source and output records, reviewing process totals, and tracking exceptions.",
    overview:
      "Developed a structured Google Sheets control panel that brings source records, output totals, reconciliation results, process distribution, sales comparisons, and exception rules into a clear operational reporting view.",
    role: "Operations reporting · Reconciliation design · Spreadsheet automation",
    tools: [
      "Google Sheets",
      "Google Apps Script",
      "Advanced Formulas",
      "Dashboard Development",
      "Data Reconciliation",
      "Data Visualization",
      "Workflow Automation",
    ],
    highlights: [
      "Source-to-output reconciliation controls",
      "Process distribution and sales comparison reporting",
      "Exception rules and workflow status tracking",
    ],
    approach:
      "Organize source and exception data into dedicated worksheets, calculate control totals, and surface the results through a focused dashboard for routine review.",
    outcome:
      "A centralized workbook for reviewing operational totals, reconciliation status, and exceptions without combining unrelated records manually.",
    featured: true,
    color: "slate",
  },
  {
    slug: "wedding-website-monitoring",
    number: "03",
    title: "Wedding Website Monitoring System V2",
    shortTitle: "Wedding Monitoring",
    category: "Google Sheets Automation",
    yearLabel: "Selected work",
    image: "/projects/google-sheets-wedding-monitoring.png",
    imageAlt: "Google Sheets wedding website monitoring dashboard with project status, checklists, inquiries, and payment records",
    imageAspectRatio: "16 / 9",
    intro:
      "An organized Google Sheets workspace for tracking wedding website projects, task revisions, client inquiries, and payment records.",
    overview:
      "Developed a Google Sheets monitoring system that combines project status, checklist progress, client intake, form responses, and payment information. Its dashboard summarizes live websites, revision work, and overdue tasks while keeping detailed records available in dedicated sheets.",
    role: "Project tracking · Workflow automation · Dashboard development",
    tools: ["Google Sheets", "Google Apps Script", "Google Forms", "Advanced Formulas", "Dashboard Development", "Data Management"],
    highlights: [
      "Website status and deadline tracking",
      "Checklist and revision management",
      "Client inquiry, form response, and payment records",
    ],
    approach:
      "Separate projects, checklists, inquiries, form responses, and payments into structured sheets, then connect their key statuses to a concise monitoring dashboard.",
    outcome:
      "A clearer workspace for reviewing active wedding website work and maintaining the supporting project records in one place.",
    color: "sand",
  },
  {
    slug: "inventory-reconciliation-control",
    number: "04",
    title: "Inventory Reconciliation & Control",
    shortTitle: "Inventory Reconciliation",
    category: "Google Sheets Automation",
    yearLabel: "Selected work",
    image: "/projects/google-sheets-inventory-reconciliation.png",
    imageAlt: "Google Sheets inventory reconciliation workbook for raw materials, Odoo imports, warehouse transfers, and variance review",
    imageAspectRatio: "16 / 9",
    intro:
      "A Google Sheets inventory control workbook for Odoo imports, warehouse transfers, material mapping, and reconciliation review.",
    overview:
      "Developed an inventory reconciliation workbook for comparing raw-material and ingredient records across source data, warehouse transfers, and Odoo-related outputs. The control view organizes exceptions, mapped values, and variance results for structured review.",
    role: "Inventory control · Data reconciliation · Workflow automation",
    tools: ["Google Sheets", "Google Apps Script", "Advanced Formulas", "Data Reconciliation", "Inventory Reporting", "Data Validation", "Workflow Automation"],
    highlights: [
      "Source-to-output inventory controls",
      "Material and warehouse mapping",
      "Transfer exceptions and production variance review",
    ],
    approach:
      "Normalize source records, map materials and warehouse movements, and compare calculated totals so exceptions can be isolated for review.",
    outcome:
      "A structured reconciliation view for checking inventory movements, mismatches, and control totals across related records.",
    color: "blue",
  },
  {
    slug: "attendance-store-opening-automation",
    number: "05",
    title: "Attendance Automation & Store Opening Monitoring",
    shortTitle: "Attendance Automation",
    category: "Google Sheets Automation",
    yearLabel: "Selected work",
    image: "/projects/google-sheets-attendance-automation.png",
    imageAlt: "Google Sheets attendance automation workflow with raw Viber messages, attendance records, store schedules, and daily opening reports",
    imageAspectRatio: "16 / 9",
    intro:
      "A Google Sheets workflow for processing attendance messages, monitoring store opening times, and preparing daily reports.",
    overview:
      "Developed a Google Sheets attendance and store-opening workflow that converts raw Viber messages into structured attendance records, compares opening times with schedules, and prepares a daily report with late-opening exceptions.",
    role: "Attendance processing · Workflow automation · Daily reporting",
    tools: ["Google Sheets", "Google Apps Script", "Spreadsheet Automation", "Advanced Formulas", "Data Management", "Workflow Automation", "Operational Reporting"],
    highlights: [
      "Raw attendance message processing",
      "Employee and store master-data organization",
      "Daily opening reports and late-opening exception tracking",
    ],
    approach:
      "Organize raw messages, attendance records, employee references, and store schedules into connected sheets that feed a consistent daily opening report.",
    outcome:
      "A repeatable workflow for maintaining attendance records and reviewing store-opening status from structured spreadsheet data.",
    color: "slate",
  },
  {
    slug: "shotify-music-app",
    number: "06",
    title: "Shotify Music App",
    shortTitle: "Shotify",
    category: "UI/UX",
    yearLabel: "Concept project",
    image: "/projects/shotify-music-app.png",
    imageAlt: "Shotify music application displayed across a laptop and two mobile interfaces",
    imageAspectRatio: "16 / 9",
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
    number: "07",
    title: "Violet Evergarden Flower Delivery App",
    shortTitle: "Flower Delivery App",
    category: "UI/UX",
    yearLabel: "Concept project",
    image: "/projects/violet-evergarden-flower-app.png",
    imageAlt: "Violet Evergarden flower delivery application displayed across laptop and mobile interfaces",
    imageAspectRatio: "16 / 9",
    intro: "A mobile flower delivery experience designed around browsing, customization, checkout, and payment.",
    overview:
      "Designed a flower delivery application concept that lets users explore arrangements, review product details, customize selections, and move through shipping and payment flows in a consistent mobile interface.",
    role: "UI/UX design · Mobile interface · E-commerce flow",
    tools: ["Figma", "React", "TypeScript", "Firebase", "Mobile UI", "E-commerce UX"],
    highlights: ["Product browsing and recommendations", "Bouquet customization and product details", "Checkout, shipping, and payment flows"],
    approach:
      "Pair a soft floral visual identity with familiar mobile commerce patterns so browsing, customization, and checkout remain easy to follow.",
    outcome: "A cohesive flower delivery app concept covering the primary journey from discovery through payment confirmation.",
    color: "violet",
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
    period: "July 2025 - Present",
    title: "Inventory Control & ERP Operations",
    category: "Atlantic Bakery / SAP / Odoo ERP",
    description:
      "Manage ERP inventory transactions, audit physical stock, reconcile system records, analyze operational data, and automate daily reporting workflows.",
  },
  {
    period: "January 2025 - April 2025",
    title: "Technical Support & Data Intern",
    category: "Department of Agrarian Reform / Naga City",
    description:
      "Provided computer hardware and software support while encoding, gathering, maintaining, and validating operational data for administrative reporting.",
  },
];

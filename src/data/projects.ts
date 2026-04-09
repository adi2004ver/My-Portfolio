export interface Project {
  id: string;
  title: string;
  hook: string;
  description: string;
  tags: string[];
  color: string;
  github?: string;
}

export const projects: Project[] = [
  {
    id: "network-intrusion",
    title: "AI-Powered Network Intrusion Detection System",
    hook: "Multi-model ML system designed for precise network traffic classification.",
    description: "Performed extensive data preprocessing, advanced feature extraction, and rigorous analysis to enhance detection reliability.",
    tags: ["Machine Learning", "Python", "Data Analysis"],
    color: "from-blue-500/10 to-indigo-500/10",
    github: "https://github.com/adi2004ver",
  },
  {
    id: "conference-portal",
    title: "Conference Room Management Portal",
    hook: "Data-centric booking and approval system providing seamless facility management.",
    description: "Analyzed booking data and built optimized queries to ensure conflict-free scheduling and robust role-based access.",
    tags: [".NET Framework", "C#", "SQL", "Web Forms"],
    color: "from-emerald-500/10 to-teal-500/10",
  },
  {
    id: "hr-analytics",
    title: "HR Analytics Dashboard",
    hook: "Power BI dashboard to analyze employee attrition, workforce trends, and key HR metrics.",
    description: "Built using Power BI through interactive data visualizations to extract actionable business insights from personnel data.",
    tags: ["Power BI", "Data Analytics", "Data Visualization"],
    color: "from-rose-500/10 to-pink-500/10",
    github: "https://github.com/adi2004ver",
  }
];

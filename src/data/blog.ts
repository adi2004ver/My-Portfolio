export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  date: string;
  category: string;
}

export const posts: BlogPost[] = [
  {
    slug: "art-of-micro-interactions",
    title: "The Art of Micro-interactions",
    excerpt: "How small details create big impact in user experience design.",
    content: "# The Art of Micro-interactions\n\nMicro-interactions are the secret ingredient to delightful user experiences that keep users engaged and intuitively guide them through an application.\n\nThey exist in almost every application, but when done right, they feel entirely natural and invisible. Think about the heart animation when liking a post on Twitter, or the satisfying bounce when pulling to refresh. These small animations provide immediate feedback, acknowledging the user's action and creating a sense of direct manipulation.\n\n## Why Do They Matter?\n\n1.  **Providing Feedback:** Letting the user know that the system has received their input.\n2.  **Guiding Attention:** Gently drawing the eye to important elements or changes in state.\n3.  **Enhancing Aesthetics:** Making the interface feel polished, premium, and \"alive\".\n\nIn this modern web era, using tools like Framer Motion or CSS transitions makes it incredibly easy to sprinkle these delightful moments across your interface.",
    date: "Feb 2026",
    category: "Design",
  },
  {
    slug: "building-design-systems",
    title: "Building Design Systems That Scale",
    excerpt: "Lessons learned from creating design systems for growing teams.",
    content: "Content coming soon...",
    date: "Jan 2026",
    category: "Development",
  },
  {
    slug: "animation-performance-react",
    title: "Animation Performance in React",
    excerpt: "Best practices for smooth 60fps animations in modern web apps.",
    content: "Content coming soon...",
    date: "Dec 2025",
    category: "Performance",
  },
  {
    slug: "psychology-interactive-design",
    title: "The Psychology of Interactive Design",
    excerpt: "Understanding how users think and feel when interacting with interfaces.",
    content: "Content coming soon...",
    date: "Nov 2025",
    category: "UX",
  },
  {
    slug: "figma-to-code",
    title: "From Figma to Code: A Designer's Journey",
    excerpt: "My experience transitioning from pure design to design engineering.",
    content: "Content coming soon...",
    date: "Oct 2025",
    category: "Career",
  },
];

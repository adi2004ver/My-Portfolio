import { motion } from "framer-motion";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import Button3D from "@/components/Button3D";
import { projects } from "@/data/projects";

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <main className="relative z-10 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold text-foreground mb-4">Project Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The project you're looking for doesn't exist.
            </p>
            <Link to="/projects">
              <Button3D>
                <ArrowLeft className="w-4 h-4" />
                Back to Projects
              </Button3D>
            </Link>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <main className="relative z-10 px-4 pt-16 sm:pt-24 pb-32 max-w-4xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>
        </motion.div>

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground font-heading mb-2">
                {project.title}
              </h1>
              <p className="text-muted-foreground text-lg">
                {project.description}
              </p>
            </div>
            {project.date && (
              <span className="text-sm text-muted-foreground bg-background/30 px-3 py-1 rounded-lg shrink-0">
                {project.date}
              </span>
            )}
          </div>
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-xl font-semibold text-foreground mb-4 font-heading">
            Tech Stack
          </h2>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-lg border border-primary/20"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Long Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-xl font-semibold text-foreground mb-4 font-heading">
            Project Overview
          </h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            {project.longDescription || project.description}
          </p>
        </motion.div>

        {/* Placeholder Sections - Can be expanded later */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid sm:grid-cols-2 gap-8 mb-12"
        >
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3 font-heading">
              Key Features
            </h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✦</span>
                <span>Scalable architecture with modern best practices</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✦</span>
                <span>Optimized performance and user experience</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✦</span>
                <span>Comprehensive testing and documentation</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3 font-heading">
              Impact
            </h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✦</span>
                <span>Improved workflow efficiency</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✦</span>
                <span>Enhanced user engagement</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✦</span>
                <span>Measurable business results</span>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex gap-4"
        >
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              <Button3D>
                <ExternalLink className="w-4 h-4" />
                View Live
              </Button3D>
            </a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
              <Button3D variant="ghost">
                <Github className="w-4 h-4" />
                View Code
              </Button3D>
            </a>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default ProjectDetail;

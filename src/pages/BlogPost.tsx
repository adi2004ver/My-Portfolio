import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, ArrowRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Button3D from "@/components/Button3D";
import { posts } from "@/data/blog";
import { useMemo } from "react";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();

  const post = posts.find((p) => p.slug === slug);

  const relatedPosts = useMemo(() => {
    if (!post) return [];
    return posts
      .filter((p) => p.category === post.category && p.slug !== post.slug)
      .slice(0, 3);
  }, [post]);

  if (!post) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <main className="relative z-10 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold text-foreground mb-4">Post Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The blog post you're looking for doesn't exist.
            </p>
            <Link to="/blog">
              <Button3D>
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Button3D>
            </Link>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <main className="relative z-10 px-4 pt-16 sm:pt-24 pb-32 max-w-3xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-md font-medium">
              {post.category}
            </span>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              {post.date}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground font-heading mb-4">
            {post.title}
          </h1>
          <p className="text-lg text-muted-foreground">
            {post.excerpt}
          </p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="prose prose-invert max-w-none dark:prose-invert"
        >
          <div className="text-card-foreground leading-relaxed space-y-4">
            {post.content ? (
              <ReactMarkdown
                components={{
                  h1: ({ node, ...props }) => (
                    <h1
                      className="text-3xl font-bold text-foreground mt-8 mb-4 font-heading"
                      {...props}
                    />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2
                      className="text-2xl font-bold text-foreground mt-6 mb-3 font-heading"
                      {...props}
                    />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3
                      className="text-xl font-bold text-foreground mt-4 mb-2 font-heading"
                      {...props}
                    />
                  ),
                  p: ({ node, ...props }) => (
                    <p className="text-muted-foreground leading-relaxed" {...props} />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground" {...props} />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol className="list-decimal list-inside space-y-2 text-muted-foreground" {...props} />
                  ),
                  li: ({ node, ...props }) => <li className="ml-4" {...props} />,
                  code: ({ node, ...props }) => (
                    <code
                      className="bg-muted px-2 py-1 rounded text-sm text-foreground font-mono"
                      {...props}
                    />
                  ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote
                      className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4"
                      {...props}
                    />
                  ),
                  a: ({ node, ...props }) => (
                    <a
                      className="text-primary hover:underline"
                      {...props}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            ) : (
              <p className="text-muted-foreground italic">Content coming soon...</p>
            )}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-16 pt-8 border-t border-border/50"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Published on{" "}
                <span className="text-foreground font-semibold">{post.date}</span>
              </p>
            </div>
            <Link to="/blog">
              <Button3D variant="ghost">
                Read More Articles
              </Button3D>
            </Link>
          </div>
        </motion.div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16 pt-8 border-t border-border/50"
          >
            <h3 className="text-2xl font-bold text-foreground font-heading mb-6">
              Related Articles
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.slug} to={`/blog/${relatedPost.slug}`}>
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="bg-card/80 border border-border/50 rounded-lg p-4 hover:bg-card transition-colors cursor-pointer h-full"
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded font-medium shrink-0">
                        {relatedPost.category}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                        <Calendar className="w-3 h-3" />
                        {relatedPost.date}
                      </span>
                    </div>
                    <h4 className="font-semibold text-foreground mb-2 line-clamp-2 flex items-start gap-1 group">
                      {relatedPost.title}
                      <ArrowRight className="w-4 h-4 text-primary shrink-0 group-hover:translate-x-1 transition-transform" />
                    </h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default BlogPost;

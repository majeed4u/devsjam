import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { orpc } from "@/utils/orpc";
import { PostView } from "@/components/PostView";
import { SocialShare } from "@/components/post/social-share";
import { AuthorBio } from "@/components/post/author-bio";
import { RelatedPosts } from "@/components/post/related-posts";
import { SubscribeNewsletter } from "@/components/post/subscribe-newsletter";

export const Route = createFileRoute("/blog/$slug/")({
  component: BlogPostComponent,
});

function BlogPostComponent() {
  const { slug } = useParams({ from: "/blog/$slug" });
  const { data: posts } = useQuery(orpc.post.getPosts.queryOptions());

  const post = posts?.find(
    (p) =>
      p.slug === slug || p.title.toLowerCase().replace(/\s+/g, "-") === slug,
  );

  if (!post) {
    return (
      <main className="min-h-screen">
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Post Not Found</h1>
            <p className="text-foreground/60">
              The post you're looking for doesn't exist.
            </p>
            <Link
              to="/blog"
              className="inline-block px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors duration-200"
            >
              Back to Blog
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const publishDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Filter out current post from related posts
  const relatedPosts = posts?.filter((p) => p.id !== post.id) ?? [];
  const postSlug = post.slug || post.title.toLowerCase().replace(/\s+/g, "-");

  return (
    <main className="min-h-screen">
      {/* Back Navigation */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-colors duration-200 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
          Back to Blog
        </Link>
      </div>

      {/* Post Header */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="space-y-6">
          {/* Category/Tags */}
          <div className="flex flex-wrap gap-3">
            {post.categoryId && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                Technology
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-lg sm:text-xl text-foreground/70 leading-relaxed max-w-2xl">
            {post.excerpt}
          </p>

          {/* Post Meta and Share */}
          <div className="space-y-4 border-t border-border/40 pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex flex-wrap gap-4 text-sm text-foreground/60">
                <div>
                  <span className="font-medium">Published:</span> {publishDate}
                </div>
                <div>
                  <span className="font-medium">Reading Time:</span>{" "}
                  {post.readingTime} min
                </div>
              </div>
            </div>
            <SocialShare title={post.title} slug={postSlug} excerpt={post.excerpt} />
          </div>
        </div>
      </section>

      {/* Cover Image */}
      {post.coverImage && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="relative aspect-video rounded-xl overflow-hidden bg-accent/30 border border-border/30">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        </section>
      )}

      {/* Post Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <PostView post={post as any} />
      </section>

      {/* Divider */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t border-border/40" />
      </div>

      {/* Author Bio */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AuthorBio
          name="Majed"
          bio="Full-stack developer passionate about building scalable applications and sharing technical knowledge. Interested in web technologies, software architecture, and open source."
        />
      </section>

      {/* Newsletter Signup */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SubscribeNewsletter />
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <RelatedPosts posts={relatedPosts} />
        </section>
      )}
    </main>
  );
}

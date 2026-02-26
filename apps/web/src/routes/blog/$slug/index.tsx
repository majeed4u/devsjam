import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { PostView } from "@/components/PostView";
import { SocialShare } from "@/components/post/social-share";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/blog/$slug/")({
  component: BlogPostComponent,
});

function BlogPostComponent() {
  const { slug } = useParams({ from: "/blog/$slug/" });
  const { data: posts = [] } = useQuery(orpc.post.getPosts.queryOptions());
  const post = posts.find(
    (p) =>
      p.slug === slug || p.title.toLowerCase().replace(/\s+/g, "-") === slug,
  );

  if (!post) {
    return (
      <main className="min-h-screen">
         <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
           <div className="space-y-4 text-center">
             <h1 className="font-semibold text-2xl text-foreground">
               Post not found
             </h1>
             <p className="text-foreground/60 text-sm">
               The post you're looking for doesn't exist.
             </p>
             <Link
               to="/blog"
               className="text-foreground/70 text-sm hover:text-foreground hover:underline"
             >
               ← Back to Blog
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

  const relatedPosts = posts.filter((p) => p.id !== post.id);
  const postSlug = post.slug || post.title.toLowerCase().replace(/\s+/g, "-");

  const seriesPosts = post.series
    ? [...posts.filter((p) => p.series?.id === post.series?.id)].sort(
        (a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0),
      )
    : [];
  const seriesIndex = seriesPosts.findIndex((p) => p.id === post.id);
  const prevInSeries = seriesIndex > 0 ? seriesPosts[seriesIndex - 1] : null;
  const nextInSeries =
    seriesIndex >= 0 && seriesIndex < seriesPosts.length - 1
      ? seriesPosts[seriesIndex + 1]
      : null;

  // Extract all unique tags, categories, and series for sidebar filters
  const allTags = posts.reduce(
    (acc, post) => {
      post.tags?.forEach((tag) => {
        if (!acc.find((t) => t.id === tag.id)) {
          acc.push({ ...tag, _count: { posts: 0 } });
        }
      });
      return acc;
    },
    [] as Array<{
      id: string;
      name: string;
      slug: string;
      _count: { posts: number };
    }>,
  );

  // Count posts per tag
  posts.forEach((post) => {
    post.tags?.forEach((tag) => {
      const tagIndex = allTags.findIndex((t) => t.id === tag.id);
      if (tagIndex !== -1) {
        allTags[tagIndex]._count.posts++;
      }
    });
  });

  const allCategories = posts.reduce(
    (acc, post) => {
      if (post.category && !acc.find((c) => c.id === post.category!.id)) {
        acc.push({ ...post.category, _count: { posts: 0 } });
      }
      return acc;
    },
    [] as Array<{
      id: string;
      name: string;
      slug: string;
      _count: { posts: number };
    }>,
  );

  // Count posts per category
  posts.forEach((post) => {
    if (post.category) {
      const catIndex = allCategories.findIndex(
        (c) => c.id === post.category!.id,
      );
      if (catIndex !== -1) {
        allCategories[catIndex]._count.posts++;
      }
    }
  });

  const allSeries = posts.reduce(
    (acc, post) => {
      if (post.series && !acc.find((s) => s.id === post.series!.id)) {
        acc.push({ ...post.series, _count: { posts: 0 } });
      }
      return acc;
    },
    [] as Array<{
      id: string;
      title: string;
      slug: string;
      _count: { posts: number };
    }>,
  );

  // Count posts per series
  posts.forEach((post) => {
    if (post.series) {
      const seriesIndex = allSeries.findIndex((s) => s.id === post.series!.id);
      if (seriesIndex !== -1) {
        allSeries[seriesIndex]._count.posts++;
      }
    }
  });

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-4xl px-4 pt-10 pb-4 sm:px-6 lg:px-8">
        <Link
          to="/blog"
          className="text-foreground/60 text-sm hover:text-foreground hover:underline"
        >
          ← Blog
        </Link>
      </div>

      {/* 2-column layout: Main content + Sidebar */}
      <div className="mx-auto max-w-4xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Main content */}
          <div className="space-y-10">
            <section className="space-y-6">
              {post.series && (
                <div className="text-foreground/60 text-sm">
                  <Link
                    to="/blog/series/$series"
                    params={{ series: post.series.slug }}
                    className="hover:text-foreground hover:underline"
                  >
                    Series: {post.series.title}
                  </Link>
                  {seriesPosts.length > 0 && (
                    <span className="ml-2">
                      · Part {seriesIndex + 1} of {seriesPosts.length}
                    </span>
                  )}
                </div>
              )}
              <div className="flex flex-wrap gap-3">
                {post.category && (
                  <Link
                    to="/blog/category/$category"
                    params={{ category: post.category.name }}
                    className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary text-sm transition-colors duration-200 hover:bg-primary/20"
                  >
                    {post.category.name}
                  </Link>
                )}
                {post.tags && post.tags.length > 0 && (
                  <>
                    {post.tags.map((tag) => (
                      <Link
                        key={tag.id}
                        to="/blog/tag/$tag"
                        params={{ tag: tag.name }}
                        className="rounded-full bg-accent/50 px-3 py-1 font-medium text-foreground/70 text-sm transition-colors duration-200 hover:bg-accent"
                      >
                        {tag.name}
                      </Link>
                    ))}
                  </>
                )}
              </div>

              {/* Title */}
              <h1 className="font-bold text-4xl leading-tight sm:text-5xl lg:text-6xl">
                {post.title}
              </h1>

              {/* Excerpt */}
              <p className="max-w-2xl text-foreground/70 text-lg leading-relaxed sm:text-xl">
                {post.excerpt}
              </p>

              {/* Post Meta and Share */}
              <div className="space-y-4 border-border/40 border-t pt-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap gap-4 text-foreground/60 text-sm">
                    <div>
                      <span className="font-medium">Published:</span>{" "}
                      {publishDate}
                    </div>
                    <div>
                      <span className="font-medium">Reading Time:</span>{" "}
                      {post.readingTime} min
                    </div>
                  </div>
                </div>
                <SocialShare
                  title={post.title}
                  slug={postSlug}
                  excerpt={post.excerpt ?? undefined}
                />
              </div>
            </section>

            {post.coverImage && (
              <section>
                <div className="relative aspect-video overflow-hidden rounded-xl border border-border/30 bg-accent/30">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              </section>
            )}

            <section>
              <PostView post={post} />
            </section>

            {(prevInSeries || nextInSeries) && (
              <nav
                className="border-border/30 border-t pt-6"
                aria-label="Series navigation"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                  {prevInSeries ? (
                    <Link
                      to="/blog/$slug"
                      params={{
                        slug:
                          prevInSeries.slug ||
                          prevInSeries.title.toLowerCase().replace(/\s+/g, "-"),
                      }}
                      className="text-foreground/70 text-sm hover:text-foreground hover:underline"
                    >
                      ← {prevInSeries.title}
                    </Link>
                  ) : (
                    <span />
                  )}
                  {nextInSeries ? (
                    <Link
                      to="/blog/$slug"
                      params={{
                        slug:
                          nextInSeries.slug ||
                          nextInSeries.title.toLowerCase().replace(/\s+/g, "-"),
                      }}
                      className="text-foreground/70 text-sm hover:text-foreground hover:underline sm:text-right"
                    >
                      {nextInSeries.title} →
                    </Link>
                  ) : (
                    <span />
                  )}
                </div>
              </nav>
            )}
           </div>
         </div>
      </div>
    </main>
  );
}

import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { Post } from "../../../../packages/db/prisma/generated/client";

interface RelatedPostsProps {
	posts: (Post & {
		category?: { id: string; name: string };
		tags?: Array<{ id: string; name: string; slug: string }>;
	})[];
	limit?: number;
}

export function RelatedPosts({ posts, limit = 3 }: RelatedPostsProps) {
	if (!posts || posts.length === 0) return null;

	const displayPosts = posts.slice(0, limit);

	return (
		<section className="py-12">
			<h3 className="mb-8 font-bold text-2xl">Related Articles</h3>
			<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
				{displayPosts.map((post) => {
					const slug =
						post.slug || post.title.toLowerCase().replace(/\s+/g, "-");
					return (
						<Link
							key={post.id}
							to={`/blog/${slug}/`}
							className="group rounded-lg border border-border/40 bg-card/50 p-6 transition-all duration-300 hover:border-primary/30 hover:bg-card/80"
						>
							<div className="space-y-3">
								{post.category && (
									<span className="inline-block rounded-full bg-primary/10 px-2.5 py-1 font-medium text-primary text-xs">
										{post.category.name}
									</span>
								)}
								<h4 className="line-clamp-2 font-semibold text-lg transition-colors duration-200 group-hover:text-primary">
									{post.title}
								</h4>
								<p className="line-clamp-2 text-foreground/60 text-sm">
									{post.excerpt}
								</p>
								<div className="flex items-center gap-2 pt-2 font-medium text-primary text-sm">
									Read More
									<ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
								</div>
							</div>
						</Link>
					);
				})}
			</div>
		</section>
	);
}

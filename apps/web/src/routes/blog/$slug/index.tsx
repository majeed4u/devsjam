import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PostView } from "@/components/PostView";
import { AuthorBio } from "@/components/post/author-bio";
import { RelatedPosts } from "@/components/post/related-posts";
import { SocialShare } from "@/components/post/social-share";
import { SubscribeNewsletter } from "@/components/post/subscribe-newsletter";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/blog/$slug/")({
	component: BlogPostComponent,
});

function BlogPostComponent() {
	const { slug } = useParams();
	const { data: posts } = useQuery(orpc.post.getPosts.queryOptions());

	const post = posts?.find(
		(p) =>
			p.slug === slug || p.title.toLowerCase().replace(/\s+/g, "-") === slug,
	);

	if (!post) {
		return (
			<main className="min-h-screen">
				<section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
					<div className="space-y-4 text-center">
						<h1 className="font-bold text-4xl">Post Not Found</h1>
						<p className="text-foreground/60">
							The post you're looking for doesn't exist.
						</p>
						<Link
							to="/blog"
							className="inline-block rounded-lg bg-primary px-6 py-2 font-medium text-primary-foreground transition-colors duration-200 hover:bg-primary/90"
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
			<div className="mx-auto max-w-4xl px-4 pt-12 pb-6 sm:px-6 lg:px-8">
				<Link
					to="/blog"
					className="group inline-flex items-center gap-1 text-primary transition-colors duration-200 hover:text-primary/80"
				>
					<ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
					Back to Blog
				</Link>
			</div>

			{/* Post Header */}
			<section className="mx-auto max-w-4xl px-4 pb-12 sm:px-6 lg:px-8">
				<div className="space-y-6">
					{/* Category/Tags */}
					<div className="flex flex-wrap gap-3">
								{post.category && (
									<Link
										to={`/blog/category/${encodeURIComponent(
											post.category.name,
										)}/`}
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
												to={`/blog/tag/${encodeURIComponent(tag.name)}/`}
												className="rounded-full bg-accent/50 px-3 py-1 font-medium text-foreground/70 text-sm transition-colors duration-200 hover:bg-accent"
											>
												{tag.name}
											</Link>
										))}
									</>

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
									<span className="font-medium">Published:</span> {publishDate}
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
							excerpt={post.excerpt}
						/>
					</div>
				</div>
			</section>

			{/* Cover Image */}
			{post.coverImage && (
				<section className="mx-auto max-w-4xl px-4 pb-12 sm:px-6 lg:px-8">
					<div className="relative aspect-video overflow-hidden rounded-xl border border-border/30 bg-accent/30">
						<img
							src={post.coverImage}
							alt={post.title}
							className="h-full w-full object-cover"
						/>
					</div>
				</section>
			)}

			{/* Post Content */}
			<section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
				<PostView post={post} />
			</section>

			{/* Divider */}
			<div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
				<div className="border-border/40 border-t" />
			</div>

			{/* Author Bio */}
			<section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
				<AuthorBio
					name="Majed"
					bio="Full-stack developer passionate about building scalable applications and sharing technical knowledge. Interested in web technologies, software architecture, and open source."
				/>
			</section>

			{/* Newsletter Signup */}
			<section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
				<SubscribeNewsletter />
			</section>

			{/* Related Posts */}
			{relatedPosts.length > 0 && (
				<section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
					<RelatedPosts posts={relatedPosts} />
				</section>
			)}
		</main>
	);
}

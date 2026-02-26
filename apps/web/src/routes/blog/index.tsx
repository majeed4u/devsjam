import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { PostCard } from "@/components/post/post-card";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/blog/")({
	component: BlogComponent,
});

function BlogComponent() {
	const { data: posts, isLoading } = useQuery(
		orpc.post.getPosts.queryOptions(),
	);

	return (
		<main className="min-h-screen">
			{/* Header Section */}
			<section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
				<div className="mb-12 space-y-4">
					<h1 className="font-bold text-4xl sm:text-5xl">Blog Articles</h1>
					<p className="text-foreground/70 text-xl">
						Explore my latest thoughts on web development, software
						architecture, and technology.
					</p>
				</div>

				{/* Filter/Sort Options */}
				<div className="mb-8 flex flex-wrap gap-2">
					<button className="rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground text-sm transition-colors duration-200 hover:bg-primary/90">
						All Posts
					</button>
					<button className="rounded-lg border border-border px-4 py-2 text-sm transition-colors duration-200 hover:bg-accent">
						Latest
					</button>
					<button className="rounded-lg border border-border px-4 py-2 text-sm transition-colors duration-200 hover:bg-accent">
						Most Popular
					</button>
				</div>
			</section>

			{/* Posts Grid */}
			<section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8">
				{isLoading && (
					<div className="space-y-4">
						{[1, 2, 3].map((i) => (
							<div
								key={i}
								className="h-48 animate-pulse rounded-lg bg-accent/50"
							/>
						))}
					</div>
				)}

				{posts && posts.length > 0 ? (
					<div className="grid gap-6 md:gap-8">
						{posts.map((post) => (
							<PostCard key={post.id} post={post as any} />
						))}
					</div>
				) : !isLoading ? (
					<div className="py-12 text-center">
						<p className="text-foreground/60 text-lg">
							No posts yet. Check back soon!
						</p>
					</div>
				) : null}
			</section>
		</main>
	);
}

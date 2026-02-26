import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { PostCard } from "@/components/post/post-card";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/")({
	component: HomeComponent,
});

function HomeComponent() {
	const { data: posts, isLoading } = useQuery(
		orpc.post.getPosts.queryOptions(),
	);

	return (
		<main className="w-full bg-gradient-to-b from-background via-background to-background/50">
			{/* Hero Section */}
			<section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
				<div className="flex max-w-2xl flex-col gap-6">
					<div className="space-y-4">
						<h1 className="font-bold text-4xl tracking-tight sm:text-5xl lg:text-6xl">
							<span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
								DevJams
							</span>
						</h1>
						<p className="font-light text-foreground/70 text-lg leading-relaxed sm:text-xl">
							Sharing experiences, knowledge, and technical insights about web
							development, software architecture, and building products that
							matter.
						</p>
					</div>
					<div className="flex flex-wrap gap-3">
						<button className="rounded-lg bg-primary px-6 py-2 font-medium text-primary-foreground transition-colors duration-200 hover:bg-primary/90">
							Explore Posts
						</button>
						<button className="rounded-lg border border-border px-6 py-2 transition-colors duration-200 hover:bg-accent">
							Learn More
						</button>
					</div>
				</div>
			</section>

			{/* Latest Posts Section */}
			<section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
				<div className="mb-12">
					<h2 className="mb-2 font-bold text-3xl sm:text-4xl">
						Latest Articles
					</h2>
					<p className="text-foreground/60">
						Thoughts on tech, development, and building better software
					</p>
				</div>

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
				) : (
					<div className="py-12 text-center">
						<p className="text-foreground/60">No posts yet. Check back soon!</p>
					</div>
				)}
			</section>
		</main>
	);
}

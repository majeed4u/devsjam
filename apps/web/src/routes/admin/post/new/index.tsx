import { createFileRoute } from "@tanstack/react-router";
import { NewPostForm } from "@/components/post/new-post-form";

export const Route = createFileRoute("/admin/post/new/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="animate-fade-in space-y-6">
			<div>
				<h1 className="font-bold text-3xl">Create New Post</h1>
				<p className="mt-1 text-foreground/60">
					Share your thoughts and insights with your readers.
				</p>
			</div>
			<div className="animate-slide-in-up" style={{ animationDelay: "0.1s" }}>
				<NewPostForm />
			</div>
		</div>
	);
}

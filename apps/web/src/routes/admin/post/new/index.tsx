import { NewPostForm } from "@/components/post/new-post-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/post/new/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Create New Post</h1>
        <p className="text-foreground/60 mt-1">
          Share your thoughts and insights with your readers.
        </p>
      </div>
      <div className="animate-slide-in-up" style={{ animationDelay: "0.1s" }}>
        <NewPostForm />
      </div>
    </div>
  );
}

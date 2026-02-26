import { createFileRoute, useParams } from "@tanstack/react-router";
import { EditPostForm } from "@/components/post/edit-post-form";

export const Route = createFileRoute("/admin/post/$postId/edit/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { postId } = useParams({ from: "/admin/post/$postId/edit/" });
  return (
    <div className="space-y-6">
      <EditPostForm postId={postId} />
    </div>
  );
}

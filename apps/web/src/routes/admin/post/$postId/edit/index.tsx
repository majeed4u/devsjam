import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/post/$postId/edit/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/admin/new-post/$new-postId/edit-post/"!</div>;
}

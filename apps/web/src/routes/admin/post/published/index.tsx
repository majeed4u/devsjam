import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/post/published/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/admin/post/published/"!</div>;
}

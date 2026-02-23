import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/post/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/admin/posts/"!</div>;
}

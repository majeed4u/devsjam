import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/post/new/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/admin/post/new/"!</div>;
}

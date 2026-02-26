import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/blog/category/$category/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/blog/category/$category/"!</div>;
}

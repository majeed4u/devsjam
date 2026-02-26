import { createFileRoute } from "@tanstack/react-router";
import { DashboardOverview } from "@/components/admin/dashboard-overview";

export const Route = createFileRoute("/admin/analytics/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Overview of your blog performance and statistics
        </p>
      </div>
      <DashboardOverview />
    </div>
  );
}

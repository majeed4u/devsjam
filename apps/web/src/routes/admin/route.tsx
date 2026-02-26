import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  component: AdminDashboard,
});

function AdminDashboard() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full p-4">
        <Outlet />
      </main>
    </SidebarProvider>
  );
}

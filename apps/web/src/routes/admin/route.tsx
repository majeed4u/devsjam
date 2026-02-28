import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { useEffect } from "react";

export const Route = createFileRoute("/admin")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const navigate = useNavigate();
  const { data: session, isPending } = authClient.useSession();
  const isAdmin = session?.user?.role === "admin";

  console.log("current user role", session?.user?.role);

  useEffect(() => {
    // undefined = still loading, null = loaded but no session
    if (isPending || session === undefined) return;

    if (!session || !isAdmin) {
      navigate({ to: "/" });
    }
  }, [isPending, session, isAdmin, navigate]);

  // Don't render anything until auth is resolved
  if (isPending || session === undefined) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <span className="text-muted-foreground text-sm">Loading...</span>
      </div>
    );
  }

  if (!session || !isAdmin) return null;

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full p-4">
        <Outlet />
      </main>
    </SidebarProvider>
  );
}

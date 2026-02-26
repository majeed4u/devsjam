import type { ReactNode } from "react";
import { Outlet } from "@tanstack/react-router";

interface MainLayoutProps {
  children?: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col min-h-screen">
        {/* Main content area */}
        <main className="flex-1">{children || <Outlet />}</main>
      </div>
    </div>
  );
}

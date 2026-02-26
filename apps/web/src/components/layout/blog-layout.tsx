import type { ReactNode } from "react";
import { PublicHeader } from "./public-header";
import { Footer } from "./footer";

interface BlogLayoutProps {
  children: ReactNode;
}

export function BlogLayout({ children }: BlogLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col min-h-screen">
        <PublicHeader />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  );
}

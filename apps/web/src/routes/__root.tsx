import type { AppRouterClient } from "@devjams/api/routers/index";
import { createORPCClient } from "@orpc/client";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  useLocation,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { NuqsAdapter } from "nuqs/adapters/tanstack-router";
import { useState } from "react";
import { BlogFooter } from "@/components/blog-footer";
import { BlogHeader } from "@/components/blog-header";
import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { link, type orpc } from "@/utils/orpc";

import "../index.css";

export interface RouterAppContext {
  orpc: typeof orpc;
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: RootComponent,
  head: () => ({
    meta: [
      {
        title: "DevJams",
      },
      {
        name: "description",
        content:
          "DevJams — a personal blog about DevOps, infrastructure, CI/CD, and reliability.",
      },
    ],
    links: [
      {
        rel: "icon",
        href: "/favicon.ico",
      },
    ],
  }),
});

function RootComponent() {
  const [client] = useState<AppRouterClient>(() => createORPCClient(link));
  const [orpcUtils] = useState(() => createTanstackQueryUtils(client));
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");
  const isAuthRoute =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <>
      <HeadContent />
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        disableTransitionOnChange
        storageKey="vite-ui-theme"
      >
        <NuqsAdapter>
          <div className="flex min-h-svh flex-col">
            {/* Conditionally render header based on route */}
            {!isAdminRoute && !isAuthRoute && <BlogHeader />}

            {/* Main content area */}
            <div className="flex-1">
              {isAdminRoute ? (
                // Admin layout with existing structure
                <div className="grid h-full grid-rows-[auto_1fr]">
                  <Outlet />
                </div>
              ) : (
                // Public blog layout with full width content
                <div className="w-full">
                  <Outlet />
                </div>
              )}
            </div>

            {/* Footer - only for public routes */}
            {!isAdminRoute && !isAuthRoute && <BlogFooter />}
          </div>
          <Toaster richColors />
        </NuqsAdapter>
      </ThemeProvider>
      <TanStackRouterDevtools position="bottom-left" />
      <ReactQueryDevtools position="bottom" buttonPosition="bottom-right" />
    </>
  );
}

"use client";

import * as React from "react";

import { NavMain } from "@/components/nav-main";

import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboardIcon,
  ChartBarIcon,
  CommandIcon,
  Archive,
  BookOpenIcon,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: <LayoutDashboardIcon />,
    },

    {
      title: "Analytics",
      url: "/admin/analytics",
      icon: <ChartBarIcon />,
    },
    {
      title: "Published Posts",
      url: "/admin/post/published",
      icon: <BookOpenIcon />,
    },
    {
      title: "Archived Posts",
      url: "/admin/post/archived",
      icon: <Archive />,
    },
  ],
};
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = authClient.useSession();
  return (
    <Sidebar collapsible="none" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<a href="#" />}
            >
              <CommandIcon className="size-5!" />
              <span className="text-base font-semibold">
                <Link to="/">DevJams</Link>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={session?.user} />
      </SidebarFooter>
    </Sidebar>
  );
}

"use client";

import * as React from "react";

import { AppSidebar } from "@/components/app-sidebar";
import { GlobalBreadcrumbs } from "@/components/global-breadcrumbs";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SonnerProvider } from "@/lib/providers/sonner-provider";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <SonnerProvider />
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <GlobalBreadcrumbs />
        </header>
        <div className="p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

"use client";

import * as React from "react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { PaletteIcon } from "lucide-react";

import { AppSidebar } from "@/components/app-sidebar";
import { AssetModal } from "@/components/asset-modal";
import { GlobalBreadcrumbs } from "@/components/global-breadcrumbs";
import { Button } from "@/components/ui/button";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SonnerProvider } from "@/lib/providers/sonner-provider";

function Header() {
  const [assetModalOpen, setAssetModalOpen] = useState(false);

  return (
    <>
      <header className="flex h-14 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <GlobalBreadcrumbs />
        <div className="ml-auto">
          <Button
            size="sm"
            onClick={() => setAssetModalOpen(true)}
            className="gap-2"
          >
            <PaletteIcon className="size-4" />
            <span className="hidden sm:inline">Website Assets</span>
          </Button>
        </div>
      </header>
      <AssetModal open={assetModalOpen} onOpenChange={setAssetModalOpen} />
    </>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isToolDetailPage =
    pathname?.startsWith("/tools/") && pathname !== "/tools";
  const contentOverflow = isToolDetailPage
    ? // Allow scrolling on mobile so content isn't trapped off-screen.
      // Keep the previous "no page scroll" behavior on md+ if desired.
      "overflow-y-auto md:overflow-hidden"
    : "overflow-y-auto";

  return (
    <div className="h-screen overflow-hidden">
      <SidebarProvider>
        <SonnerProvider />
        <AppSidebar />
        <SidebarInset className="flex flex-col h-full overflow-hidden">
          <div className="shrink-0">
            <Header />
          </div>
          <div className={`flex-1 p-6 min-h-0 ${contentOverflow}`}>
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

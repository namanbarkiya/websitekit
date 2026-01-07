"use client";

import * as React from "react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { PaletteIcon } from "lucide-react";

import { AppSidebar } from "@/components/app-sidebar";
import { AssetModal } from "@/components/asset-modal";
import { Button } from "@/components/ui/button";
import { GlobalBreadcrumbs } from "@/components/global-breadcrumbs";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { SonnerProvider } from "@/lib/providers/sonner-provider";

function Header() {
  const { state, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed" && !isMobile;
  const [assetModalOpen, setAssetModalOpen] = useState(false);

  // Show asset button when sidebar is collapsed or in mobile view
  const showAssetButton = isCollapsed || isMobile;

  return (
    <>
      <header className="flex h-14 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <GlobalBreadcrumbs />
        {showAssetButton && (
          <div className="ml-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAssetModalOpen(true)}
              className="gap-2"
            >
              <PaletteIcon className="size-4" />
              <span className="hidden sm:inline">Assets</span>
            </Button>
          </div>
        )}
      </header>
      <AssetModal open={assetModalOpen} onOpenChange={setAssetModalOpen} />
    </>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  return (
    <div className="h-screen overflow-hidden">
      <SidebarProvider>
        <SonnerProvider />
        <AppSidebar />
        <SidebarInset className="flex flex-col h-full overflow-hidden">
          <div className="shrink-0">
            <Header />
          </div>
          <div
            className={`flex-1 p-6 min-h-0 ${
              isLandingPage ? "overflow-y-auto" : "overflow-hidden"
            }`}
          >
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

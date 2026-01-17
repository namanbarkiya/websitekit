"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

import { Logo } from "@/components/logo";
import { SettingsPopover } from "@/components/settings-popover";
import { SidebarSearch } from "@/components/sidebar-search";
import { CollapsibleCategory } from "@/components/sidebar/collapsible-category";
import { NavItem } from "@/components/sidebar/nav-item";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { sidebarConfig, type SidebarNavItem } from "@/config/sidebar";

export function AppSidebar() {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  const isItemActive = (item: SidebarNavItem) => {
    // Special-case: "/tools" should not be active on "/tools/<toolId>"
    if (item.href === "/tools") {
      return pathname === "/tools";
    }
    return (
      pathname === item.href ||
      (item.href !== "/" && pathname?.startsWith(`${item.href}/`))
    );
  };

  // Track which categories are open
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    () => {
      // IMPORTANT: keep the initial render deterministic for SSR + hydration.
      // We'll open the active category in an effect after mount.
      const initial: Record<string, boolean> = {};
      sidebarConfig.categories.forEach((category) => {
        initial[category.title] = false;
      });
      return initial;
    }
  );

  const handleCategoryOpenChange = (categoryTitle: string, open: boolean) => {
    setOpenCategories((prev) => ({ ...prev, [categoryTitle]: open }));
  };

  // Close mobile sidebar on navigation
  const handleNavigate = isMobile ? () => setOpenMobile(false) : undefined;

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <div className="flex items-center gap-0 py-1.5 group-data-[collapsible=icon]:justify-center">
          <Logo
            variant="icon"
            size="sm"
            href="/"
            className="hidden group-data-[collapsible=icon]:flex"
          />
          <Logo
            variant="full-with-tagline"
            size="sm"
            href="/"
            className="group-data-[collapsible=icon]:hidden"
          />
        </div>
        <SidebarSearch />
      </SidebarHeader>

      <SidebarContent className="gap-0">
        {/* Main nav items (Get Started, etc.) */}
        {sidebarConfig.main.length > 0 && (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {sidebarConfig.main.map((item) => (
                  <NavItem
                    key={item.href}
                    item={item}
                    isActive={isItemActive(item)}
                    onNavigate={handleNavigate}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Divider */}
        <Separator className="my-2" />

        {/* Most Used (derived from config item flag) */}
        {(() => {
          const mostUsedItems = sidebarConfig.categories
            .flatMap((cat) => cat.items)
            .filter((item) => item.mostUsed && !item.locked)
            .sort((a, b) => a.title.localeCompare(b.title))
            .slice(0, 5); // Limit to 5 tools

          if (mostUsedItems.length === 0) return null;

          return (
            <SidebarGroup>
              <SidebarGroupLabel>Most Used</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {mostUsedItems.map((item) => (
                    <NavItem
                      key={`most-used:${item.href}`}
                      item={item}
                      isActive={isItemActive(item)}
                      onNavigate={handleNavigate}
                    />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })()}

        {/* Collapsible categorized tools */}
        {sidebarConfig.categories.map((category) => (
          <CollapsibleCategory
            key={category.title}
            category={category}
            isItemActive={isItemActive}
            onNavigate={handleNavigate}
            isOpen={openCategories[category.title] || false}
            onOpenChange={(open) =>
              handleCategoryOpenChange(category.title, open)
            }
          />
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SettingsPopover />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

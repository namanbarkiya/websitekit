"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRightIcon, LockIcon, PaletteIcon } from "lucide-react";

import { AssetModal } from "@/components/asset-modal";
import { Logo } from "@/components/logo";
import { SettingsPopover } from "@/components/settings-popover";
import { SidebarSearch } from "@/components/sidebar-search";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  sidebarConfig,
  type SidebarNavCategory,
  type SidebarNavItem,
} from "@/config/sidebar";

function NavItem({
  item,
  isActive,
  onNavigate,
}: {
  item: SidebarNavItem;
  isActive: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;

  if (item.locked) {
    return (
      <SidebarMenuButton
        tooltip={`${item.title} (Coming Soon)`}
        isActive={false}
        disabled
        className="cursor-not-allowed opacity-50"
      >
        <Icon />
        <span className="flex-1 truncate">{item.title}</span>
        {item.badge === "soon" && (
          <Badge
            variant="outline"
            className="ml-auto h-5 px-1.5 text-[10px] font-normal"
          >
            Soon
          </Badge>
        )}
        {!item.badge && <LockIcon className="ml-auto size-3 opacity-50" />}
      </SidebarMenuButton>
    );
  }

  return (
    <SidebarMenuButton asChild tooltip={item.title} isActive={isActive}>
      <Link href={item.href} className="py-5" onClick={onNavigate}>
        <Icon />
        <span className="flex-1 truncate">{item.title}</span>
        {item.badge === "new" && (
          <Badge className="ml-auto h-5 px-1.5 text-[10px] font-normal">
            New
          </Badge>
        )}
        {item.badge === "beta" && (
          <Badge
            variant="secondary"
            className="ml-auto h-5 px-1.5 text-[10px] font-normal"
          >
            Beta
          </Badge>
        )}
      </Link>
    </SidebarMenuButton>
  );
}

function CollapsibleCategory({
  category,
  isItemActive,
  onNavigate,
  isOpen,
  onOpenChange,
  onCategoryClickWhileCollapsed,
}: {
  category: SidebarNavCategory;
  isItemActive: (item: SidebarNavItem) => boolean;
  onNavigate?: () => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCategoryClickWhileCollapsed?: (categoryTitle: string) => void;
}) {
  const { state, setOpen, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed" && !isMobile;

  // Handle category click when collapsed
  const handleCategoryClick = () => {
    if (isCollapsed) {
      // Notify parent that this category was clicked
      onCategoryClickWhileCollapsed?.(category.title);
      // Expand sidebar first
      setOpen(true);
      // Then open this category after a short delay to allow sidebar animation
      setTimeout(() => {
        onOpenChange(true);
      }, 150);
    } else {
      // Toggle category when sidebar is expanded
      onOpenChange(!isOpen);
    }
  };

  // When collapsed, show as icon button
  if (isCollapsed) {
    const CategoryIcon = category.icon;
    return (
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip={category.title}
                onClick={handleCategoryClick}
                className="cursor-pointer"
              >
                <CategoryIcon />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  // When expanded, show normal collapsible category
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={onOpenChange}
      className="group/collapsible"
    >
      <SidebarGroup>
        <CollapsibleTrigger asChild>
          <SidebarGroupLabel className="cursor-pointer select-none hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md transition-colors">
            <span className="flex-1">{category.title}</span>
            <ChevronRightIcon className="size-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarGroupLabel>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {category.items.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <NavItem
                    item={item}
                    isActive={isItemActive(item)}
                    onNavigate={onNavigate}
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const { isMobile, setOpenMobile, state } = useSidebar();
  const isCollapsed = state === "collapsed" && !isMobile;
  const [assetModalOpen, setAssetModalOpen] = useState(false);

  const isItemActive = (item: SidebarNavItem) =>
    pathname === item.href ||
    (item.href !== "/" && pathname?.startsWith(`${item.href}/`));

  // Track which categories are open
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    () => {
      // Initialize with categories that have active items
      const initial: Record<string, boolean> = {};
      sidebarConfig.categories.forEach((category) => {
        initial[category.title] = category.items.some(isItemActive);
      });
      return initial;
    }
  );

  // Track category that was clicked while collapsed (to preserve it when expanding)
  const clickedCategoryRef = useRef<string | null>(null);

  // Reset all categories to closed when sidebar collapses
  // When sidebar expands, open categories that have active items or the clicked category
  useEffect(() => {
    if (isCollapsed) {
      setOpenCategories({});
      clickedCategoryRef.current = null;
    } else {
      // When sidebar expands, open categories that have active items
      // Also preserve the category that was clicked while collapsed
      const updated: Record<string, boolean> = {};
      sidebarConfig.categories.forEach((category) => {
        const hasActive = category.items.some(isItemActive);
        const wasClicked = clickedCategoryRef.current === category.title;
        updated[category.title] = hasActive || wasClicked;
      });
      setOpenCategories(updated);
      // Clear the ref after using it
      if (clickedCategoryRef.current) {
        clickedCategoryRef.current = null;
      }
    }
  }, [isCollapsed, pathname]);

  // Update open state when active item changes (only when expanded)
  useEffect(() => {
    if (!isCollapsed) {
      sidebarConfig.categories.forEach((category) => {
        const hasActive = category.items.some(isItemActive);
        if (hasActive) {
          setOpenCategories((prev) => ({ ...prev, [category.title]: true }));
        }
      });
    }
  }, [pathname, isCollapsed]);

  const handleCategoryClickWhileCollapsed = (categoryTitle: string) => {
    clickedCategoryRef.current = categoryTitle;
  };

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
        {/* Website Assets - Configuration (at top, separate from tools) */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Website Assets"
                  onClick={() => setAssetModalOpen(true)}
                  className="cursor-pointer"
                >
                  <PaletteIcon />
                  <span className="flex-1 truncate">Website Assets</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Divider */}
        <Separator className="my-2" />

        {/* Main nav items (Home, etc.) */}
        {sidebarConfig.main.length > 0 && (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {sidebarConfig.main.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <NavItem
                      item={item}
                      isActive={isItemActive(item)}
                      onNavigate={handleNavigate}
                    />
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

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
            onCategoryClickWhileCollapsed={handleCategoryClickWhileCollapsed}
          />
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SettingsPopover />
      </SidebarFooter>

      <SidebarRail />
      <AssetModal open={assetModalOpen} onOpenChange={setAssetModalOpen} />
    </Sidebar>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRightIcon, LockIcon } from "lucide-react";

import { SettingsPopover } from "@/components/settings-popover";
import { SidebarSearch } from "@/components/sidebar-search";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
} from "@/components/ui/sidebar";
import {
  sidebarConfig,
  type SidebarNavCategory,
  type SidebarNavItem,
} from "@/config/sidebar";

function NavItem({
  item,
  isActive,
}: {
  item: SidebarNavItem;
  isActive: boolean;
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
      <Link href={item.href} className="py-5">
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
}: {
  category: SidebarNavCategory;
  isItemActive: (item: SidebarNavItem) => boolean;
}) {
  // Check if any item in this category is active
  const hasActiveItem = category.items.some(isItemActive);

  return (
    <Collapsible
      defaultOpen={hasActiveItem || false}
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
                  <NavItem item={item} isActive={isItemActive(item)} />
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

  const isItemActive = (item: SidebarNavItem) =>
    pathname === item.href ||
    (item.href !== "/" && pathname?.startsWith(`${item.href}/`));

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <div className="flex items-center gap-2 py-1.5">
          <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md font-semibold px-2">
            W
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <div className="text-sm font-semibold leading-none">WebsiteKit</div>
            <div className="text-muted-foreground text-xs">
              Kickstart your site!
            </div>
          </div>
        </div>
        <SidebarSearch />
      </SidebarHeader>

      <SidebarContent className="gap-0">
        {/* Main nav items (Home, etc.) */}
        {sidebarConfig.main.length > 0 && (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {sidebarConfig.main.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <NavItem item={item} isActive={isItemActive(item)} />
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

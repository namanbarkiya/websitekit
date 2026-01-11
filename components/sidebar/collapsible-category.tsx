"use client";

import { ChevronRightIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import type { SidebarNavCategory, SidebarNavItem } from "@/config/sidebar";

import { NavItem } from "./nav-item";

interface CollapsibleCategoryProps {
  category: SidebarNavCategory;
  isItemActive: (item: SidebarNavItem) => boolean;
  onNavigate?: () => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CollapsibleCategory({
  category,
  isItemActive,
  onNavigate,
  isOpen,
  onOpenChange,
}: CollapsibleCategoryProps) {
  const { state, setOpen, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed" && !isMobile;

  // Handle category click when collapsed
  const handleCategoryClick = () => {
    if (isCollapsed) {
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
                <NavItem
                  key={item.href}
                  item={item}
                  isActive={isItemActive(item)}
                  onNavigate={onNavigate}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}

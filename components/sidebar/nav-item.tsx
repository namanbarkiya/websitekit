"use client";

import Link from "next/link";
import { LockIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import type { SidebarNavItem } from "@/config/sidebar";

interface NavItemProps {
  item: SidebarNavItem;
  isActive: boolean;
  onNavigate?: () => void;
}

export function NavItem({ item, isActive, onNavigate }: NavItemProps) {
  const Icon = item.icon;

  if (item.locked) {
    return (
      <SidebarMenuItem>
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
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem>
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
    </SidebarMenuItem>
  );
}

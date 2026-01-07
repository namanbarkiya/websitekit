import type { LucideIcon } from "lucide-react";
import { BadgeCheckIcon, HomeIcon, SettingsIcon } from "lucide-react";

export type SidebarNavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export const sidebarNav: SidebarNavItem[] = [
  { title: "Home", href: "/", icon: HomeIcon },
  { title: "Settings", href: "/settings", icon: SettingsIcon },
  { title: "Status", href: "/status", icon: BadgeCheckIcon },
];

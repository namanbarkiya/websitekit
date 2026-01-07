"use client";

import Link from "next/link";
import {
  ChevronsUpDownIcon,
  HelpCircleIcon,
  MailIcon,
  MoonIcon,
  SettingsIcon,
  SunIcon,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useDarkMode } from "@/lib/hooks/use-dark-mode";

export function SettingsPopover() {
  const { isMobile, open } = useSidebar();
  const [isDark, toggleDark] = useDarkMode();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton tooltip="Settings">
              <SettingsIcon />
              <span className="min-w-0 flex-1 truncate">Settings</span>
              {open && <ChevronsUpDownIcon className="ml-auto" />}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel>Extras</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={toggleDark}>
              {isDark ? <SunIcon /> : <MoonIcon />}
              {isDark ? "Light mode" : "Dark mode"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/faq">
                <HelpCircleIcon />
                FAQ
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/contact">
                <MailIcon />
                Contact us
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

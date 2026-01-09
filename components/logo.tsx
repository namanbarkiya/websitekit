"use client";

import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils/cn";

type LogoVariant =
  | "icon"
  | "full"
  | "full-with-tagline"
  | "primary-bg"
  | "primary-bg-padded"
  | "dark-bg"
  | "dark-bg-padded"
  | "white-bg"
  | "white-bg-padded";

interface LogoProps {
  /** Logo variant */
  variant?: LogoVariant;
  /** Link href (if provided, logo becomes a link) */
  href?: string;
  /** Additional className */
  className?: string;
  /** Logo size */
  size?: "sm" | "md" | "lg";
}

const LOGO_PATHS: Record<LogoVariant, string> = {
  icon: "/logo/primary_logo.png",
  full: "/logo/primary_logo.svg",
  "full-with-tagline": "/logo/primary_logo.svg",
  "primary-bg": "/logo/primary_bg.png",
  "primary-bg-padded": "/logo/primary_bg_padded.png",
  "dark-bg": "/logo/dark_bg.png",
  "dark-bg-padded": "/logo/dark_bg_padded.png",
  "white-bg": "/logo/white_bg.png",
  "white-bg-padded": "/logo/white_bg_padded.png",
};

export function Logo({
  variant = "full",
  href,
  className,
  size = "md",
}: LogoProps) {
  const logoPath = LOGO_PATHS[variant];
  const showText = variant === "full" || variant === "full-with-tagline";
  const showTagline = variant === "full-with-tagline";

  // Size classes
  const sizeClasses = {
    sm: "h-6",
    md: "h-8",
    lg: "h-12",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
  };

  const taglineSizeClasses = {
    sm: "text-xs",
    md: "text-xs",
    lg: "text-sm",
  };

  const content = (
    <div
      className={cn(
        "flex items-center",
        showText ? "gap-3" : "justify-center",
        className
      )}
    >
      <div className={cn(sizeClasses[size], "relative w-auto")}>
        <Image
          src={logoPath}
          alt="WebsiteKit"
          width={size === "sm" ? 24 : size === "md" ? 32 : 48}
          height={size === "sm" ? 24 : size === "md" ? 32 : 48}
          className="h-full w-auto object-contain"
        />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span
            className={cn("font-semibold leading-none", textSizeClasses[size])}
          >
            WebsiteKit
          </span>
          {showTagline && (
            <span
              className={cn(
                "text-muted-foreground leading-none",
                taglineSizeClasses[size]
              )}
            >
              Tools as a Service
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block">
        {content}
      </Link>
    );
  }

  return content;
}

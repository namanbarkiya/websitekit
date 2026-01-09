import Link from "next/link";
import type { Metadata } from "next";
import { HomeIcon, HammerIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page Not Found | WebsiteKit",
  description: "The page you're looking for doesn't exist. Browse our tools or return to the homepage.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="space-y-6 max-w-md">
        <div className="space-y-2">
          <p className="text-8xl font-bold text-primary/20">404</p>
          <h1 className="text-2xl font-bold tracking-tight">Page not found</h1>
          <p className="text-muted-foreground">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It
            might have been moved or doesn&apos;t exist.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link href="/">
              <HomeIcon className="size-4 mr-2" />
              Go home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/tools">
              <HammerIcon className="size-4 mr-2" />
              Browse tools
            </Link>
          </Button>
        </div>

        <div className="pt-6 border-t">
          <p className="text-sm text-muted-foreground mb-3">
            Looking for something specific?
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Button variant="secondary" size="sm" asChild>
              <Link href="/tools/meta-tags">Meta Tags</Link>
            </Button>
            <Button variant="secondary" size="sm" asChild>
              <Link href="/tools/qr-code">QR Code</Link>
            </Button>
            <Button variant="secondary" size="sm" asChild>
              <Link href="/faq">FAQ</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

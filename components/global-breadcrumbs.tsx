"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useBreadcrumbs } from "@/lib/hooks/use-breadcrumbs";

export function GlobalBreadcrumbs() {
  const pathname = usePathname();
  const { breadcrumbs, generateBreadcrumbs } = useBreadcrumbs();

  React.useEffect(() => {
    if (!pathname) return;
    generateBreadcrumbs(pathname);
  }, [pathname, generateBreadcrumbs]);

  if (!breadcrumbs.length) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((item, idx) => {
          const isLast = idx === breadcrumbs.length - 1;

          return (
            <React.Fragment key={`${item.label}-${idx}`}>
              <BreadcrumbItem>
                {item.icon ? <item.icon className="mr-1 size-4" /> : null}
                {!isLast && item.href ? (
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {!isLast ? <BreadcrumbSeparator /> : null}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

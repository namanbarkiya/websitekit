import React from "react";

import { WithBreadcrumbs } from "@/components/with-breadcrumbs";

export default function NotFound() {
  return (
    <WithBreadcrumbs
      breadcrumbs={[{ label: "Tool Not Found", href: "/not-found" }]}
    >
      <div>Tool not found!</div>
    </WithBreadcrumbs>
  );
}

import Link from "next/link";

import { WithBreadcrumbs } from "@/components/with-breadcrumbs";

export default function page() {
  return (
    <WithBreadcrumbs
      breadcrumbs={[{ label: "Settings Page Title", href: "/settings" }]}
    >
      <h1>This is settings</h1>
      <Link href={"/settings/profile"}>Profile</Link>
    </WithBreadcrumbs>
  );
}

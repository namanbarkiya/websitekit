import { WithBreadcrumbs } from "@/components/with-breadcrumbs";

export default function FAQPage() {
  return (
    <WithBreadcrumbs
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "FAQ", href: "/faq" },
      ]}
    >
      <div className="max-w-2xl space-y-3">
        <h1 className="text-2xl font-semibold">FAQ</h1>
        <p className="text-muted-foreground">
          Coming soon. Add common questions here (or replace this with your docs
          content).
        </p>
      </div>
    </WithBreadcrumbs>
  );
}


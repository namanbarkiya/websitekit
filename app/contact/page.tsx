import { WithBreadcrumbs } from "@/components/with-breadcrumbs";

export default function ContactPage() {
  return (
    <WithBreadcrumbs
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Contact", href: "/contact" },
      ]}
    >
      <div className="max-w-2xl space-y-3">
        <h1 className="text-2xl font-semibold">Contact us</h1>
        <p className="text-muted-foreground">
          Add your support email / contact form here.
        </p>
        <div className="rounded-lg border p-4 text-sm">
          <div className="font-medium">Suggested</div>
          <div className="text-muted-foreground">
            Email:{" "}
            <a className="underline" href="mailto:hello@example.com">
              hello@example.com
            </a>
          </div>
        </div>
      </div>
    </WithBreadcrumbs>
  );
}


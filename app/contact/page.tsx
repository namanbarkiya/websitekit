import type { Metadata } from "next";

import { WithBreadcrumbs } from "@/components/with-breadcrumbs";

export const metadata: Metadata = {
  title: "Contact Us | WebsiteKit",
  description:
    "Get in touch with the WebsiteKit team. Report bugs, suggest features, or just say hello.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Us | WebsiteKit",
    description: "Get in touch with the WebsiteKit team.",
    url: "/contact",
    siteName: "WebsiteKit",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Contact Us | WebsiteKit",
    description: "Get in touch with the WebsiteKit team.",
  },
};

export default function ContactPage() {
  return (
    <WithBreadcrumbs
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Contact", href: "/contact" },
      ]}
    >
      <div className="max-w-2xl space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Contact Us</h1>
          <p className="text-muted-foreground">
            Have feedback, found a bug, or want to suggest a feature? We&apos;d
            love to hear from you.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border bg-card p-5 space-y-2">
            <h2 className="font-semibold">Email</h2>
            <p className="text-sm text-muted-foreground">
              Reach out directly via email for any inquiries.
            </p>
            <a
              href="mailto:naman@singlebit.xyz"
              className="text-primary hover:underline text-sm"
            >
              naman@singlebit.xyz
            </a>
          </div>

          <div className="rounded-lg border bg-card p-5 space-y-2">
            <h2 className="font-semibold">Twitter / X</h2>
            <p className="text-sm text-muted-foreground">
              Follow us for updates and quick support.
            </p>
            <a
              href="https://x.com/websitekitdev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline text-sm"
            >
              @websitekitdev
            </a>
          </div>
        </div>

        <div className="rounded-lg border bg-muted/30 p-5 space-y-3">
          <h2 className="font-semibold">What we&apos;d love to hear</h2>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
            <li>
              <strong>Bug reports:</strong> Found something broken? Let us know
              and we&apos;ll fix it ASAP.
            </li>
            <li>
              <strong>Feature requests:</strong> What tool would help your
              workflow? We&apos;re always building.
            </li>
            <li>
              <strong>General feedback:</strong> Love it? Hate it? We want to
              know.
            </li>
          </ul>
        </div>
      </div>
    </WithBreadcrumbs>
  );
}

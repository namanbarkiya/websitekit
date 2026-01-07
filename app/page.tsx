import { HomeNotificationDemo } from "@/components/home-notification-demo";
import { WithBreadcrumbs } from "@/components/with-breadcrumbs";

export default function Home() {
  return (
    <div className="max-w-2xl space-y-2">
      <h1 className="text-2xl font-semibold">Sidebar demo</h1>
      <p className="text-muted-foreground">
        This page is just for verifying the Shadcn sidebar works (desktop
        collapse + mobile sheet).
      </p>
      <HomeNotificationDemo />
    </div>
  );
}

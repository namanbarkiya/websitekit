"use client";

import { Button } from "@/components/ui/button";
import { useNotifications } from "@/lib/hooks/use-notifications";

export function HomeNotificationDemo() {
  const { success, error, warning, info, handleError } = useNotifications();

  return (
    <div className="pt-6">
      <div className="text-muted-foreground text-sm">
        Notifications (Sonner)
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button
          onClick={() => success("Saved", "Your changes have been saved.")}
        >
          Success
        </Button>
        <Button
          variant="destructive"
          onClick={() => error("Failed", "Something went wrong.")}
        >
          Error
        </Button>
        <Button
          variant="outline"
          onClick={() => warning("Heads up", "This action is irreversible.")}
        >
          Warning
        </Button>
        <Button
          variant="secondary"
          onClick={() => info("FYI", "This is an informational toast.")}
        >
          Info
        </Button>
        <Button
          variant="ghost"
          onClick={() => handleError(new Error("Demo error"), "Home demo")}
        >
          ErrorHandler demo
        </Button>
      </div>
    </div>
  );
}

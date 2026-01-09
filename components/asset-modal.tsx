"use client";

import { RotateCcwIcon } from "lucide-react";
import { toast } from "sonner";

import { AssetForm } from "@/components/asset-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAssetStore } from "@/lib/store/asset-store";

interface AssetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AssetModal({ open, onOpenChange }: AssetModalProps) {
  const resetAssets = useAssetStore((state) => state.resetAssets);
  const handleOpenChange = (newOpen: boolean) => onOpenChange(newOpen);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Website Assets</DialogTitle>
          <DialogDescription>
            Define your website information once. These will be used as defaults
            across all tools.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="block">
          <div className="py-4">
            <AssetForm
              active={open}
              showCancel
              onCancel={() => onOpenChange(false)}
              onSaved={() => onOpenChange(false)}
              leftActions={
                <button
                  type="button"
                  onClick={() => {
                    const ok = window.confirm(
                      "Reset website assets to defaults? This cannot be undone."
                    );
                    if (!ok) return;
                    resetAssets();
                    toast.success("Website assets reset");
                  }}
                  className="inline-flex items-center justify-center rounded-md bg-destructive text-destructive-foreground size-9 hover:bg-destructive/90 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label="Reset website assets"
                  title="Reset"
                >
                  <RotateCcwIcon className="size-4" />
                </button>
              }
            />
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

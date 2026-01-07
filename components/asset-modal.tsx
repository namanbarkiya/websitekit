"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { UploadIcon, XIcon, PaletteIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAssetStore, type WebsiteAssets } from "@/lib/store/asset-store";

interface AssetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Convert file to base64 data URL
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Validate domain format
 */
function validateDomain(domain: string): boolean {
  if (!domain.trim()) return true; // Empty is OK
  const domainRegex =
    /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;
  return domainRegex.test(domain.trim());
}

/**
 * Validate hex color format
 */
function validateColor(color: string): boolean {
  if (!color.trim()) return false;
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color.trim());
}

export function AssetModal({ open, onOpenChange }: AssetModalProps) {
  const assets = useAssetStore();
  const updateAssets = useAssetStore((state) => state.updateAssets);

  const [formData, setFormData] = useState<WebsiteAssets>({
    name: "",
    domain: "",
    description: "",
    primaryColor: "#3b82f6",
    logo: null,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof WebsiteAssets, string>>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync form data with store when modal opens
  useEffect(() => {
    if (open) {
      // Read fresh data from store when modal opens
      setFormData({
        name: assets.name,
        domain: assets.domain,
        description: assets.description,
        primaryColor: assets.primaryColor,
        logo: assets.logo,
      });
      setErrors({});
    }
  }, [open, assets]);

  // Reset form when modal opens
  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      onOpenChange(newOpen);
    },
    [onOpenChange]
  );

  const handleInputChange = (field: keyof WebsiteAssets, value: string | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB");
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      handleInputChange("logo", base64);
      toast.success("Logo uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload logo");
      console.error(error);
    }
  };

  const handleRemoveLogo = () => {
    handleInputChange("logo", null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = () => {
    // Validate form
    const newErrors: Partial<Record<keyof WebsiteAssets, string>> = {};

    if (formData.domain && !validateDomain(formData.domain)) {
      newErrors.domain = "Please enter a valid domain (e.g., example.com)";
    }

    if (!validateColor(formData.primaryColor)) {
      newErrors.primaryColor = "Please enter a valid hex color (e.g., #3b82f6)";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Save assets
    updateAssets(formData);
    toast.success("Website assets saved successfully");
    onOpenChange(false);
  };

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

        <div className="space-y-6 py-4">
          {/* Website Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Website Name</Label>
            <Input
              id="name"
              placeholder="My Awesome Website"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Domain */}
          <div className="space-y-2">
            <Label htmlFor="domain">Domain</Label>
            <Input
              id="domain"
              placeholder="example.com"
              value={formData.domain}
              onChange={(e) => handleInputChange("domain", e.target.value)}
              aria-invalid={!!errors.domain}
            />
            {errors.domain && (
              <p className="text-sm text-destructive">{errors.domain}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Enter domain without protocol (e.g., example.com)
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="A brief description of your website..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
              aria-invalid={!!errors.description}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>

          {/* Primary Color */}
          <div className="space-y-2">
            <Label htmlFor="primaryColor">Primary Brand Color</Label>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Input
                  id="primaryColor"
                  type="text"
                  placeholder="#3b82f6"
                  value={formData.primaryColor}
                  onChange={(e) =>
                    handleInputChange("primaryColor", e.target.value)
                  }
                  className="font-mono"
                  aria-invalid={!!errors.primaryColor}
                />
                <input
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) =>
                    handleInputChange("primaryColor", e.target.value)
                  }
                  className="absolute right-2 top-1/2 -translate-y-1/2 size-8 cursor-pointer opacity-0 peer"
                  style={{ pointerEvents: "auto" }}
                />
                <div
                  className="absolute right-2 top-1/2 -translate-y-1/2 size-8 rounded border border-input pointer-events-none peer-hover:border-ring"
                  style={{ backgroundColor: formData.primaryColor }}
                />
              </div>
              <PaletteIcon className="size-5 text-muted-foreground" />
            </div>
            {errors.primaryColor && (
              <p className="text-sm text-destructive">{errors.primaryColor}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Hex color format (e.g., #3b82f6)
            </p>
          </div>

          {/* Logo */}
          <div className="space-y-2">
            <Label>Logo</Label>
            {formData.logo ? (
              <div className="space-y-3">
                <div className="relative inline-block">
                  <img
                    src={formData.logo}
                    alt="Logo preview"
                    className="h-24 w-24 rounded-lg border object-contain"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -right-2 -top-2 size-6"
                    onClick={handleRemoveLogo}
                  >
                    <XIcon className="size-3" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Click to change logo
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8">
                <UploadIcon className="size-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Upload a logo image
                </p>
                <p className="text-xs text-muted-foreground mb-3">
                  PNG, JPG up to 2MB
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Choose File
                </Button>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Assets</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

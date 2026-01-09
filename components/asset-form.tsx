"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PaletteIcon, UploadIcon, XIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAssetStore, type WebsiteAssets } from "@/lib/store/asset-store";

export interface AssetFormProps {
  /**
   * When this changes from false -> true, the form resets from store values.
   * Useful for modals that open/close without unmounting.
   */
  active?: boolean;
  /**
   * Optional wrapper styling for inline usage.
   */
  className?: string;
  /**
   * Optional cancel handler (e.g. close modal).
   */
  onCancel?: () => void;
  /**
   * Called after a successful save.
   */
  onSaved?: () => void;
  /**
   * Button labels (defaults are sensible).
   */
  saveLabel?: string;
  cancelLabel?: string;
  /**
   * Whether to show a cancel button.
   */
  showCancel?: boolean;
  /**
   * Optional actions to render on the left side
   * of the bottom button row.
   */
  leftActions?: React.ReactNode;
  /**
   * Layout density.
   * - default: roomy (modal)
   * - compact: tighter (landing/hero)
   */
  variant?: "default" | "compact";
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

export function AssetForm({
  active = true,
  className,
  onCancel,
  onSaved,
  saveLabel = "Save Assets",
  cancelLabel = "Cancel",
  showCancel = true,
  leftActions,
  variant = "default",
}: AssetFormProps) {
  const assets = useAssetStore();
  const updateAssets = useAssetStore((state) => state.updateAssets);

  const [formData, setFormData] = useState<WebsiteAssets>({
    name: "",
    domain: "",
    description: "",
    primaryColor: "#3b82f6",
    logo: null,
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof WebsiteAssets, string>>
  >({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset from store when form becomes active (modal open) or on mount (inline).
  useEffect(() => {
    if (!active) return;
    // Avoid synchronous setState in effect body.
    Promise.resolve().then(() => {
      setFormData({
        name: assets.name,
        domain: assets.domain,
        description: assets.description,
        primaryColor: assets.primaryColor,
        logo: assets.logo,
      });
      setErrors({});
    });
  }, [
    active,
    assets.name,
    assets.domain,
    assets.description,
    assets.primaryColor,
    assets.logo,
  ]);

  const handleInputChange = useCallback(
    (field: keyof WebsiteAssets, value: string | null) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[field];
          return next;
        });
      }
    },
    [errors]
  );

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

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
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = () => {
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

    updateAssets(formData);
    toast.success("Website assets saved successfully");
    onSaved?.();
  };

  return (
    <div className={className}>
      <div className={variant === "compact" ? "space-y-4" : "space-y-6"}>
        <div
          className={
            variant === "compact" ? "grid gap-4 md:grid-cols-2" : "space-y-6"
          }
        >
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
            {variant === "compact" ? null : (
              <p className="text-xs text-muted-foreground">
                Enter domain without protocol (e.g., example.com)
              </p>
            )}
          </div>

          {/* Description */}
          <div
            className={
              variant === "compact" ? "space-y-2 md:col-span-2" : "space-y-2"
            }
          >
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="A brief description of your website..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={variant === "compact" ? 2 : 3}
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
                  aria-label="Pick a color"
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
            {variant === "compact" ? null : (
              <p className="text-xs text-muted-foreground">
                Hex color format (e.g., #3b82f6)
              </p>
            )}
          </div>

          {/* Logo */}
          <div className="space-y-2">
            <Label>Logo</Label>
            {variant === "compact" ? (
              <div className="flex items-center gap-3">
                {formData.logo ? (
                  <div className="relative">
                    <img
                      src={formData.logo}
                      alt="Logo preview"
                      className="h-14 w-14 rounded-lg border object-contain"
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
                ) : (
                  <div className="flex size-14 items-center justify-center rounded-lg border bg-muted/30">
                    <UploadIcon className="size-5 text-muted-foreground" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {formData.logo ? "Change" : "Upload"}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG/JPG up to 2MB
                  </p>
                </div>
              </div>
            ) : formData.logo ? (
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
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Choose File
                </Button>
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

        <div
          className={[
            "flex items-center gap-3 pt-2",
            leftActions ? "justify-between" : "justify-end",
          ].join(" ")}
        >
          {leftActions ? (
            <div className="flex items-center gap-2">{leftActions}</div>
          ) : null}
          <div className="flex items-center justify-end gap-3">
            {showCancel && (
              <Button variant="outline" onClick={onCancel}>
                {cancelLabel}
              </Button>
            )}
            <Button onClick={handleSave}>{saveLabel}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

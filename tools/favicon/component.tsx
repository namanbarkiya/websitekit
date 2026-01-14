"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { InfoIcon, UploadIcon, XIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ToolProps } from "@/lib/utils/tool-registry";

import { generateFaviconToolOutput } from "./lib/generator";
import { DEFAULT_STATE, type FaviconState } from "./types";

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function FieldLabel({
  htmlFor,
  label,
  help,
}: {
  htmlFor: string;
  label: string;
  help: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-sm text-muted-foreground hover:text-foreground"
            aria-label={`Help: ${label}`}
          >
            <InfoIcon className="size-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={6}>
          {help}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

export function FaviconComponent({
  assets,
  state,
  setState,
  onGenerate,
  setHeaderGenerate,
}: ToolProps) {
  const currentState = useMemo(
    () => ({ ...DEFAULT_STATE, ...(state as Partial<FaviconState>) }),
    [state]
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentStateRef = useRef(currentState);

  useEffect(() => {
    currentStateRef.current = currentState;
  }, [currentState]);

  // Initialize from assets (logo + primary color)
  useEffect(() => {
    const updates: Partial<FaviconState> = {};
    if (!currentState.sourceImage && assets.logo) {
      updates.sourceImage = assets.logo;
    }
    if (!currentState.backgroundColor && assets.primaryColor) {
      updates.backgroundColor = assets.primaryColor;
    }
    if (Object.keys(updates).length > 0) setState(updates);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assets.logo, assets.primaryColor]);

  const previewKey = useMemo(
    () =>
      JSON.stringify({
        sourceImage: currentState.sourceImage,
        backgroundColor: currentState.backgroundColor,
        transparentBackground: currentState.transparentBackground,
        paddingPercent: currentState.paddingPercent,
        includeIco: currentState.includeIco,
        includeBrowserPngs: currentState.includeBrowserPngs,
        includeApple: currentState.includeApple,
        includeAndroid: currentState.includeAndroid,
        includeManifest: currentState.includeManifest,
        appName: assets.name,
      }),
    [
      assets.name,
      currentState.backgroundColor,
      currentState.includeAndroid,
      currentState.includeApple,
      currentState.includeBrowserPngs,
      currentState.includeIco,
      currentState.includeManifest,
      currentState.paddingPercent,
      currentState.sourceImage,
      currentState.transparentBackground,
    ]
  );

  useEffect(() => {
    if (!currentState.sourceImage) return;
    let cancelled = false;
    const run = async () => {
      setIsGenerating(true);
      try {
        const output = await generateFaviconToolOutput({
          state: currentState,
          appName: assets.name,
        });
        if (!cancelled) onGenerate(output);
      } catch (error) {
        if (!cancelled) {
          toast.error("Failed to generate favicon files");
          console.error(error);
        }
      } finally {
        if (!cancelled) setIsGenerating(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewKey]);

  const handleGenerate = useCallback(() => {
    if (!currentStateRef.current.sourceImage) return;
    generateFaviconToolOutput({
      state: currentStateRef.current,
      appName: assets.name,
    })
      .then((output) => onGenerate(output))
      .catch((error) => {
        toast.error("Failed to generate favicon files");
        console.error(error);
      });
  }, [assets.name, onGenerate]);

  // Register header generate button
  useEffect(() => {
    if (!setHeaderGenerate) return;
    setHeaderGenerate({
      onGenerate: handleGenerate,
      label: "Generate",
      disabled: !currentState.sourceImage || isGenerating,
    });
    return () => setHeaderGenerate(null);
  }, [currentState.sourceImage, handleGenerate, isGenerating, setHeaderGenerate]);

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      toast.error("Image size must be less than 4MB");
      return;
    }
    try {
      const dataUrl = await fileToBase64(file);
      setState({ sourceImage: dataUrl });
      toast.success("Logo uploaded");
    } catch (error) {
      toast.error("Failed to read image file");
      console.error(error);
    }
  };

  const handleRemoveImage = () => {
    setState({ sourceImage: "" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border p-4 space-y-4">
        <div className="space-y-2">
          <FieldLabel
            htmlFor="sourceImage"
            label="Source image"
            help="Upload a square PNG/SVG/JPG. Larger source images produce sharper icons."
          />
          {currentState.sourceImage ? (
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={currentState.sourceImage}
                  alt="Favicon source preview"
                  className="h-20 w-20 rounded-lg border object-contain"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -right-2 -top-2 size-6"
                  onClick={handleRemoveImage}
                >
                  <XIcon className="size-3" />
                </Button>
              </div>
              <div className="space-y-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <UploadIcon className="size-4" />
                  Change image
                </Button>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, or SVG up to 4MB.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center">
              <UploadIcon className="size-6 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Upload a logo or icon image
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => fileInputRef.current?.click()}
              >
                Choose file
              </Button>
            </div>
          )}
          <input
            ref={fileInputRef}
            id="sourceImage"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
            className="hidden"
          />
          {assets.logo && !currentState.sourceImage ? (
            <p className="text-xs text-muted-foreground">
              Tip: You already uploaded a logo in Website Assets — click “Choose
              file” to use a different image.
            </p>
          ) : null}
        </div>
      </div>

      <div className="rounded-lg border p-4 space-y-4">
        <p className="text-sm font-semibold">Appearance</p>

        <div className="space-y-2">
          <FieldLabel
            htmlFor="padding"
            label="Padding"
            help="Add breathing room so your icon doesn’t feel cramped. 0–20% is common."
          />
          <input
            id="padding"
            type="range"
            min={0}
            max={40}
            step={1}
            value={clamp(currentState.paddingPercent, 0, 40)}
            onChange={(e) =>
              setState({
                paddingPercent: clamp(parseInt(e.target.value || "0", 10), 0, 40),
              })
            }
            className="w-full accent-primary"
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span className="font-medium text-foreground">
              {clamp(currentState.paddingPercent, 0, 40)}%
            </span>
            <span>40%</span>
          </div>
        </div>

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-0.5">
            <p className="text-sm font-medium">Transparent background</p>
            <p className="text-xs text-muted-foreground">
              Disable to flatten transparency onto a solid color.
            </p>
          </div>
          <Switch
            className="shrink-0 mt-0.5"
            checked={currentState.transparentBackground}
            onCheckedChange={(checked) =>
              setState({ transparentBackground: checked })
            }
            aria-label="Transparent background"
          />
        </div>

        {!currentState.transparentBackground ? (
          <div className="space-y-2">
            <FieldLabel
              htmlFor="backgroundColor"
              label="Background color"
              help="Used when transparent background is disabled."
            />
            <div className="flex gap-2">
              <Input
                id="backgroundColor"
                type="color"
                value={currentState.backgroundColor}
                onChange={(e) => setState({ backgroundColor: e.target.value })}
                className="w-16 h-10 px-1"
              />
              <Input
                type="text"
                value={currentState.backgroundColor}
                onChange={(e) => setState({ backgroundColor: e.target.value })}
                placeholder="#ffffff"
              />
            </div>
          </div>
        ) : null}
      </div>

      <div className="rounded-lg border p-4 space-y-4">
        <p className="text-sm font-semibold">Output files</p>

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-0.5">
            <p className="text-sm font-medium">favicon.ico</p>
            <p className="text-xs text-muted-foreground">
              Legacy support for browsers and tooling.
            </p>
          </div>
          <Switch
            className="shrink-0 mt-0.5"
            checked={currentState.includeIco}
            onCheckedChange={(checked) => setState({ includeIco: checked })}
            aria-label="Include favicon.ico"
          />
        </div>

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-0.5">
            <p className="text-sm font-medium">Browser PNGs (16/32/48/96)</p>
            <p className="text-xs text-muted-foreground">
              Standard favicon sizes used across browsers.
            </p>
          </div>
          <Switch
            className="shrink-0 mt-0.5"
            checked={currentState.includeBrowserPngs}
            onCheckedChange={(checked) =>
              setState({ includeBrowserPngs: checked })
            }
            aria-label="Include browser PNGs"
          />
        </div>

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-0.5">
            <p className="text-sm font-medium">Apple Touch Icon (180)</p>
            <p className="text-xs text-muted-foreground">
              Used when users add your site to iOS home screen.
            </p>
          </div>
          <Switch
            className="shrink-0 mt-0.5"
            checked={currentState.includeApple}
            onCheckedChange={(checked) => setState({ includeApple: checked })}
            aria-label="Include Apple Touch Icon"
          />
        </div>

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-0.5">
            <p className="text-sm font-medium">Android icons (192/512)</p>
            <p className="text-xs text-muted-foreground">
              Used for PWA installs and Android shortcuts.
            </p>
          </div>
          <Switch
            className="shrink-0 mt-0.5"
            checked={currentState.includeAndroid}
            onCheckedChange={(checked) => setState({ includeAndroid: checked })}
            aria-label="Include Android icons"
          />
        </div>

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-0.5">
            <p className="text-sm font-medium">site.webmanifest</p>
            <p className="text-xs text-muted-foreground">
              Provides metadata for PWA installs (includes icons).
            </p>
          </div>
          <Switch
            className="shrink-0 mt-0.5"
            checked={currentState.includeManifest}
            onCheckedChange={(checked) => setState({ includeManifest: checked })}
            aria-label="Include manifest"
          />
        </div>
      </div>
    </div>
  );
}


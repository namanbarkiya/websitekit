"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { InfoIcon, PlusIcon, TrashIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ToolProps } from "@/lib/utils/tool-registry";

import { generateFontLoadingOutput } from "./lib/generator";
import {
  DEFAULT_STATE,
  type FontLoadingState,
  type FontFace,
  type FontDisplay,
} from "./types";

function FieldLabel({
  htmlFor,
  label,
  help,
  optional,
}: {
  htmlFor: string;
  label: string;
  help: string;
  optional?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <Label htmlFor={htmlFor}>
        {label}
        {optional && (
          <span className="text-muted-foreground font-normal ml-1">
            (optional)
          </span>
        )}
      </Label>
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

export function FontLoadingComponent({
  assets,
  state,
  setState,
  onGenerate,
  setHeaderGenerate,
}: ToolProps) {
  const currentState = useMemo(
    () => ({ ...DEFAULT_STATE, ...(state as Partial<FontLoadingState>) }),
    [state]
  );

  const currentStateRef = useRef(currentState);
  useEffect(() => {
    currentStateRef.current = currentState;
  }, [currentState]);

  const previewKey = useMemo(
    () => JSON.stringify(currentState),
    [currentState]
  );

  // Real-time output generation
  useEffect(() => {
    const output = generateFontLoadingOutput(currentState);
    onGenerate(output);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewKey]);

  const handleGenerate = useCallback(() => {
    const output = generateFontLoadingOutput(currentStateRef.current);
    onGenerate(output);
  }, [onGenerate]);

  // Register header generate button
  useEffect(() => {
    if (!setHeaderGenerate) return;
    setHeaderGenerate({ onGenerate: handleGenerate, label: "Generate" });
    return () => setHeaderGenerate(null);
  }, [handleGenerate, setHeaderGenerate]);

  const addFont = () => {
    const newFont: FontFace = {
      id: `font-${Date.now()}`,
      fontFamily: "",
      src: "",
    };
    setState({
      fonts: [...currentState.fonts, newFont],
    });
  };

  const removeFont = (id: string) => {
    setState({
      fonts: currentState.fonts.filter((f) => f.id !== id),
    });
  };

  const updateFont = (id: string, updates: Partial<FontFace>) => {
    setState({
      fonts: currentState.fonts.map((f) =>
        f.id === id ? { ...f, ...updates } : f
      ),
    });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground space-y-2">
        <p className="font-medium text-foreground">Font Loading Strategy</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>swap</strong>: Show fallback immediately, swap when font loads (recommended)
          </li>
          <li>
            <strong>optional</strong>: Use font only if available quickly, otherwise skip
          </li>
          <li>
            <strong>fallback</strong>: Brief invisible text, then fallback, then swap
          </li>
          <li>
            <strong>block</strong>: Invisible text until font loads (not recommended)
          </li>
          <li>
            <strong>auto</strong>: Browser default (usually block)
          </li>
        </ul>
      </div>

      <div className="rounded-lg border p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label>Options</Label>
            <p className="text-xs text-muted-foreground">
              Configure font loading behavior
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="includePreload">Include Preload Tags</Label>
              <p className="text-xs text-muted-foreground">
                Generate &lt;link rel="preload"&gt; tags for fonts
              </p>
            </div>
            <Switch
              id="includePreload"
              checked={currentState.includePreload}
              onCheckedChange={(checked) =>
                setState({ includePreload: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="includeFontDisplay">Include font-display</Label>
              <p className="text-xs text-muted-foreground">
                Add font-display property to @font-face rules
              </p>
            </div>
            <Switch
              id="includeFontDisplay"
              checked={currentState.includeFontDisplay}
              onCheckedChange={(checked) =>
                setState({ includeFontDisplay: checked })
              }
            />
          </div>
          {currentState.includeFontDisplay && (
            <div className="space-y-2">
              <FieldLabel
                htmlFor="defaultFontDisplay"
                label="Default font-display"
                help="Default font-display value for fonts that don't specify one"
              />
              <Select
                value={currentState.defaultFontDisplay}
                onValueChange={(value: FontDisplay) =>
                  setState({ defaultFontDisplay: value })
                }
              >
                <SelectTrigger id="defaultFontDisplay">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="swap">swap (recommended)</SelectItem>
                  <SelectItem value="optional">optional</SelectItem>
                  <SelectItem value="fallback">fallback</SelectItem>
                  <SelectItem value="block">block</SelectItem>
                  <SelectItem value="auto">auto</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      {currentState.fonts.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            No fonts added yet
          </p>
          <Button variant="outline" onClick={addFont}>
            <PlusIcon className="size-4 mr-2" />
            Add Font
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {currentState.fonts.map((font, index) => (
            <div key={font.id} className="rounded-lg border p-4 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Font {index + 1}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFont(font.id)}
                >
                  <TrashIcon className="size-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <FieldLabel
                      htmlFor={`fontFamily-${font.id}`}
                      label="Font Family"
                      help="The font family name (e.g., 'Roboto', 'Inter')"
                    />
                    <Input
                      id={`fontFamily-${font.id}`}
                      value={font.fontFamily}
                      onChange={(e) =>
                        updateFont(font.id, { fontFamily: e.target.value })
                      }
                      placeholder="Roboto"
                    />
                  </div>
                  <div className="space-y-2">
                    <FieldLabel
                      htmlFor={`src-${font.id}`}
                      label="Source URL"
                      help="Font file URL or local() font name"
                    />
                    <Input
                      id={`src-${font.id}`}
                      value={font.src}
                      onChange={(e) =>
                        updateFont(font.id, { src: e.target.value })
                      }
                      placeholder="https://fonts.gstatic.com/.../Roboto.woff2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <FieldLabel
                      htmlFor={`fontWeight-${font.id}`}
                      label="Font Weight"
                      help="Font weight (e.g., 400, 700, normal, bold)"
                      optional
                    />
                    <Input
                      id={`fontWeight-${font.id}`}
                      value={font.fontWeight || ""}
                      onChange={(e) =>
                        updateFont(font.id, {
                          fontWeight: e.target.value || undefined,
                        })
                      }
                      placeholder="400"
                    />
                  </div>
                  <div className="space-y-2">
                    <FieldLabel
                      htmlFor={`fontStyle-${font.id}`}
                      label="Font Style"
                      help="Font style (normal, italic, oblique)"
                      optional
                    />
                    <Select
                      value={font.fontStyle}
                      onValueChange={(value) =>
                        updateFont(font.id, {
                          fontStyle: value,
                        })
                      }
                    >
                      <SelectTrigger id={`fontStyle-${font.id}`}>
                        <SelectValue placeholder="normal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">normal</SelectItem>
                        <SelectItem value="italic">italic</SelectItem>
                        <SelectItem value="oblique">oblique</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {currentState.includeFontDisplay && (
                    <div className="space-y-2">
                      <FieldLabel
                        htmlFor={`fontDisplay-${font.id}`}
                        label="Font Display"
                        help="Override default font-display for this font"
                        optional
                      />
                      <Select
                        value={font.fontDisplay}
                        onValueChange={(value: FontDisplay) =>
                          updateFont(font.id, {
                            fontDisplay: value,
                          })
                        }
                      >
                        <SelectTrigger id={`fontDisplay-${font.id}`}>
                          <SelectValue placeholder="Use default" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="swap">swap</SelectItem>
                          <SelectItem value="optional">optional</SelectItem>
                          <SelectItem value="fallback">fallback</SelectItem>
                          <SelectItem value="block">block</SelectItem>
                          <SelectItem value="auto">auto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <FieldLabel
                    htmlFor={`unicodeRange-${font.id}`}
                    label="Unicode Range"
                    help="Unicode range for subset fonts (e.g., U+0020-007F)"
                    optional
                  />
                  <Input
                    id={`unicodeRange-${font.id}`}
                    value={font.unicodeRange || ""}
                    onChange={(e) =>
                      updateFont(font.id, {
                        unicodeRange: e.target.value || undefined,
                      })
                    }
                    placeholder="U+0020-007F"
                  />
                </div>
              </div>
            </div>
          ))}

          <Button variant="outline" onClick={addFont} className="w-full">
            <PlusIcon className="size-4 mr-2" />
            Add Font
          </Button>
        </div>
      )}

      <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground space-y-2">
        <p className="font-medium text-foreground">Best Practices</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            Use <strong>font-display: swap</strong> for most web fonts
          </li>
          <li>
            Preload critical fonts (above-the-fold) with &lt;link rel="preload"&gt;
          </li>
          <li>
            Use <strong>crossorigin="anonymous"</strong> for preloaded fonts from CDNs
          </li>
          <li>
            Prefer WOFF2 format for best compression and browser support
          </li>
          <li>
            Limit the number of font weights/styles to improve performance
          </li>
        </ul>
      </div>
    </div>
  );
}

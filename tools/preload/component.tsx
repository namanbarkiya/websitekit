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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ToolProps } from "@/lib/utils/tool-registry";

import { generatePreloadOutput } from "./lib/generator";
import {
  DEFAULT_STATE,
  type PreloadState,
  type ResourceHint,
  type ResourceHintType,
  type AsType,
  type CrossOrigin,
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

export function PreloadComponent({
  assets,
  state,
  setState,
  onGenerate,
  setHeaderGenerate,
}: ToolProps) {
  const currentState = useMemo(
    () => ({ ...DEFAULT_STATE, ...(state as Partial<PreloadState>) }),
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
    const output = generatePreloadOutput(currentState);
    onGenerate(output);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewKey]);

  const handleGenerate = useCallback(() => {
    const output = generatePreloadOutput(currentStateRef.current);
    onGenerate(output);
  }, [onGenerate]);

  // Register header generate button
  useEffect(() => {
    if (!setHeaderGenerate) return;
    setHeaderGenerate({ onGenerate: handleGenerate, label: "Generate" });
    return () => setHeaderGenerate(null);
  }, [handleGenerate, setHeaderGenerate]);

  const addHint = () => {
    const newHint: ResourceHint = {
      id: `hint-${Date.now()}`,
      type: "preload",
      href: "",
    };
    setState({
      hints: [...currentState.hints, newHint],
    });
  };

  const removeHint = (id: string) => {
    setState({
      hints: currentState.hints.filter((h) => h.id !== id),
    });
  };

  const updateHint = (id: string, updates: Partial<ResourceHint>) => {
    setState({
      hints: currentState.hints.map((h) =>
        h.id === id ? { ...h, ...updates } : h
      ),
    });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground space-y-2">
        <p className="font-medium text-foreground">Resource Hints</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>preload</strong>: Fetch resources early (fonts, CSS, JS)
          </li>
          <li>
            <strong>preconnect</strong>: Establish early connections to origins
          </li>
          <li>
            <strong>prefetch</strong>: Fetch resources for next navigation
          </li>
          <li>
            <strong>dns-prefetch</strong>: Resolve DNS early (lightweight)
          </li>
        </ul>
      </div>

      {currentState.hints.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            No resource hints added yet
          </p>
          <Button variant="outline" onClick={addHint}>
            <PlusIcon className="size-4 mr-2" />
            Add Resource Hint
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {currentState.hints.map((hint, index) => (
            <div key={hint.id} className="rounded-lg border p-4 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Hint {index + 1}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeHint(hint.id)}
                >
                  <TrashIcon className="size-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <FieldLabel
                    htmlFor={`type-${hint.id}`}
                    label="Type"
                    help="Type of resource hint"
                  />
                  <Select
                    value={hint.type}
                    onValueChange={(value: ResourceHintType) =>
                      updateHint(hint.id, { type: value })
                    }
                  >
                    <SelectTrigger id={`type-${hint.id}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="preload">preload</SelectItem>
                      <SelectItem value="preconnect">preconnect</SelectItem>
                      <SelectItem value="prefetch">prefetch</SelectItem>
                      <SelectItem value="dns-prefetch">dns-prefetch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <FieldLabel
                    htmlFor={`href-${hint.id}`}
                    label="URL"
                    help="The URL of the resource or origin"
                  />
                  <Input
                    id={`href-${hint.id}`}
                    value={hint.href}
                    onChange={(e) =>
                      updateHint(hint.id, { href: e.target.value })
                    }
                    placeholder="https://fonts.googleapis.com"
                  />
                </div>
              </div>

              {hint.type === "preload" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <FieldLabel
                        htmlFor={`as-${hint.id}`}
                        label="As"
                        help="Resource type (required for preload)"
                      />
                      <Select
                        value={hint.as}
                        onValueChange={(value: AsType) =>
                          updateHint(hint.id, { as: value })
                        }
                      >
                        <SelectTrigger id={`as-${hint.id}`}>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="script">script</SelectItem>
                          <SelectItem value="style">style</SelectItem>
                          <SelectItem value="image">image</SelectItem>
                          <SelectItem value="font">font</SelectItem>
                          <SelectItem value="audio">audio</SelectItem>
                          <SelectItem value="video">video</SelectItem>
                          <SelectItem value="document">document</SelectItem>
                          <SelectItem value="embed">embed</SelectItem>
                          <SelectItem value="fetch">fetch</SelectItem>
                          <SelectItem value="object">object</SelectItem>
                          <SelectItem value="track">track</SelectItem>
                          <SelectItem value="worker">worker</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <FieldLabel
                        htmlFor={`crossorigin-${hint.id}`}
                        label="Crossorigin"
                        help="CORS setting for cross-origin resources"
                        optional
                      />
                      <Select
                        value={hint.crossorigin}
                        onValueChange={(value: CrossOrigin) =>
                          updateHint(hint.id, { crossorigin: value })
                        }
                      >
                        <SelectTrigger id={`crossorigin-${hint.id}`}>
                          <SelectValue placeholder="None (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="anonymous">anonymous</SelectItem>
                          <SelectItem value="use-credentials">
                            use-credentials
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <FieldLabel
                        htmlFor={`typeAttr-${hint.id}`}
                        label="Type"
                        help="MIME type (e.g., text/css, application/javascript)"
                        optional
                      />
                      <Input
                        id={`typeAttr-${hint.id}`}
                        value={hint.typeAttr || ""}
                        onChange={(e) =>
                          updateHint(hint.id, {
                            typeAttr: e.target.value || undefined,
                          })
                        }
                        placeholder="text/css"
                      />
                    </div>

                    <div className="space-y-2">
                      <FieldLabel
                        htmlFor={`media-${hint.id}`}
                        label="Media"
                        help="Media query (e.g., (max-width: 600px))"
                        optional
                      />
                      <Input
                        id={`media-${hint.id}`}
                        value={hint.media || ""}
                        onChange={(e) =>
                          updateHint(hint.id, {
                            media: e.target.value || undefined,
                          })
                        }
                        placeholder="(max-width: 600px)"
                      />
                    </div>
                  </div>
                </>
              )}

              {(hint.type === "preconnect" || hint.type === "prefetch") && (
                <div className="space-y-2">
                  <FieldLabel
                    htmlFor={`crossorigin-${hint.id}`}
                    label="Crossorigin"
                    help="CORS setting for cross-origin connections"
                    optional
                  />
                  <Select
                    value={hint.crossorigin}
                    onValueChange={(value: CrossOrigin) =>
                      updateHint(hint.id, { crossorigin: value })
                    }
                  >
                    <SelectTrigger id={`crossorigin-${hint.id}`}>
                      <SelectValue placeholder="None (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="anonymous">anonymous</SelectItem>
                      <SelectItem value="use-credentials">
                        use-credentials
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          ))}

          <Button variant="outline" onClick={addHint} className="w-full">
            <PlusIcon className="size-4 mr-2" />
            Add Resource Hint
          </Button>
        </div>
      )}

      <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground space-y-2">
        <p className="font-medium text-foreground">Best Practices</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            Use <strong>preload</strong> for critical resources (fonts, above-the-fold CSS)
          </li>
          <li>
            Use <strong>preconnect</strong> for third-party origins (fonts, APIs, CDNs)
          </li>
          <li>
            Use <strong>prefetch</strong> for likely next-page resources
          </li>
          <li>
            Use <strong>dns-prefetch</strong> as a lightweight alternative to preconnect
          </li>
          <li>Don't overuse—only hint resources you actually need</li>
        </ul>
      </div>
    </div>
  );
}

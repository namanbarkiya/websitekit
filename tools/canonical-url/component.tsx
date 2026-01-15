"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { InfoIcon } from "lucide-react";

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

import { generateCanonicalOutput } from "./lib/generator";
import {
  DEFAULT_STATE,
  type CanonicalUrlState,
  type ProtocolPreference,
  type TrailingSlashPreference,
  type WwwPreference,
} from "./types";

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

export function CanonicalUrlComponent({
  assets,
  state,
  setState,
  onGenerate,
  setHeaderGenerate,
}: ToolProps) {
  const currentState = useMemo(
    () => ({ ...DEFAULT_STATE, ...(state as Partial<CanonicalUrlState>) }),
    [state]
  );

  // Initialize from assets
  useEffect(() => {
    if (!currentState.pageUrl && assets.domain) {
      const domain = assets.domain.trim();
      if (domain) {
        const url = domain.startsWith("http") ? domain : `https://${domain}`;
        setState({ pageUrl: url });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assets.domain, setState]);

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
    const output = generateCanonicalOutput(currentState);
    onGenerate(output);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewKey]);

  const handleGenerate = useCallback(() => {
    const output = generateCanonicalOutput(currentStateRef.current);
    onGenerate(output);
  }, [onGenerate]);

  // Register header generate button
  useEffect(() => {
    if (!setHeaderGenerate) return;
    setHeaderGenerate({ onGenerate: handleGenerate, label: "Generate" });
    return () => setHeaderGenerate(null);
  }, [handleGenerate, setHeaderGenerate]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <FieldLabel
          htmlFor="pageUrl"
          label="Page URL"
          help="Enter the full URL of the page you want to create a canonical tag for."
        />
        <Input
          id="pageUrl"
          value={currentState.pageUrl}
          onChange={(e) => setState({ pageUrl: e.target.value })}
          placeholder="https://example.com/blog/my-post"
        />
        <p className="text-xs text-muted-foreground">
          The URL that should be the canonical (preferred) version of this page.
        </p>
      </div>

      <div className="rounded-lg border p-4 space-y-4">
        <p className="text-sm font-medium">URL Normalization</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <FieldLabel
              htmlFor="protocol"
              label="Protocol"
              help="Force HTTPS (recommended), HTTP, or keep the original protocol."
            />
            <Select
              value={currentState.protocol}
              onValueChange={(value: ProtocolPreference) =>
                setState({ protocol: value })
              }
            >
              <SelectTrigger id="protocol">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="https">Force HTTPS</SelectItem>
                <SelectItem value="http">Force HTTP</SelectItem>
                <SelectItem value="keep">Keep original</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <FieldLabel
              htmlFor="www"
              label="WWW Prefix"
              help="Force www, remove www, or keep whatever is in the URL."
            />
            <Select
              value={currentState.www}
              onValueChange={(value: WwwPreference) => setState({ www: value })}
            >
              <SelectTrigger id="www">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="www">Add www</SelectItem>
                <SelectItem value="no-www">Remove www</SelectItem>
                <SelectItem value="keep">Keep original</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <FieldLabel
              htmlFor="trailingSlash"
              label="Trailing Slash"
              help="Add a trailing slash, remove it, or keep the original. Pick one format and be consistent."
            />
            <Select
              value={currentState.trailingSlash}
              onValueChange={(value: TrailingSlashPreference) =>
                setState({ trailingSlash: value })
              }
            >
              <SelectTrigger id="trailingSlash">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="add">Add slash</SelectItem>
                <SelectItem value="remove">Remove slash</SelectItem>
                <SelectItem value="keep">Keep original</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="rounded-lg border p-4 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">Strip query parameters</p>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-sm text-muted-foreground hover:text-foreground"
                    aria-label="Help: Strip query parameters"
                  >
                    <InfoIcon className="size-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={6}>
                  Remove tracking parameters (utm_source, etc.) from the
                  canonical URL. Recommended to avoid duplicate content.
                </TooltipContent>
              </Tooltip>
            </div>
            <p className="text-xs text-muted-foreground">
              Remove ?utm_source, ?ref, and other tracking parameters.
            </p>
          </div>
          <Switch
            checked={currentState.stripParams}
            onCheckedChange={(checked) => setState({ stripParams: checked })}
            aria-label="Strip query parameters"
          />
        </div>

        {currentState.stripParams && (
          <div className="space-y-2">
            <FieldLabel
              htmlFor="keepParams"
              label="Parameters to keep (optional)"
              help="Comma-separated list of parameters to preserve. Leave empty to strip all."
            />
            <Input
              id="keepParams"
              value={currentState.keepParams}
              onChange={(e) => setState({ keepParams: e.target.value })}
              placeholder="page, sort, category"
            />
            <p className="text-xs text-muted-foreground">
              Example: keep <code>page</code> for pagination but strip tracking
              params.
            </p>
          </div>
        )}
      </div>

      <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground space-y-2">
        <p className="font-medium text-foreground">Best practices</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Use absolute URLs (full https://domain/path)</li>
          <li>Each page should have exactly one canonical tag</li>
          <li>
            Self-referencing canonicals are fine and recommended
          </li>
          <li>
            Make sure the canonical URL returns 200 (not redirect or error)
          </li>
        </ul>
      </div>
    </div>
  );
}

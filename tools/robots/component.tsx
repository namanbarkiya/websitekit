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
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ToolProps } from "@/lib/utils/tool-registry";

import { generateRobotsOutput } from "./lib/generator";
import {
  DEFAULT_STATE,
  type RobotsExperienceLevel,
  type RobotsPolicy,
  type RobotsState,
} from "./types";

function normalizeDomainToOrigin(domain: string): string {
  const raw = domain.trim();
  if (!raw) return "";
  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    try {
      return new URL(raw).origin;
    } catch {
      return raw;
    }
  }
  return `https://${raw.replace(/\/+$/, "")}`;
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

export function RobotsComponent({
  assets,
  state,
  setState,
  onGenerate,
  setHeaderGenerate,
}: ToolProps) {
  const currentState = useMemo(
    () => ({ ...DEFAULT_STATE, ...(state as Partial<RobotsState>) }),
    [state]
  );

  const assetsKey = useMemo(() => `${assets.domain}`, [assets.domain]);

  // Initialize from assets
  useEffect(() => {
    const updates: Partial<RobotsState> = {};
    if (!currentState.sitemapUrl && assets.domain) {
      const origin = normalizeDomainToOrigin(assets.domain);
      if (origin) updates.sitemapUrl = `${origin}/sitemap.xml`;
    }
    if (Object.keys(updates).length > 0) setState(updates);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetsKey, setState]);

  const currentStateRef = useRef(currentState);
  useEffect(() => {
    currentStateRef.current = currentState;
  }, [currentState]);

  const previewKey = useMemo(
    () =>
      JSON.stringify({
        policy: currentState.policy,
        allow: currentState.allow,
        disallow: currentState.disallow,
        includeSitemap: currentState.includeSitemap,
        sitemapUrl: currentState.sitemapUrl,
        domain: assets.domain,
      }),
    [
      currentState.policy,
      currentState.allow,
      currentState.disallow,
      currentState.includeSitemap,
      currentState.sitemapUrl,
      assets.domain,
    ]
  );

  // Real-time output generation
  useEffect(() => {
    const output = generateRobotsOutput(currentState, assets.domain);
    onGenerate(output);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewKey]);

  const handleGenerate = useCallback(() => {
    const output = generateRobotsOutput(currentStateRef.current, assets.domain);
    onGenerate(output);
  }, [assets.domain, onGenerate]);

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
          htmlFor="experienceLevel"
          label="Experience"
          help="Beginner gives guided choices. Advanced shows raw Allow/Disallow rules."
        />
        <Select
          value={currentState.experienceLevel}
          onValueChange={(value: RobotsExperienceLevel) =>
            setState({ experienceLevel: value })
          }
        >
          <SelectTrigger id="experienceLevel">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="beginner">Beginner (guided)</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <FieldLabel
          htmlFor="policy"
          label={
            currentState.experienceLevel === "beginner"
              ? "What should bots do?"
              : "Policy"
          }
          help={
            currentState.experienceLevel === "beginner"
              ? "Most public websites should allow crawling. Use block-all for staging/private sites. Use custom if you need to block specific paths (like /admin)."
              : "Choose a template: allow all, block all, or write custom rules."
          }
        />
        <Select
          value={currentState.policy}
          onValueChange={(value: RobotsPolicy) => setState({ policy: value })}
        >
          <SelectTrigger id="policy">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="allow-all">
              {currentState.experienceLevel === "beginner"
                ? "Allow crawling (public site)"
                : "Allow all (recommended)"}
            </SelectItem>
            <SelectItem value="block-all">
              {currentState.experienceLevel === "beginner"
                ? "Block crawling (staging/private)"
                : "Block all (private sites)"}
            </SelectItem>
            <SelectItem value="custom">
              {currentState.experienceLevel === "beginner"
                ? "Custom (I want to block specific paths)"
                : "Custom rules"}
            </SelectItem>
          </SelectContent>
        </Select>
        {currentState.experienceLevel === "beginner" ? (
          <p className="text-xs text-muted-foreground">
            Note: robots.txt is guidance for crawlers, not access control. Don’t
            rely on it to protect private content.
          </p>
        ) : null}
      </div>

      {currentState.policy === "custom" ? (
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <FieldLabel
              htmlFor="allow"
              label="Allow paths (one per line)"
              help="Optional. Use Allow to explicitly permit paths. Most sites can leave this empty unless you’re disallowing broad paths and want exceptions."
            />
            <Textarea
              id="allow"
              value={currentState.allow}
              onChange={(e) => setState({ allow: e.target.value })}
              placeholder={"/\n/blog\n/assets"}
            />
            <p className="text-xs text-muted-foreground">
              Tip: paths should start with <code>/</code> (we’ll add it if you
              omit it).
            </p>
          </div>
          <div className="space-y-2">
            <FieldLabel
              htmlFor="disallow"
              label="Disallow paths (one per line)"
              help="Add paths you don’t want crawled (e.g. /admin, /login, /private). Use one path per line."
            />
            <Textarea
              id="disallow"
              value={currentState.disallow}
              onChange={(e) => setState({ disallow: e.target.value })}
              placeholder={"/admin\n/private\n/api"}
            />
            {currentState.experienceLevel === "beginner" ? (
              <p className="text-xs text-muted-foreground">
                Best practice: don’t disallow important public pages you want
                indexed. For sensitive pages, use authentication.
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="rounded-lg border p-4 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">Include sitemap</p>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-sm text-muted-foreground hover:text-foreground"
                    aria-label="Help: Include sitemap"
                  >
                    <InfoIcon className="size-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={6}>
                  Adding a Sitemap line helps crawlers find all your URLs faster.
                  Recommended for most sites.
                </TooltipContent>
              </Tooltip>
            </div>
            <p className="text-xs text-muted-foreground">
              Adds a <code>Sitemap:</code> line to help crawlers discover URLs.
            </p>
          </div>
          <Switch
            checked={currentState.includeSitemap}
            onCheckedChange={(checked) => setState({ includeSitemap: checked })}
            aria-label="Include sitemap"
          />
        </div>
        {currentState.includeSitemap ? (
          <div className="space-y-2">
            <FieldLabel
              htmlFor="sitemapUrl"
              label="Sitemap URL"
              help="Use your full sitemap URL (usually https://your-domain.com/sitemap.xml). We auto-fill it from your saved domain when possible."
            />
            <Input
              id="sitemapUrl"
              value={currentState.sitemapUrl}
              onChange={(e) => setState({ sitemapUrl: e.target.value })}
              placeholder="https://example.com/sitemap.xml"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}


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

import { generateSitemapOutput } from "./lib/generator";
import {
  DEFAULT_STATE,
  type SitemapChangeFreq,
  type SitemapLastmodMode,
  type SitemapState,
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

export function SitemapComponent({
  assets,
  state,
  setState,
  onGenerate,
  setHeaderGenerate,
}: ToolProps) {
  const currentState = useMemo(
    () => ({ ...DEFAULT_STATE, ...(state as Partial<SitemapState>) }),
    [state]
  );

  const assetsKey = useMemo(() => `${assets.domain}`, [assets.domain]);

  // Initialize from assets
  useEffect(() => {
    const updates: Partial<SitemapState> = {};
    if (!currentState.baseUrl && assets.domain) {
      const origin = normalizeDomainToOrigin(assets.domain);
      if (origin) updates.baseUrl = origin;
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
        baseUrl: currentState.baseUrl,
        urls: currentState.urls,
        sortAndDedupe: currentState.sortAndDedupe,
        stripQueryAndHash: currentState.stripQueryAndHash,
        includeTrailingSlash: currentState.includeTrailingSlash,
        includeLastmod: currentState.includeLastmod,
        lastmodMode: currentState.lastmodMode,
        includeChangefreq: currentState.includeChangefreq,
        changefreq: currentState.changefreq,
        includePriority: currentState.includePriority,
        priority: currentState.priority,
        includeHtmlSitemap: currentState.includeHtmlSitemap,
        domain: assets.domain,
      }),
    [
      currentState.baseUrl,
      currentState.urls,
      currentState.sortAndDedupe,
      currentState.stripQueryAndHash,
      currentState.includeTrailingSlash,
      currentState.includeLastmod,
      currentState.lastmodMode,
      currentState.includeChangefreq,
      currentState.changefreq,
      currentState.includePriority,
      currentState.priority,
      currentState.includeHtmlSitemap,
      assets.domain,
    ]
  );

  // Real-time output generation
  useEffect(() => {
    const output = generateSitemapOutput(currentState, assets.domain);
    onGenerate(output);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewKey]);

  const handleGenerate = useCallback(() => {
    const output = generateSitemapOutput(currentStateRef.current, assets.domain);
    onGenerate(output);
  }, [assets.domain, onGenerate]);

  // Register header generate button
  useEffect(() => {
    if (!setHeaderGenerate) return;
    const disabled =
      !currentState.urls.trim() ||
      (!currentState.baseUrl.trim() && !assets.domain?.trim());
    setHeaderGenerate({ onGenerate: handleGenerate, label: "Generate", disabled });
    return () => setHeaderGenerate(null);
  }, [assets.domain, currentState.baseUrl, currentState.urls, handleGenerate, setHeaderGenerate]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <FieldLabel
          htmlFor="baseUrl"
          label="Base URL"
          help="Used to convert relative paths (like /pricing) into full URLs. If you paste full URLs below, base URL can be empty."
        />
        <Input
          id="baseUrl"
          value={currentState.baseUrl}
          onChange={(e) => setState({ baseUrl: e.target.value })}
          placeholder="https://example.com"
        />
        <p className="text-xs text-muted-foreground">
          Used to convert relative paths (like <code>/pricing</code>) into full
          URLs.
        </p>
      </div>

      <div className="space-y-2">
        <FieldLabel
          htmlFor="urls"
          label="URLs (one per line)"
          help="Paste paths (/about) or full URLs (https://example.com/about). Lines starting with # are ignored."
        />
        <Textarea
          id="urls"
          value={currentState.urls}
          onChange={(e) => setState({ urls: e.target.value })}
          placeholder={"/\n/pricing\n/blog\nhttps://example.com/contact"}
        />
        <p className="text-xs text-muted-foreground">
          Tip: you can paste paths (<code>/about</code>) or full URLs. Lines
          starting with <code>#</code> are ignored.
        </p>
      </div>

      <div className="rounded-lg border p-4 space-y-4">
        <p className="text-sm font-semibold">Normalization</p>

        <div className="flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <p className="text-sm font-medium">Sort & dedupe</p>
            <p className="text-xs text-muted-foreground">
              Removes duplicates and sorts URLs for stable output.
            </p>
          </div>
          <Switch
            checked={currentState.sortAndDedupe}
            onCheckedChange={(checked) => setState({ sortAndDedupe: checked })}
            aria-label="Sort and dedupe"
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <p className="text-sm font-medium">Strip query & hash</p>
            <p className="text-xs text-muted-foreground">
              Removes <code>?utm_*</code> and <code>#sections</code> so you keep
              canonical URLs.
            </p>
          </div>
          <Switch
            checked={currentState.stripQueryAndHash}
            onCheckedChange={(checked) => setState({ stripQueryAndHash: checked })}
            aria-label="Strip query and hash"
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <p className="text-sm font-medium">Include trailing slash</p>
            <p className="text-xs text-muted-foreground">
              Converts <code>/about</code> ↔ <code>/about/</code>.
            </p>
          </div>
          <Switch
            checked={currentState.includeTrailingSlash}
            onCheckedChange={(checked) => setState({ includeTrailingSlash: checked })}
            aria-label="Include trailing slash"
          />
        </div>
      </div>

      <div className="rounded-lg border p-4 space-y-4">
        <p className="text-sm font-semibold">Optional sitemap fields</p>

        <div className="flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <p className="text-sm font-medium">lastmod</p>
            <p className="text-xs text-muted-foreground">
              Recommended when it’s accurate.
            </p>
          </div>
          <Switch
            checked={currentState.includeLastmod}
            onCheckedChange={(checked) => setState({ includeLastmod: checked })}
            aria-label="Include lastmod"
          />
        </div>

        {currentState.includeLastmod ? (
          <div className="space-y-2">
            <FieldLabel
              htmlFor="lastmodMode"
              label="lastmod mode"
              help="If you don’t have accurate per-page last modified dates, it’s better to omit lastmod than to guess."
            />
            <Select
              value={currentState.lastmodMode}
              onValueChange={(value: SitemapLastmodMode) =>
                setState({ lastmodMode: value })
              }
            >
              <SelectTrigger id="lastmodMode">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Don’t include a value</SelectItem>
                <SelectItem value="today">Use today’s date</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              If you don’t have accurate per-page dates, it’s better to omit
              <code>&lt;lastmod&gt;</code> than to guess.
            </p>
          </div>
        ) : null}

        <div className="flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <p className="text-sm font-medium">changefreq</p>
            <p className="text-xs text-muted-foreground">
              Some crawlers may use it; Google typically ignores it.
            </p>
          </div>
          <Switch
            checked={currentState.includeChangefreq}
            onCheckedChange={(checked) =>
              setState({ includeChangefreq: checked })
            }
            aria-label="Include changefreq"
          />
        </div>

        {currentState.includeChangefreq ? (
          <div className="space-y-2">
            <FieldLabel
              htmlFor="changefreq"
              label="changefreq"
              help="A hint about how often this content changes. Many crawlers ignore it; keep it off unless you have a reason."
            />
            <Select
              value={currentState.changefreq}
              onValueChange={(value: SitemapChangeFreq) =>
                setState({ changefreq: value })
              }
            >
              <SelectTrigger id="changefreq">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="always">always</SelectItem>
                <SelectItem value="hourly">hourly</SelectItem>
                <SelectItem value="daily">daily</SelectItem>
                <SelectItem value="weekly">weekly</SelectItem>
                <SelectItem value="monthly">monthly</SelectItem>
                <SelectItem value="yearly">yearly</SelectItem>
                <SelectItem value="never">never</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ) : null}

        <div className="flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <p className="text-sm font-medium">priority</p>
            <p className="text-xs text-muted-foreground">
              Mostly ignored by Google; include only if you need it.
            </p>
          </div>
          <Switch
            checked={currentState.includePriority}
            onCheckedChange={(checked) => setState({ includePriority: checked })}
            aria-label="Include priority"
          />
        </div>

        {currentState.includePriority ? (
          <div className="space-y-2">
            <FieldLabel
              htmlFor="priority"
              label="priority (0.0 to 1.0)"
              help="A hint about relative importance. Google typically ignores it; keep it off unless needed."
            />
            <Input
              id="priority"
              type="number"
              min="0"
              max="1"
              step="0.1"
              value={currentState.priority}
              onChange={(e) =>
                setState({
                  priority: Number.isFinite(parseFloat(e.target.value))
                    ? parseFloat(e.target.value)
                    : 0.7,
                })
              }
            />
          </div>
        ) : null}
      </div>

      <div className="rounded-lg border p-4 space-y-4">
        <p className="text-sm font-semibold">Extra output</p>

        <div className="flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <p className="text-sm font-medium">HTML sitemap</p>
            <p className="text-xs text-muted-foreground">
              Also generates a simple <code>sitemap.html</code> file.
            </p>
          </div>
          <Switch
            checked={currentState.includeHtmlSitemap}
            onCheckedChange={(checked) =>
              setState({ includeHtmlSitemap: checked })
            }
            aria-label="Include HTML sitemap"
          />
        </div>
          </div>
    </div>
  );
}

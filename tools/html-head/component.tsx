"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronDownIcon, ChevronRightIcon, InfoIcon, ExternalLinkIcon } from "lucide-react";
import Link from "next/link";

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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import type { ToolProps } from "@/lib/utils/tool-registry";

import { generateHtmlHeadOutput } from "./lib/generator";
import { DEFAULT_STATE, type HtmlHeadState } from "./types";

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

function SectionHeader({
  title,
  open,
  onToggle,
  enabled,
  onEnabledChange,
  toolLink,
  toolName,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  toolLink?: string;
  toolName?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <CollapsibleTrigger
        onClick={onToggle}
        className="flex items-center gap-2 hover:text-foreground flex-1"
      >
        {open ? (
          <ChevronDownIcon className="size-4" />
        ) : (
          <ChevronRightIcon className="size-4" />
        )}
        <span className="font-medium">{title}</span>
      </CollapsibleTrigger>
      <div className="flex items-center gap-2">
        {toolLink && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                asChild
              >
                <Link href={toolLink} target="_blank" rel="noopener noreferrer">
                  <ExternalLinkIcon className="size-3 mr-1" />
                  Generate
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={6}>
              Generate {toolName || title.toLowerCase()} with our dedicated tool
            </TooltipContent>
          </Tooltip>
        )}
        <Switch checked={enabled} onCheckedChange={onEnabledChange} />
      </div>
    </div>
  );
}

export function HtmlHeadComponent({
  assets,
  state,
  setState,
  onGenerate,
  setHeaderGenerate,
}: ToolProps) {
  const [basicOpen, setBasicOpen] = useState(true);
  const [metaOpen, setMetaOpen] = useState(true);
  const [ogOpen, setOgOpen] = useState(false);
  const [twitterOpen, setTwitterOpen] = useState(false);
  const [faviconOpen, setFaviconOpen] = useState(false);
  const [canonicalOpen, setCanonicalOpen] = useState(false);
  const [jsonLdOpen, setJsonLdOpen] = useState(false);
  const [securityOpen, setSecurityOpen] = useState(false);
  const [pwaOpen, setPwaOpen] = useState(false);
  const [otherOpen, setOtherOpen] = useState(false);

  const currentState = useMemo(
    () => ({ ...DEFAULT_STATE, ...(state as Partial<HtmlHeadState>) }),
    [state]
  );

  // Initialize from assets
  useEffect(() => {
    const updates: Partial<HtmlHeadState> = {};
    if (!currentState.title && assets.name) {
      updates.title = assets.name;
    }
    if (!currentState.description && assets.description) {
      updates.description = assets.description;
    }
    if (!currentState.ogTitle && assets.name) {
      updates.ogTitle = assets.name;
    }
    if (!currentState.ogDescription && assets.description) {
      updates.ogDescription = assets.description;
    }
    if (!currentState.ogSiteName && assets.name) {
      updates.ogSiteName = assets.name;
    }
    if (!currentState.twitterTitle && assets.name) {
      updates.twitterTitle = assets.name;
    }
    if (!currentState.twitterDescription && assets.description) {
      updates.twitterDescription = assets.description;
    }
    if (!currentState.ogImage && assets.logo) {
      updates.ogImage = assets.logo;
    }
    if (!currentState.twitterImage && assets.logo) {
      updates.twitterImage = assets.logo;
    }
    if (!currentState.canonicalUrl && assets.domain) {
      const url = assets.domain.startsWith("http")
        ? assets.domain
        : `https://${assets.domain}`;
      updates.canonicalUrl = url;
    }
    if (!currentState.ogUrl && assets.domain) {
      const url = assets.domain.startsWith("http")
        ? assets.domain
        : `https://${assets.domain}`;
      updates.ogUrl = url;
    }
    if (!currentState.appleMobileWebAppTitle && assets.name) {
      updates.appleMobileWebAppTitle = assets.name;
    }

    if (Object.keys(updates).length > 0) {
      setState(updates);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assets.name, assets.domain, assets.description, assets.logo, setState]);

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
    const output = generateHtmlHeadOutput(currentState);
    onGenerate(output);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewKey]);

  const handleGenerate = useCallback(() => {
    const output = generateHtmlHeadOutput(currentStateRef.current);
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
      {/* Basic HTML */}
      <Collapsible open={basicOpen} onOpenChange={setBasicOpen}>
        <div className="rounded-lg border p-4 space-y-4">
          <SectionHeader
            title="Basic HTML"
            open={basicOpen}
            onToggle={() => setBasicOpen(!basicOpen)}
            enabled={true}
            onEnabledChange={() => {}}
          />
          <CollapsibleContent className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <FieldLabel
                  htmlFor="charset"
                  label="Charset"
                  help="Character encoding for the document"
                />
                <Input
                  id="charset"
                  value={currentState.charset}
                  onChange={(e) => setState({ charset: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <FieldLabel
                  htmlFor="viewport"
                  label="Viewport"
                  help="Viewport meta tag for responsive design"
                />
                <Input
                  id="viewport"
                  value={currentState.viewport}
                  onChange={(e) => setState({ viewport: e.target.value })}
                />
              </div>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>

      {/* Meta Tags */}
      <Collapsible open={metaOpen} onOpenChange={setMetaOpen}>
        <div className="rounded-lg border p-4 space-y-4">
          <SectionHeader
            title="Meta Tags"
            open={metaOpen}
            onToggle={() => setMetaOpen(!metaOpen)}
            enabled={currentState.includeMetaTags}
            onEnabledChange={(enabled) =>
              setState({ includeMetaTags: enabled })
            }
            toolLink="/tools/meta-tags"
            toolName="meta tags"
          />
          <CollapsibleContent className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <FieldLabel
                  htmlFor="title"
                  label="Title"
                  help="Page title (shown in browser tab and search results)"
                />
                <Input
                  id="title"
                  value={currentState.title}
                  onChange={(e) => setState({ title: e.target.value })}
                  placeholder="My Website"
                />
              </div>
              <div className="space-y-2">
                <FieldLabel
                  htmlFor="description"
                  label="Description"
                  help="Meta description for search engines"
                />
                <Textarea
                  id="description"
                  value={currentState.description}
                  onChange={(e) => setState({ description: e.target.value })}
                  placeholder="A brief description of your website"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <FieldLabel
                    htmlFor="keywords"
                    label="Keywords"
                    help="Comma-separated keywords"
                    optional
                  />
                  <Input
                    id="keywords"
                    value={currentState.keywords}
                    onChange={(e) => setState({ keywords: e.target.value })}
                    placeholder="keyword1, keyword2"
                  />
                </div>
                <div className="space-y-2">
                  <FieldLabel
                    htmlFor="author"
                    label="Author"
                    help="Page author name"
                    optional
                  />
                  <Input
                    id="author"
                    value={currentState.author}
                    onChange={(e) => setState({ author: e.target.value })}
                    placeholder="Author Name"
                  />
                </div>
                <div className="space-y-2">
                  <FieldLabel
                    htmlFor="robots"
                    label="Robots"
                    help="Robots meta tag directive"
                  />
                  <Input
                    id="robots"
                    value={currentState.robots}
                    onChange={(e) => setState({ robots: e.target.value })}
                    placeholder="index, follow"
                  />
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>

      {/* Open Graph */}
      <Collapsible open={ogOpen} onOpenChange={setOgOpen}>
        <div className="rounded-lg border p-4 space-y-4">
          <SectionHeader
            title="Open Graph"
            open={ogOpen}
            onToggle={() => setOgOpen(!ogOpen)}
            enabled={currentState.includeOpenGraph}
            onEnabledChange={(enabled) =>
              setState({ includeOpenGraph: enabled })
            }
            toolLink="/tools/meta-tags"
            toolName="Open Graph tags"
          />
          <CollapsibleContent className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <FieldLabel
                    htmlFor="ogTitle"
                    label="OG Title"
                    help="Open Graph title"
                  />
                  <Input
                    id="ogTitle"
                    value={currentState.ogTitle}
                    onChange={(e) => setState({ ogTitle: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <FieldLabel
                    htmlFor="ogType"
                    label="OG Type"
                    help="Open Graph type (website, article, etc.)"
                  />
                  <Input
                    id="ogType"
                    value={currentState.ogType}
                    onChange={(e) => setState({ ogType: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <FieldLabel
                  htmlFor="ogDescription"
                  label="OG Description"
                  help="Open Graph description"
                />
                <Textarea
                  id="ogDescription"
                  value={currentState.ogDescription}
                  onChange={(e) =>
                    setState({ ogDescription: e.target.value })
                  }
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <FieldLabel
                    htmlFor="ogImage"
                    label="OG Image"
                    help="Open Graph image URL"
                  />
                  <Input
                    id="ogImage"
                    value={currentState.ogImage}
                    onChange={(e) => setState({ ogImage: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="space-y-2">
                  <FieldLabel
                    htmlFor="ogUrl"
                    label="OG URL"
                    help="Open Graph URL"
                  />
                  <Input
                    id="ogUrl"
                    value={currentState.ogUrl}
                    onChange={(e) => setState({ ogUrl: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <FieldLabel
                  htmlFor="ogSiteName"
                  label="OG Site Name"
                  help="Open Graph site name"
                  optional
                />
                <Input
                  id="ogSiteName"
                  value={currentState.ogSiteName}
                  onChange={(e) => setState({ ogSiteName: e.target.value })}
                />
              </div>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>

      {/* Twitter Card */}
      <Collapsible open={twitterOpen} onOpenChange={setTwitterOpen}>
        <div className="rounded-lg border p-4 space-y-4">
          <SectionHeader
            title="Twitter Card"
            open={twitterOpen}
            onToggle={() => setTwitterOpen(!twitterOpen)}
            enabled={currentState.includeTwitterCard}
            onEnabledChange={(enabled) =>
              setState({ includeTwitterCard: enabled })
            }
            toolLink="/tools/meta-tags"
            toolName="Twitter cards"
          />
          <CollapsibleContent className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <FieldLabel
                  htmlFor="twitterCard"
                  label="Card Type"
                  help="Twitter card type (summary, summary_large_image)"
                />
                <Select
                  value={currentState.twitterCard}
                  onValueChange={(value) => setState({ twitterCard: value })}
                >
                  <SelectTrigger id="twitterCard">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="summary">Summary</SelectItem>
                    <SelectItem value="summary_large_image">
                      Summary Large Image
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <FieldLabel
                    htmlFor="twitterTitle"
                    label="Twitter Title"
                    help="Twitter card title"
                  />
                  <Input
                    id="twitterTitle"
                    value={currentState.twitterTitle}
                    onChange={(e) =>
                      setState({ twitterTitle: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <FieldLabel
                    htmlFor="twitterImage"
                    label="Twitter Image"
                    help="Twitter card image URL"
                  />
                  <Input
                    id="twitterImage"
                    value={currentState.twitterImage}
                    onChange={(e) =>
                      setState({ twitterImage: e.target.value })
                    }
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <FieldLabel
                  htmlFor="twitterDescription"
                  label="Twitter Description"
                  help="Twitter card description"
                />
                <Textarea
                  id="twitterDescription"
                  value={currentState.twitterDescription}
                  onChange={(e) =>
                    setState({ twitterDescription: e.target.value })
                  }
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <FieldLabel
                    htmlFor="twitterSite"
                    label="Twitter Site"
                    help="Twitter @username for the site"
                    optional
                  />
                  <Input
                    id="twitterSite"
                    value={currentState.twitterSite}
                    onChange={(e) => setState({ twitterSite: e.target.value })}
                    placeholder="@username"
                  />
                </div>
                <div className="space-y-2">
                  <FieldLabel
                    htmlFor="twitterCreator"
                    label="Twitter Creator"
                    help="Twitter @username for the creator"
                    optional
                  />
                  <Input
                    id="twitterCreator"
                    value={currentState.twitterCreator}
                    onChange={(e) =>
                      setState({ twitterCreator: e.target.value })
                    }
                    placeholder="@username"
                  />
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>

      {/* Canonical URL */}
      <Collapsible open={canonicalOpen} onOpenChange={setCanonicalOpen}>
        <div className="rounded-lg border p-4 space-y-4">
          <SectionHeader
            title="Canonical URL"
            open={canonicalOpen}
            onToggle={() => setCanonicalOpen(!canonicalOpen)}
            enabled={currentState.includeCanonical}
            onEnabledChange={(enabled) =>
              setState({ includeCanonical: enabled })
            }
            toolLink="/tools/canonical-url"
            toolName="canonical URL"
          />
          <CollapsibleContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <FieldLabel
                htmlFor="canonicalUrl"
                label="Canonical URL"
                help="The canonical (preferred) URL for this page"
              />
              <Input
                id="canonicalUrl"
                value={currentState.canonicalUrl}
                onChange={(e) => setState({ canonicalUrl: e.target.value })}
                placeholder="https://example.com/page"
              />
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>

      {/* Favicons */}
      <Collapsible open={faviconOpen} onOpenChange={setFaviconOpen}>
        <div className="rounded-lg border p-4 space-y-4">
          <SectionHeader
            title="Favicons"
            open={faviconOpen}
            onToggle={() => setFaviconOpen(!faviconOpen)}
            enabled={currentState.includeFavicons}
            onEnabledChange={(enabled) =>
              setState({ includeFavicons: enabled })
            }
            toolLink="/tools/favicon"
            toolName="favicons"
          />
          <CollapsibleContent className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <FieldLabel
                  htmlFor="faviconIco"
                  label="favicon.ico"
                  help="Path to favicon.ico"
                />
                <Input
                  id="faviconIco"
                  value={currentState.faviconIco}
                  onChange={(e) => setState({ faviconIco: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <FieldLabel
                  htmlFor="favicon16"
                  label="16x16 PNG"
                  help="Path to 16x16 favicon"
                />
                <Input
                  id="favicon16"
                  value={currentState.favicon16}
                  onChange={(e) => setState({ favicon16: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <FieldLabel
                  htmlFor="favicon32"
                  label="32x32 PNG"
                  help="Path to 32x32 favicon"
                />
                <Input
                  id="favicon32"
                  value={currentState.favicon32}
                  onChange={(e) => setState({ favicon32: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <FieldLabel
                  htmlFor="favicon96"
                  label="96x96 PNG"
                  help="Path to 96x96 favicon"
                />
                <Input
                  id="favicon96"
                  value={currentState.favicon96}
                  onChange={(e) => setState({ favicon96: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <FieldLabel
                  htmlFor="appleTouchIcon"
                  label="Apple Touch Icon"
                  help="Path to Apple touch icon (180x180)"
                />
                <Input
                  id="appleTouchIcon"
                  value={currentState.appleTouchIcon}
                  onChange={(e) =>
                    setState({ appleTouchIcon: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <FieldLabel
                  htmlFor="androidChrome192"
                  label="Android Chrome 192x192"
                  help="Path to Android Chrome icon (192x192)"
                />
                <Input
                  id="androidChrome192"
                  value={currentState.androidChrome192}
                  onChange={(e) =>
                    setState({ androidChrome192: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <FieldLabel
                  htmlFor="androidChrome512"
                  label="Android Chrome 512x512"
                  help="Path to Android Chrome icon (512x512)"
                />
                <Input
                  id="androidChrome512"
                  value={currentState.androidChrome512}
                  onChange={(e) =>
                    setState({ androidChrome512: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <FieldLabel
                  htmlFor="manifest"
                  label="Web Manifest"
                  help="Path to site.webmanifest"
                />
                <Input
                  id="manifest"
                  value={currentState.manifest}
                  onChange={(e) => setState({ manifest: e.target.value })}
                />
              </div>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>

      {/* JSON-LD Schema */}
      <Collapsible open={jsonLdOpen} onOpenChange={setJsonLdOpen}>
        <div className="rounded-lg border p-4 space-y-4">
          <SectionHeader
            title="JSON-LD Schema"
            open={jsonLdOpen}
            onToggle={() => setJsonLdOpen(!jsonLdOpen)}
            enabled={currentState.includeJsonLd}
            onEnabledChange={(enabled) =>
              setState({ includeJsonLd: enabled })
            }
            toolLink="/tools/json-ld"
            toolName="JSON-LD schema"
          />
          <CollapsibleContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <FieldLabel
                htmlFor="jsonLdSchema"
                label="JSON-LD Schema"
                help="Paste your JSON-LD schema (without script tags)"
              />
              <Textarea
                id="jsonLdSchema"
                value={currentState.jsonLdSchema}
                onChange={(e) => setState({ jsonLdSchema: e.target.value })}
                placeholder='{"@context":"https://schema.org","@type":"Organization",...}'
                rows={8}
                className="font-mono text-xs"
              />
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>

      {/* Security Headers */}
      <Collapsible open={securityOpen} onOpenChange={setSecurityOpen}>
        <div className="rounded-lg border p-4 space-y-4">
          <SectionHeader
            title="Security Headers (Meta Tags)"
            open={securityOpen}
            onToggle={() => setSecurityOpen(!securityOpen)}
            enabled={currentState.includeSecurityMeta}
            onEnabledChange={(enabled) =>
              setState({ includeSecurityMeta: enabled })
            }
            toolLink="/tools/security-headers"
            toolName="security headers"
          />
          <CollapsibleContent className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <FieldLabel
                  htmlFor="contentSecurityPolicy"
                  label="Content Security Policy"
                  help="CSP meta tag (use HTTP headers in production)"
                  optional
                />
                <Input
                  id="contentSecurityPolicy"
                  value={currentState.contentSecurityPolicy}
                  onChange={(e) =>
                    setState({ contentSecurityPolicy: e.target.value })
                  }
                  placeholder="default-src 'self'"
                />
              </div>
              <div className="space-y-2">
                <FieldLabel
                  htmlFor="referrerPolicy"
                  label="Referrer Policy"
                  help="Referrer policy meta tag"
                />
                <Select
                  value={currentState.referrerPolicy}
                  onValueChange={(value) =>
                    setState({ referrerPolicy: value })
                  }
                >
                  <SelectTrigger id="referrerPolicy">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-referrer">no-referrer</SelectItem>
                    <SelectItem value="no-referrer-when-downgrade">
                      no-referrer-when-downgrade
                    </SelectItem>
                    <SelectItem value="origin">origin</SelectItem>
                    <SelectItem value="origin-when-cross-origin">
                      origin-when-cross-origin
                    </SelectItem>
                    <SelectItem value="same-origin">same-origin</SelectItem>
                    <SelectItem value="strict-origin">
                      strict-origin
                    </SelectItem>
                    <SelectItem value="strict-origin-when-cross-origin">
                      strict-origin-when-cross-origin
                    </SelectItem>
                    <SelectItem value="unsafe-url">unsafe-url</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <FieldLabel
                  htmlFor="permissionsPolicy"
                  label="Permissions Policy"
                  help="Permissions-Policy meta tag"
                  optional
                />
                <Input
                  id="permissionsPolicy"
                  value={currentState.permissionsPolicy}
                  onChange={(e) =>
                    setState({ permissionsPolicy: e.target.value })
                  }
                  placeholder="camera=(), microphone=(), geolocation=()"
                />
              </div>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>

      {/* PWA */}
      <Collapsible open={pwaOpen} onOpenChange={setPwaOpen}>
        <div className="rounded-lg border p-4 space-y-4">
          <SectionHeader
            title="PWA (Progressive Web App)"
            open={pwaOpen}
            onToggle={() => setPwaOpen(!pwaOpen)}
            enabled={currentState.includePWA}
            onEnabledChange={(enabled) => setState({ includePWA: enabled })}
          />
          <CollapsibleContent className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <FieldLabel
                  htmlFor="themeColor"
                  label="Theme Color"
                  help="Theme color for mobile browsers"
                />
                <Input
                  id="themeColor"
                  type="color"
                  value={currentState.themeColor}
                  onChange={(e) => setState({ themeColor: e.target.value })}
                  className="h-10"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="appleMobileWebAppCapable">
                    Apple Mobile Web App Capable
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Enable full-screen mode on iOS
                  </p>
                </div>
                <Switch
                  id="appleMobileWebAppCapable"
                  checked={currentState.appleMobileWebAppCapable}
                  onCheckedChange={(checked) =>
                    setState({ appleMobileWebAppCapable: checked })
                  }
                />
              </div>
              {currentState.appleMobileWebAppCapable && (
                <>
                  <div className="space-y-2">
                    <FieldLabel
                      htmlFor="appleMobileWebAppStatusBarStyle"
                      label="Status Bar Style"
                      help="iOS status bar style"
                    />
                    <Select
                      value={currentState.appleMobileWebAppStatusBarStyle}
                      onValueChange={(value) =>
                        setState({ appleMobileWebAppStatusBarStyle: value })
                      }
                    >
                      <SelectTrigger id="appleMobileWebAppStatusBarStyle">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="black">Black</SelectItem>
                        <SelectItem value="black-translucent">
                          Black Translucent
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <FieldLabel
                      htmlFor="appleMobileWebAppTitle"
                      label="App Title"
                      help="Title shown on iOS home screen"
                    />
                    <Input
                      id="appleMobileWebAppTitle"
                      value={currentState.appleMobileWebAppTitle}
                      onChange={(e) =>
                        setState({ appleMobileWebAppTitle: e.target.value })
                      }
                    />
                  </div>
                </>
              )}
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>

      {/* Other Tags */}
      <Collapsible open={otherOpen} onOpenChange={setOtherOpen}>
        <div className="rounded-lg border p-4 space-y-4">
          <SectionHeader
            title="Other Custom Tags"
            open={otherOpen}
            onToggle={() => setOtherOpen(!otherOpen)}
            enabled={currentState.includeOther}
            onEnabledChange={(enabled) => setState({ includeOther: enabled })}
          />
          <CollapsibleContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <FieldLabel
                htmlFor="otherTags"
                label="Custom HTML"
                help="Add any custom HTML tags (one per line)"
              />
              <Textarea
                id="otherTags"
                value={currentState.otherTags}
                onChange={(e) => setState({ otherTags: e.target.value })}
                placeholder='<link rel="preconnect" href="https://fonts.googleapis.com" />'
                rows={4}
                className="font-mono text-xs"
              />
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    </div>
  );
}

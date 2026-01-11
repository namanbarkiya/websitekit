"use client";

import { ChevronDownIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import type { MetaTagsState } from "../types";

interface FormSectionsProps {
  state: MetaTagsState;
  onFieldChange: (field: keyof MetaTagsState, value: string) => void;
  basicOpen: boolean;
  onBasicOpenChange: (open: boolean) => void;
  ogOpen: boolean;
  onOgOpenChange: (open: boolean) => void;
  twitterOpen: boolean;
  onTwitterOpenChange: (open: boolean) => void;
}

export function FormSections({
  state,
  onFieldChange,
  basicOpen,
  onBasicOpenChange,
  ogOpen,
  onOgOpenChange,
  twitterOpen,
  onTwitterOpenChange,
}: FormSectionsProps) {
  return (
    <div className="space-y-4">
      {/* Basic SEO Meta Tags */}
      <Collapsible
        open={basicOpen}
        onOpenChange={onBasicOpenChange}
        className="rounded-lg border"
      >
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="flex w-full items-center justify-between px-4 py-3 text-left"
          >
            <span className="text-sm font-semibold">Basic SEO</span>
            <ChevronDownIcon
              className={[
                "size-4 text-muted-foreground transition-transform",
                basicOpen ? "rotate-180" : "",
              ].join(" ")}
            />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-4 pb-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={state.title || ""}
                onChange={(e) => onFieldChange("title", e.target.value)}
                placeholder="Page title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={state.description || ""}
                onChange={(e) => onFieldChange("description", e.target.value)}
                placeholder="Page description"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords</Label>
              <Input
                id="keywords"
                value={state.keywords || ""}
                onChange={(e) => onFieldChange("keywords", e.target.value)}
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={state.author || ""}
                onChange={(e) => onFieldChange("author", e.target.value)}
                placeholder="Author name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="canonicalUrl">Canonical URL</Label>
              <Input
                id="canonicalUrl"
                type="url"
                value={state.canonicalUrl || ""}
                onChange={(e) => onFieldChange("canonicalUrl", e.target.value)}
                placeholder="https://example.com/page"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="robots">Robots</Label>
              <Input
                id="robots"
                value={state.robots || "index, follow"}
                onChange={(e) => onFieldChange("robots", e.target.value)}
                placeholder="index, follow"
              />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Open Graph Meta Tags */}
      <Collapsible
        open={ogOpen}
        onOpenChange={onOgOpenChange}
        className="rounded-lg border"
      >
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="flex w-full items-center justify-between px-4 py-3 text-left"
          >
            <span className="text-sm font-semibold">Open Graph</span>
            <ChevronDownIcon
              className={[
                "size-4 text-muted-foreground transition-transform",
                ogOpen ? "rotate-180" : "",
              ].join(" ")}
            />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-4 pb-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ogTitle">OG:Title</Label>
              <Input
                id="ogTitle"
                value={state.ogTitle || ""}
                onChange={(e) => onFieldChange("ogTitle", e.target.value)}
                placeholder="Open Graph title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ogDescription">OG:Description</Label>
              <Textarea
                id="ogDescription"
                value={state.ogDescription || ""}
                onChange={(e) => onFieldChange("ogDescription", e.target.value)}
                placeholder="Open Graph description"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ogImage">OG:Image URL</Label>
              <Input
                id="ogImage"
                type="url"
                value={state.ogImage || ""}
                onChange={(e) => onFieldChange("ogImage", e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ogType">OG:Type</Label>
              <Input
                id="ogType"
                value={state.ogType || "website"}
                onChange={(e) => onFieldChange("ogType", e.target.value)}
                placeholder="website, article, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ogUrl">OG:URL</Label>
              <Input
                id="ogUrl"
                type="url"
                value={state.ogUrl || ""}
                onChange={(e) => onFieldChange("ogUrl", e.target.value)}
                placeholder="https://example.com/page"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ogSiteName">OG:Site Name</Label>
              <Input
                id="ogSiteName"
                value={state.ogSiteName || ""}
                onChange={(e) => onFieldChange("ogSiteName", e.target.value)}
                placeholder="Site name"
              />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Twitter Card Meta Tags */}
      <Collapsible
        open={twitterOpen}
        onOpenChange={onTwitterOpenChange}
        className="rounded-lg border"
      >
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="flex w-full items-center justify-between px-4 py-3 text-left"
          >
            <span className="text-sm font-semibold">Twitter Card</span>
            <ChevronDownIcon
              className={[
                "size-4 text-muted-foreground transition-transform",
                twitterOpen ? "rotate-180" : "",
              ].join(" ")}
            />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-4 pb-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="twitterCard">Card Type</Label>
              <Input
                id="twitterCard"
                value={state.twitterCard || "summary_large_image"}
                onChange={(e) => onFieldChange("twitterCard", e.target.value)}
                placeholder="summary_large_image or summary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitterTitle">Twitter:Title</Label>
              <Input
                id="twitterTitle"
                value={state.twitterTitle || ""}
                onChange={(e) => onFieldChange("twitterTitle", e.target.value)}
                placeholder="Twitter card title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitterDescription">Twitter:Description</Label>
              <Textarea
                id="twitterDescription"
                value={state.twitterDescription || ""}
                onChange={(e) =>
                  onFieldChange("twitterDescription", e.target.value)
                }
                placeholder="Twitter card description"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitterImage">Twitter:Image URL</Label>
              <Input
                id="twitterImage"
                type="url"
                value={state.twitterImage || ""}
                onChange={(e) => onFieldChange("twitterImage", e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitterSite">Twitter:Site</Label>
              <Input
                id="twitterSite"
                value={state.twitterSite || ""}
                onChange={(e) => onFieldChange("twitterSite", e.target.value)}
                placeholder="@username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitterCreator">Twitter:Creator</Label>
              <Input
                id="twitterCreator"
                value={state.twitterCreator || ""}
                onChange={(e) =>
                  onFieldChange("twitterCreator", e.target.value)
                }
                placeholder="@username"
              />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

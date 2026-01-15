"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ToolProps } from "@/lib/utils/tool-registry";

import { generateJsonLdOutput } from "./lib/generator";
import {
  DEFAULT_STATE,
  type JsonLdState,
  type SchemaType,
  type FAQItem,
  type BreadcrumbItem,
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

function OrganizationForm({
  state,
  setState,
}: {
  state: JsonLdState;
  setState: (updates: Partial<JsonLdState>) => void;
}) {
  const updateOrg = (updates: Partial<JsonLdState["organization"]>) => {
    setState({ organization: { ...state.organization, ...updates } });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <FieldLabel
          htmlFor="org-name"
          label="Organization Name"
          help="Your company or organization name"
        />
        <Input
          id="org-name"
          value={state.organization.name}
          onChange={(e) => updateOrg({ name: e.target.value })}
          placeholder="Acme Inc."
        />
      </div>
      <div className="space-y-2">
        <FieldLabel
          htmlFor="org-url"
          label="Website URL"
          help="Your organization's main website"
          optional
        />
        <Input
          id="org-url"
          value={state.organization.url}
          onChange={(e) => updateOrg({ url: e.target.value })}
          placeholder="https://example.com"
        />
      </div>
      <div className="space-y-2">
        <FieldLabel
          htmlFor="org-logo"
          label="Logo URL"
          help="Full URL to your organization's logo image"
          optional
        />
        <Input
          id="org-logo"
          value={state.organization.logo}
          onChange={(e) => updateOrg({ logo: e.target.value })}
          placeholder="https://example.com/logo.png"
        />
      </div>
      <div className="space-y-2">
        <FieldLabel
          htmlFor="org-description"
          label="Description"
          help="Brief description of your organization"
          optional
        />
        <Textarea
          id="org-description"
          value={state.organization.description}
          onChange={(e) => updateOrg({ description: e.target.value })}
          placeholder="A company that builds great products..."
          rows={2}
        />
      </div>
      <div className="space-y-2">
        <FieldLabel
          htmlFor="org-sameas"
          label="Social Profiles"
          help="One URL per line for your social media profiles"
          optional
        />
        <Textarea
          id="org-sameas"
          value={state.organization.sameAs}
          onChange={(e) => updateOrg({ sameAs: e.target.value })}
          placeholder={"https://twitter.com/example\nhttps://linkedin.com/company/example"}
          rows={3}
        />
      </div>
    </div>
  );
}

function WebSiteForm({
  state,
  setState,
}: {
  state: JsonLdState;
  setState: (updates: Partial<JsonLdState>) => void;
}) {
  const updateSite = (updates: Partial<JsonLdState["website"]>) => {
    setState({ website: { ...state.website, ...updates } });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <FieldLabel
          htmlFor="site-name"
          label="Site Name"
          help="The name of your website"
        />
        <Input
          id="site-name"
          value={state.website.name}
          onChange={(e) => updateSite({ name: e.target.value })}
          placeholder="My Website"
        />
      </div>
      <div className="space-y-2">
        <FieldLabel
          htmlFor="site-url"
          label="Site URL"
          help="Your website's homepage URL"
        />
        <Input
          id="site-url"
          value={state.website.url}
          onChange={(e) => updateSite({ url: e.target.value })}
          placeholder="https://example.com"
        />
      </div>
      <div className="space-y-2">
        <FieldLabel
          htmlFor="site-description"
          label="Description"
          help="Brief description of your website"
          optional
        />
        <Textarea
          id="site-description"
          value={state.website.description}
          onChange={(e) => updateSite({ description: e.target.value })}
          placeholder="A website about..."
          rows={2}
        />
      </div>
      <div className="space-y-2">
        <FieldLabel
          htmlFor="site-search"
          label="Search URL Template"
          help="URL template for site search. Use {search_term_string} as placeholder."
          optional
        />
        <Input
          id="site-search"
          value={state.website.searchUrl}
          onChange={(e) => updateSite({ searchUrl: e.target.value })}
          placeholder="https://example.com/search?q={search_term_string}"
        />
        <p className="text-xs text-muted-foreground">
          Enables sitelinks search box in Google results.
        </p>
      </div>
    </div>
  );
}

function ArticleForm({
  state,
  setState,
}: {
  state: JsonLdState;
  setState: (updates: Partial<JsonLdState>) => void;
}) {
  const updateArticle = (updates: Partial<JsonLdState["article"]>) => {
    setState({ article: { ...state.article, ...updates } });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <FieldLabel
          htmlFor="article-headline"
          label="Headline"
          help="The title of the article"
        />
        <Input
          id="article-headline"
          value={state.article.headline}
          onChange={(e) => updateArticle({ headline: e.target.value })}
          placeholder="How to Build a Website"
        />
      </div>
      <div className="space-y-2">
        <FieldLabel
          htmlFor="article-description"
          label="Description"
          help="Brief summary of the article"
          optional
        />
        <Textarea
          id="article-description"
          value={state.article.description}
          onChange={(e) => updateArticle({ description: e.target.value })}
          placeholder="A guide to building modern websites..."
          rows={2}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <FieldLabel
            htmlFor="article-url"
            label="Article URL"
            help="The canonical URL of this article"
            optional
          />
          <Input
            id="article-url"
            value={state.article.url}
            onChange={(e) => updateArticle({ url: e.target.value })}
            placeholder="https://example.com/blog/post"
          />
        </div>
        <div className="space-y-2">
          <FieldLabel
            htmlFor="article-image"
            label="Image URL"
            help="Main image for the article"
            optional
          />
          <Input
            id="article-image"
            value={state.article.imageUrl}
            onChange={(e) => updateArticle({ imageUrl: e.target.value })}
            placeholder="https://example.com/image.jpg"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <FieldLabel
            htmlFor="article-author"
            label="Author Name"
            help="Name of the article author"
            optional
          />
          <Input
            id="article-author"
            value={state.article.authorName}
            onChange={(e) => updateArticle({ authorName: e.target.value })}
            placeholder="Jane Doe"
          />
        </div>
        <div className="space-y-2">
          <FieldLabel
            htmlFor="article-author-url"
            label="Author URL"
            help="Link to author's profile or page"
            optional
          />
          <Input
            id="article-author-url"
            value={state.article.authorUrl}
            onChange={(e) => updateArticle({ authorUrl: e.target.value })}
            placeholder="https://example.com/authors/jane"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <FieldLabel
            htmlFor="article-publisher"
            label="Publisher Name"
            help="Name of the publishing organization"
            optional
          />
          <Input
            id="article-publisher"
            value={state.article.publisherName}
            onChange={(e) => updateArticle({ publisherName: e.target.value })}
            placeholder="Example Blog"
          />
        </div>
        <div className="space-y-2">
          <FieldLabel
            htmlFor="article-publisher-logo"
            label="Publisher Logo URL"
            help="Logo of the publisher"
            optional
          />
          <Input
            id="article-publisher-logo"
            value={state.article.publisherLogo}
            onChange={(e) => updateArticle({ publisherLogo: e.target.value })}
            placeholder="https://example.com/logo.png"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <FieldLabel
            htmlFor="article-published"
            label="Date Published"
            help="ISO 8601 format (YYYY-MM-DD)"
            optional
          />
          <Input
            id="article-published"
            type="date"
            value={state.article.datePublished}
            onChange={(e) => updateArticle({ datePublished: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <FieldLabel
            htmlFor="article-modified"
            label="Date Modified"
            help="ISO 8601 format (YYYY-MM-DD)"
            optional
          />
          <Input
            id="article-modified"
            type="date"
            value={state.article.dateModified}
            onChange={(e) => updateArticle({ dateModified: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}

function FAQForm({
  state,
  setState,
}: {
  state: JsonLdState;
  setState: (updates: Partial<JsonLdState>) => void;
}) {
  const items = state.faq.items;

  const updateItems = (newItems: FAQItem[]) => {
    setState({ faq: { items: newItems } });
  };

  const addItem = () => {
    updateItems([...items, { question: "", answer: "" }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      updateItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, updates: Partial<FAQItem>) => {
    updateItems(
      items.map((item, i) => (i === index ? { ...item, ...updates } : item))
    );
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Add questions and answers that are visible on your page. Only mark up
        FAQs that users can actually see.
      </p>
      {items.map((item, index) => (
        <div key={index} className="rounded-lg border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Question {index + 1}</p>
            {items.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeItem(index)}
              >
                <TrashIcon className="size-4" />
              </Button>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor={`faq-q-${index}`}>Question</Label>
            <Input
              id={`faq-q-${index}`}
              value={item.question}
              onChange={(e) => updateItem(index, { question: e.target.value })}
              placeholder="What is your return policy?"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`faq-a-${index}`}>Answer</Label>
            <Textarea
              id={`faq-a-${index}`}
              value={item.answer}
              onChange={(e) => updateItem(index, { answer: e.target.value })}
              placeholder="You can return items within 30 days..."
              rows={2}
            />
          </div>
        </div>
      ))}
      <Button variant="outline" onClick={addItem} className="w-full">
        <PlusIcon className="size-4 mr-2" />
        Add Question
      </Button>
    </div>
  );
}

function BreadcrumbForm({
  state,
  setState,
}: {
  state: JsonLdState;
  setState: (updates: Partial<JsonLdState>) => void;
}) {
  const items = state.breadcrumb.items;

  const updateItems = (newItems: BreadcrumbItem[]) => {
    setState({ breadcrumb: { items: newItems } });
  };

  const addItem = () => {
    updateItems([...items, { name: "", url: "" }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      updateItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, updates: Partial<BreadcrumbItem>) => {
    updateItems(
      items.map((item, i) => (i === index ? { ...item, ...updates } : item))
    );
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Define your breadcrumb path from home to the current page.
      </p>
      {items.map((item, index) => (
        <div key={index} className="flex items-start gap-3">
          <div className="flex-1 grid grid-cols-2 gap-2">
            <Input
              value={item.name}
              onChange={(e) => updateItem(index, { name: e.target.value })}
              placeholder={index === 0 ? "Home" : `Level ${index + 1}`}
            />
            <Input
              value={item.url}
              onChange={(e) => updateItem(index, { url: e.target.value })}
              placeholder="https://example.com/..."
            />
          </div>
          {items.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeItem(index)}
            >
              <TrashIcon className="size-4" />
            </Button>
          )}
        </div>
      ))}
      <Button variant="outline" onClick={addItem} className="w-full">
        <PlusIcon className="size-4 mr-2" />
        Add Level
      </Button>
    </div>
  );
}

export function JsonLdComponent({
  assets,
  state,
  setState,
  onGenerate,
  setHeaderGenerate,
}: ToolProps) {
  const currentState = useMemo(
    () => ({
      ...DEFAULT_STATE,
      ...(state as Partial<JsonLdState>),
      organization: {
        ...DEFAULT_STATE.organization,
        ...(state as Partial<JsonLdState>)?.organization,
      },
      website: {
        ...DEFAULT_STATE.website,
        ...(state as Partial<JsonLdState>)?.website,
      },
      article: {
        ...DEFAULT_STATE.article,
        ...(state as Partial<JsonLdState>)?.article,
      },
      faq: {
        ...DEFAULT_STATE.faq,
        ...(state as Partial<JsonLdState>)?.faq,
      },
      breadcrumb: {
        ...DEFAULT_STATE.breadcrumb,
        ...(state as Partial<JsonLdState>)?.breadcrumb,
      },
    }),
    [state]
  );

  // Initialize from assets
  useEffect(() => {
    if (assets.domain) {
      const domain = assets.domain.trim();
      const url = domain.startsWith("http") ? domain : `https://${domain}`;
      const updates: Partial<JsonLdState> = {};

      if (!currentState.organization.url) {
        updates.organization = { ...currentState.organization, url };
      }
      if (!currentState.website.url) {
        updates.website = { ...currentState.website, url };
      }

      if (Object.keys(updates).length > 0) {
        setState(updates);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assets.domain]);

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
    const output = generateJsonLdOutput(currentState);
    onGenerate(output);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewKey]);

  const handleGenerate = useCallback(() => {
    const output = generateJsonLdOutput(currentStateRef.current);
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
          htmlFor="schemaType"
          label="Schema Type"
          help="Choose the type of structured data you want to generate"
        />
        <Select
          value={currentState.schemaType}
          onValueChange={(value: SchemaType) => setState({ schemaType: value })}
        >
          <SelectTrigger id="schemaType">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Organization">Organization</SelectItem>
            <SelectItem value="WebSite">WebSite</SelectItem>
            <SelectItem value="Article">Article / Blog Post</SelectItem>
            <SelectItem value="FAQPage">FAQ Page</SelectItem>
            <SelectItem value="BreadcrumbList">Breadcrumbs</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border p-4">
        {currentState.schemaType === "Organization" && (
          <OrganizationForm state={currentState} setState={setState} />
        )}
        {currentState.schemaType === "WebSite" && (
          <WebSiteForm state={currentState} setState={setState} />
        )}
        {currentState.schemaType === "Article" && (
          <ArticleForm state={currentState} setState={setState} />
        )}
        {currentState.schemaType === "FAQPage" && (
          <FAQForm state={currentState} setState={setState} />
        )}
        {currentState.schemaType === "BreadcrumbList" && (
          <BreadcrumbForm state={currentState} setState={setState} />
        )}
      </div>

      <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground space-y-2">
        <p className="font-medium text-foreground">Validation</p>
        <p>
          After generating, test your schema with{" "}
          <a
            href="https://search.google.com/test/rich-results"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Google's Rich Results Test
          </a>{" "}
          or{" "}
          <a
            href="https://validator.schema.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Schema.org Validator
          </a>
          .
        </p>
      </div>
    </div>
  );
}

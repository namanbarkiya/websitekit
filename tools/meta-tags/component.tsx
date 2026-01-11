"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { ToolProps } from "@/lib/utils/tool-registry";

import { FormSections } from "./lib/form-sections";
import { generateMetaTagsHTML } from "./lib/html-generator";
import { generatePreviewHTML } from "./lib/preview-generator";
import { DEFAULT_STATE, type MetaTagsState } from "./types";

export function MetaTagsComponent({
  assets,
  state,
  setState,
  onGenerate,
  setHeaderGenerate,
}: ToolProps) {
  const [basicOpen, setBasicOpen] = useState(true);
  const [ogOpen, setOgOpen] = useState(false);
  const [twitterOpen, setTwitterOpen] = useState(false);

  // Memoize assets for stable reference
  const assetsKey = useMemo(
    () =>
      `${assets.name}|${assets.domain}|${assets.description}|${assets.logo}`,
    [assets.name, assets.domain, assets.description, assets.logo]
  );

  // Initialize state from assets on mount or when assets change
  useEffect(() => {
    const currentState = state as Partial<MetaTagsState>;
    const updates: Partial<MetaTagsState> = {};

    // Only set defaults if fields are empty
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
      const protocol = assets.domain.startsWith("http") ? "" : "https://";
      updates.canonicalUrl = `${protocol}${assets.domain}`;
    }
    if (!currentState.ogUrl && assets.domain) {
      const protocol = assets.domain.startsWith("http") ? "" : "https://";
      updates.ogUrl = `${protocol}${assets.domain}`;
    }

    if (Object.keys(updates).length > 0) {
      setState(updates);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetsKey, setState]);

  const currentState = useMemo(
    () => (state as Partial<MetaTagsState>) || {},
    [state]
  );
  const currentStateRef = useRef(currentState);
  useEffect(() => {
    currentStateRef.current = currentState;
  }, [currentState]);

  // Generate real-time preview as user types
  const previewStateKey = useMemo(
    () =>
      JSON.stringify({
        title: currentState.title || "",
        description: currentState.description || "",
        ogTitle: currentState.ogTitle || "",
        ogDescription: currentState.ogDescription || "",
        ogImage: currentState.ogImage || "",
        twitterImage: currentState.twitterImage || "",
        canonicalUrl: currentState.canonicalUrl || "",
        ogUrl: currentState.ogUrl || "",
        ogSiteName: currentState.ogSiteName || "",
        twitterTitle: currentState.twitterTitle || "",
        twitterDescription: currentState.twitterDescription || "",
      }),
    [
      currentState.title,
      currentState.description,
      currentState.ogTitle,
      currentState.ogDescription,
      currentState.ogImage,
      currentState.twitterImage,
      currentState.canonicalUrl,
      currentState.ogUrl,
      currentState.ogSiteName,
      currentState.twitterTitle,
      currentState.twitterDescription,
    ]
  );

  useEffect(() => {
    const metaState = { ...DEFAULT_STATE, ...currentState };
    const preview = generatePreviewHTML(metaState, assets.primaryColor);
    const html = generateMetaTagsHTML(metaState);

    // Only update if there's meaningful content
    if (
      metaState.title ||
      metaState.description ||
      metaState.ogTitle ||
      metaState.ogDescription
    ) {
      onGenerate({
        type: "html",
        content: html,
        preview: preview,
        filename: "meta-tags.html",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewStateKey]);

  const handleChange = (field: keyof MetaTagsState, value: string) => {
    setState({ [field]: value });
  };

  const handleGenerate = useCallback(() => {
    const metaState = { ...DEFAULT_STATE, ...currentStateRef.current };
    const html = generateMetaTagsHTML(metaState);
    const preview = generatePreviewHTML(metaState, assets.primaryColor);
    onGenerate({
      type: "html",
      content: html,
      preview: preview,
      filename: "meta-tags.html",
    });
  }, [assets.primaryColor, onGenerate]);

  // Register global header "Generate" button handler
  useEffect(() => {
    if (!setHeaderGenerate) return;
    setHeaderGenerate({ onGenerate: handleGenerate, label: "Generate" });
    return () => setHeaderGenerate(null);
  }, [handleGenerate, setHeaderGenerate]);

  const metaState = useMemo(
    () => ({ ...DEFAULT_STATE, ...currentState }),
    [currentState]
  );

  return (
    <FormSections
      state={metaState}
      onFieldChange={handleChange}
      basicOpen={basicOpen}
      onBasicOpenChange={setBasicOpen}
      ogOpen={ogOpen}
      onOgOpenChange={setOgOpen}
      twitterOpen={twitterOpen}
      onTwitterOpenChange={setTwitterOpen}
    />
  );
}

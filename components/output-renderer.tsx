"use client";

import { useEffect, useMemo, useState } from "react";

import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ToolOutput } from "@/lib/utils/tool-registry";
import { CodeTab } from "@/components/output/code-tab";
import { FilesTab } from "@/components/output/files-tab";
import { PreviewTab } from "@/components/output/preview-tab";
import { OutputActions } from "@/components/output/output-actions";

interface OutputRendererProps {
  /** Tool output to render */
  output: ToolOutput | null;
  /** Tool name (for filename generation) */
  toolName?: string;
  /** Whether output is loading */
  isLoading?: boolean;
}

/**
 * Output Renderer Component
 *
 * Renders tool outputs with Preview/Code/Files tabs
 */
export function OutputRenderer({
  output,
  toolName,
  isLoading = false,
}: OutputRendererProps) {
  const [activeTab, setActiveTab] = useState<string>("preview");
  const [copied, setCopied] = useState(false);

  // Determine which tabs to show
  const availableTabs = useMemo(() => {
    if (!output) return [];
    const tabs: string[] = [];

    // Always show Code tab if there's content
    if (output.content || output.files) {
      tabs.push("code");
    }

    // Show Preview tab for HTML or image outputs
    if (output.type === "html" || output.type === "image" || output.preview) {
      tabs.unshift("preview"); // Add to beginning
    }

    // Show Files tab for file outputs
    if (output.type === "files" || (output.files && output.files.length > 0)) {
      tabs.push("files");
    }

    return tabs;
  }, [output]);

  // Set default tab when output changes
  useEffect(() => {
    if (availableTabs.length > 0 && !availableTabs.includes(activeTab)) {
      // Avoid synchronous setState in effect body.
      Promise.resolve().then(() => setActiveTab(availableTabs[0]));
    }
  }, [availableTabs, activeTab]);

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          Generating output...
        </div>
      </Card>
    );
  }

  if (!output) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          No output generated yet. Use the tool to generate content.
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden flex flex-col h-full min-h-0 py-0 gap-0">
      {/* Tabs */}
      {availableTabs.length > 0 ? (
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full flex-1 flex flex-col min-h-0 overflow-hidden"
        >
          {/* Header with Tabs and actions */}
          <div className="border-b p-3 sm:p-4 shrink-0">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 overflow-x-auto">
                <TabsList className="w-max">
                  {availableTabs.map((tab) => (
                    <TabsTrigger
                      key={tab}
                      value={tab}
                      className="px-3 sm:px-6 flex-none"
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              <OutputActions
                output={output}
                toolName={toolName}
                copied={copied}
                onCopiedChange={setCopied}
              />
            </div>
          </div>

          {/* Tab Contents */}
          {availableTabs.includes("preview") && <PreviewTab output={output} />}
          {availableTabs.includes("code") && <CodeTab output={output} />}
          {availableTabs.includes("files") && <FilesTab output={output} />}
        </Tabs>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            No output to display
          </div>
        </div>
      )}
    </Card>
  );
}

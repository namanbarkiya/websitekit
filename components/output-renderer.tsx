"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckIcon,
  CopyIcon,
  DownloadIcon,
  FileIcon,
  ImageIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  copyToClipboard,
  downloadFile,
  downloadFilesAsZip,
  generateFilename,
  getSyntaxLanguage,
} from "@/lib/utils/output-utils";
import type { ToolOutput } from "@/lib/utils/tool-registry";

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

  const handleCopy = async () => {
    if (!output) return;

    let textToCopy = "";

    if (output.content) {
      textToCopy = output.content;
    } else if (output.files && output.files.length > 0) {
      // Copy first file content
      const firstFile = output.files[0];
      textToCopy =
        firstFile.content instanceof Blob
          ? await firstFile.content.text()
          : firstFile.content;
    }

    const success = await copyToClipboard(textToCopy);
    if (success) {
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleDownload = async () => {
    if (!output) return;

    try {
      if (output.files && output.files.length > 1) {
        // Multiple files - download as ZIP
        await downloadFilesAsZip(output.files);
        toast.success("Files downloaded as ZIP");
      } else if (output.files && output.files.length === 1) {
        // Single file
        const file = output.files[0];
        const content =
          file.content instanceof Blob
            ? file.content
            : new Blob([file.content], { type: file.mimeType });
        downloadFile(content, {
          filename: file.filename,
          mimeType: file.mimeType,
        });
        toast.success("File downloaded");
      } else if (output.content) {
        // Content-based output
        const filename = generateFilename(output, toolName);
        downloadFile(output.content, {
          filename,
          mimeType: output.mimeType || "text/plain",
        });
        toast.success("File downloaded");
      }
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download file");
    }
  };

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

  const canCopy = !!(
    output.content ||
    (output.files && output.files.length > 0)
  );
  const canDownload = !!(
    output.content ||
    (output.files && output.files.length > 0)
  );

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
              <div className="flex items-center gap-2 justify-end">
                {canCopy && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="gap-2 px-2 sm:px-3"
                    aria-label={copied ? "Copied" : "Copy"}
                    title={copied ? "Copied" : "Copy"}
                  >
                    {copied ? (
                      <>
                        <CheckIcon className="size-4" />
                        <span className="hidden sm:inline">Copied</span>
                      </>
                    ) : (
                      <>
                        <CopyIcon className="size-4" />
                        <span className="hidden sm:inline">Copy</span>
                      </>
                    )}
                  </Button>
                )}
                {canDownload && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    className="gap-2 px-2 sm:px-3"
                    aria-label="Download"
                    title="Download"
                  >
                    <DownloadIcon className="size-4" />
                    <span className="hidden sm:inline">Download</span>
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Preview Tab */}
          {availableTabs.includes("preview") && (
            <TabsContent
              value="preview"
              className="m-0 h-0 flex-1 min-h-0 overflow-hidden"
            >
              <ScrollArea className="h-full w-full">
                <div className="px-4 pt-4 pb-4">
                  <div className="rounded-lg border bg-muted/50 p-4">
                    {output.preview ? (
                      <div
                        className="max-w-none"
                        dangerouslySetInnerHTML={{ __html: output.preview }}
                      />
                    ) : output.type === "html" && output.content ? (
                      <div
                        className="prose prose-sm max-w-none dark:prose-invert"
                        dangerouslySetInnerHTML={{ __html: output.content }}
                      />
                    ) : output.type === "image" && output.files?.[0] ? (
                      <div className="flex items-center justify-center">
                        <img
                          src={
                            output.files[0].content instanceof Blob
                              ? URL.createObjectURL(output.files[0].content)
                              : output.files[0].content
                          }
                          alt="Preview"
                          className="max-w-full rounded-lg"
                        />
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground">
                        No preview available
                      </div>
                    )}
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          )}

          {/* Code Tab */}
          {availableTabs.includes("code") && (
            <TabsContent
              value="code"
              className="m-0 h-0 flex-1 min-h-0 overflow-hidden flex flex-col"
            >
              <ScrollArea className="flex-1 min-h-0 w-full">
                <div className="px-4 pt-4 pb-2">
                  <div className="rounded-lg border bg-muted/50 overflow-x-auto overflow-y-hidden">
                    <pre className="p-4 text-sm m-0 whitespace-pre min-w-fit">
                      <code className="font-mono">
                        {output.content
                          ? output.content
                          : output.files && output.files.length > 0
                            ? output.files
                                .map((file) => {
                                  const content =
                                    file.content instanceof Blob
                                      ? "[Binary file]"
                                      : file.content;
                                  return output.files!.length > 1
                                    ? `// ${file.filename}\n${content}`
                                    : content;
                                })
                                .join("\n\n")
                            : "No content"}
                      </code>
                    </pre>
                  </div>
                </div>
              </ScrollArea>
              <div className="text-xs text-muted-foreground shrink-0 px-4 pb-4">
                Language: {getSyntaxLanguage(output)}
              </div>
            </TabsContent>
          )}

          {/* Files Tab */}
          {availableTabs.includes("files") && (
            <TabsContent
              value="files"
              className="m-0 h-0 flex-1 min-h-0 overflow-hidden"
            >
              <ScrollArea className="h-full w-full">
                <div className="px-4 pt-4 pb-4 space-y-2">
                  {output.files?.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="flex items-center gap-3">
                        {output.type === "image" ? (
                          <ImageIcon className="size-5 text-muted-foreground" />
                        ) : (
                          <FileIcon className="size-5 text-muted-foreground" />
                        )}
                        <div>
                          <p className="text-sm font-medium">{file.filename}</p>
                          {file.mimeType && (
                            <p className="text-xs text-muted-foreground">
                              {file.mimeType}
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const content =
                            file.content instanceof Blob
                              ? file.content
                              : new Blob([file.content], {
                                  type: file.mimeType,
                                });
                          downloadFile(content, {
                            filename: file.filename,
                            mimeType: file.mimeType,
                          });
                          toast.success(`Downloaded ${file.filename}`);
                        }}
                      >
                        <DownloadIcon className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          )}
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

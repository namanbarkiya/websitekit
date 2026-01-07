"use client";

import { useState, useMemo } from "react";
import { CopyIcon, DownloadIcon, CheckIcon, FileIcon, ImageIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ToolOutput } from "@/lib/utils/tool-registry";
import {
  copyToClipboard,
  downloadFile,
  downloadFilesAsZip,
  generateFilename,
  getSyntaxLanguage,
} from "@/lib/utils/output-utils";

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
  useMemo(() => {
    if (availableTabs.length > 0 && !availableTabs.includes(activeTab)) {
      setActiveTab(availableTabs[0]);
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

  const canCopy = !!(output.content || (output.files && output.files.length > 0));
  const canDownload =
    !!(output.content || (output.files && output.files.length > 0));

  return (
    <Card className="overflow-hidden">
      {/* Header with actions */}
      <div className="flex items-center justify-between border-b p-4">
        <h3 className="text-sm font-semibold">Output</h3>
        <div className="flex items-center gap-2">
          {canCopy && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="gap-2"
            >
              {copied ? (
                <>
                  <CheckIcon className="size-4" />
                  Copied
                </>
              ) : (
                <>
                  <CopyIcon className="size-4" />
                  Copy
                </>
              )}
            </Button>
          )}
          {canDownload && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="gap-2"
            >
              <DownloadIcon className="size-4" />
              Download
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      {availableTabs.length > 0 ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b px-4">
            <TabsList>
              {availableTabs.map((tab) => (
                <TabsTrigger key={tab} value={tab}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Preview Tab */}
          {availableTabs.includes("preview") && (
            <TabsContent value="preview" className="m-0 p-4">
              <div className="rounded-lg border bg-muted/50 p-4">
                {output.type === "html" && output.content ? (
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
                ) : output.preview ? (
                  <div
                    className="prose prose-sm max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: output.preview }}
                  />
                ) : (
                  <div className="text-center text-muted-foreground">
                    No preview available
                  </div>
                )}
              </div>
            </TabsContent>
          )}

          {/* Code Tab */}
          {availableTabs.includes("code") && (
            <TabsContent value="code" className="m-0 p-4">
              <ScrollArea className="h-[400px] w-full rounded-lg border bg-muted/50">
                <pre className="p-4 text-sm">
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
              </ScrollArea>
              <div className="mt-2 text-xs text-muted-foreground">
                Language: {getSyntaxLanguage(output)}
              </div>
            </TabsContent>
          )}

          {/* Files Tab */}
          {availableTabs.includes("files") && (
            <TabsContent value="files" className="m-0 p-4">
              <div className="space-y-2">
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
                            : new Blob([file.content], { type: file.mimeType });
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
            </TabsContent>
          )}
        </Tabs>
      ) : (
        <div className="p-4 text-center text-muted-foreground">
          No output to display
        </div>
      )}
    </Card>
  );
}

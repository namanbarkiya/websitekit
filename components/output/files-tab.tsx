"use client";

import { DownloadIcon, FileIcon, ImageIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TabsContent } from "@/components/ui/tabs";
import { downloadFile } from "@/lib/utils/output-utils";
import type { ToolOutput } from "@/lib/utils/tool-registry";

interface FilesTabProps {
  output: ToolOutput;
}

export function FilesTab({ output }: FilesTabProps) {
  return (
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
  );
}

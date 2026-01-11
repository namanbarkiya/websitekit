"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { TabsContent } from "@/components/ui/tabs";
import type { ToolOutput } from "@/lib/utils/tool-registry";

interface PreviewTabProps {
  output: ToolOutput;
}

export function PreviewTab({ output }: PreviewTabProps) {
  return (
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
  );
}

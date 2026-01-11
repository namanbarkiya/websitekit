"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { TabsContent } from "@/components/ui/tabs";
import { getSyntaxLanguage } from "@/lib/utils/output-utils";
import type { ToolOutput } from "@/lib/utils/tool-registry";

interface CodeTabProps {
  output: ToolOutput;
}

export function CodeTab({ output }: CodeTabProps) {
  return (
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
  );
}

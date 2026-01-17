"use client";

import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TabsContent } from "@/components/ui/tabs";
import type { ToolOutput } from "@/lib/utils/tool-registry";

interface PreviewTabProps {
  output: ToolOutput;
}

export function PreviewTab({ output }: PreviewTabProps) {
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!output.preview || !previewRef.current) return;

    // Execute scripts from the preview HTML
    // Scripts in dangerouslySetInnerHTML don't execute, so we need to manually execute them
    const previewDiv = previewRef.current;
    const scripts = previewDiv.querySelectorAll("script");
    
    scripts.forEach((script) => {
      // Create new script element and append it (not replace) so it executes
      const newScript = document.createElement("script");
      if (script.src) {
        newScript.src = script.src;
        newScript.async = true;
      } else if (script.textContent) {
        // For inline scripts, execute directly
        try {
          // Use Function constructor to execute in global scope
          const func = new Function(script.textContent);
          func();
        } catch (e) {
          // Fallback: append the script element
          newScript.textContent = script.textContent;
          document.body.appendChild(newScript);
          // Remove after a delay to avoid accumulation
          setTimeout(() => document.body.removeChild(newScript), 1000);
        }
      }
      // Remove the non-executing script tag
      script.remove();
    });

    // Cleanup function to remove any global state when component unmounts
    return () => {
      // Clean up preview-specific globals if needed
      if ((window as any).previewCookieConsent) {
        // Hide any visible modals/banners
        const banner = document.getElementById("cookie-consent-preview");
        const modal = document.getElementById("cookie-settings-modal-preview");
        if (banner) banner.classList.remove("show");
        if (modal) modal.classList.remove("show");
      }
    };
  }, [output.preview]);

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
                ref={previewRef}
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

"use client";

import { useMemo, useState } from "react";
import { notFound, useParams } from "next/navigation";
import { InfoIcon } from "lucide-react";

import { OutputRenderer } from "@/components/output-renderer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { sidebarConfig, type SidebarNavItem } from "@/config/sidebar";
import { useToolState } from "@/lib/hooks/use-tool-state";
import { useWebsiteAssets } from "@/lib/hooks/use-website-assets";
import {
  getTool,
  type ToolDefinition,
  type ToolOutput,
} from "@/lib/utils/tool-registry";

// Initialize tools (this triggers registration)
import "@/lib/tools";

function findToolMeta(toolId: string): SidebarNavItem | undefined {
  for (const category of sidebarConfig.categories) {
    const item = category.items.find(
      (it) => it.href.replace("/tools/", "") === toolId
    );
    if (item) return item;
  }
  return undefined;
}

export default function ToolHostPage() {
  const params = useParams<{ toolId: string }>();
  const toolId = params?.toolId;

  if (!toolId) {
    notFound();
  }

  const assets = useWebsiteAssets();
  const toolDef: ToolDefinition | undefined = getTool(toolId);
  const toolMeta = useMemo(() => findToolMeta(toolId), [toolId]);
  const { state, setState } = useToolState({ initialState: {} });

  const [output, setOutput] = useState<ToolOutput | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!toolDef?.generate) return;
    setIsGenerating(true);
    try {
      const result = await toolDef.generate(state, assets);
      setOutput(result);
    } finally {
      setIsGenerating(false);
    }
  };

  const ToolComponent = toolDef?.Component;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full min-h-0">
      {/* Left Card - Tool Form */}
      <Card className="flex flex-col h-full min-h-0 overflow-hidden !py-0 gap-0">
        <CardHeader className="shrink-0 border-b px-6 py-6">
          <CardTitle className="flex items-center gap-2">
            {toolMeta?.title ?? toolDef?.name ?? toolId}
          </CardTitle>
          {/* <div className="px-6 pt-4 pb-3 shrink-0">
            <p className="text-sm text-muted-foreground"> */}
          <CardDescription>
            {toolMeta?.description ??
              toolDef?.description ??
              "This tool is not implemented yet. Check back soon."}
          </CardDescription>
          {/* </p> */}
          {/* </div> */}
        </CardHeader>
        <div className="flex-1 min-h-0 overflow-hidden">
          <ScrollArea className="h-full w-full">
            <div className="px-6 space-y-4 py-4">
              {ToolComponent ? (
                <ToolComponent
                  assets={assets}
                  state={state}
                  setState={setState}
                  onGenerate={(o) => setOutput(o)}
                />
              ) : (
                <div className="rounded-md border p-4 flex items-start gap-3">
                  <InfoIcon className="size-4 mt-0.5 text-muted-foreground" />
                  <div className="text-sm text-muted-foreground">
                    This tool is not available yet. You can still preview how
                    outputs will appear here when implemented.
                  </div>
                </div>
              )}

              {toolDef?.generate && (
                <div>
                  <button
                    onClick={handleGenerate}
                    className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-accent transition-colors"
                  >
                    Generate
                  </button>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </Card>

      {/* Right Card - Output */}
      <div className="h-full min-h-0 overflow-hidden">
        <OutputRenderer
          output={output}
          toolName={toolMeta?.title ?? toolDef?.name ?? toolId}
          isLoading={isGenerating}
        />
      </div>
    </div>
  );
}

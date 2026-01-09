"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { InfoIcon, Zap } from "lucide-react";

import { OutputRenderer } from "@/components/output-renderer";
import { Button } from "@/components/ui/button";
import {
  Card,
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
  type HeaderGenerateConfig,
  type ToolDefinition,
  type ToolOutput,
} from "@/lib/utils/tool-registry";

// Initialize tools (this triggers registration)
import "@/lib/tools";

const RECENTS_STORAGE_KEY = "websitekit-recent-tools";

function findToolMeta(toolId: string): SidebarNavItem | undefined {
  for (const category of sidebarConfig.categories) {
    const item = category.items.find(
      (it) => it.href.replace("/tools/", "") === toolId
    );
    if (item) return item;
  }
  return undefined;
}

export function ToolClient({ toolId }: { toolId: string }) {
  const assets = useWebsiteAssets();
  const toolDef: ToolDefinition | undefined = getTool(toolId);
  const toolMeta = useMemo(() => findToolMeta(toolId), [toolId]);
  const { state, setState } = useToolState({ initialState: {} });

  const [output, setOutput] = useState<ToolOutput | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [headerAction, setHeaderAction] = useState<ReactNode | null>(null);
  const [headerGenerate, setHeaderGenerateState] =
    useState<HeaderGenerateConfig | null>(null);
  const headerGenerateRef = useRef<HeaderGenerateConfig | null>(null);
  const [isHeaderGenerating, setIsHeaderGenerating] = useState(false);

  const handleToolGenerate = useCallback((o: ToolOutput) => {
    setOutput(o);
  }, []);

  const setHeaderGenerate = useCallback(
    (config: HeaderGenerateConfig | null) => {
      const prev = headerGenerateRef.current;
      const isSame =
        prev?.onGenerate === config?.onGenerate &&
        prev?.disabled === config?.disabled &&
        prev?.label === config?.label;
      if (isSame) return;
      headerGenerateRef.current = config;
      setHeaderGenerateState(config);
    },
    []
  );

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

  // Track recent tools locally (for the /tools browse page)
  useEffect(() => {
    try {
      const href = `/tools/${toolId}`;
      const raw = localStorage.getItem(RECENTS_STORAGE_KEY);
      const arr = raw ? (JSON.parse(raw) as unknown) : [];
      const list = Array.isArray(arr)
        ? arr.filter((x) => typeof x === "string")
        : [];
      const next = [href, ...list.filter((x) => x !== href)].slice(0, 10);
      localStorage.setItem(RECENTS_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, [toolId]);

  const ToolComponent = toolDef?.Component;
  const effectiveGenerate = headerGenerate?.onGenerate
    ? headerGenerate.onGenerate
    : toolDef?.generate
      ? handleGenerate
      : null;
  const canGenerate = Boolean(effectiveGenerate);
  const generateDisabled =
    !canGenerate ||
    Boolean(headerGenerate?.disabled) ||
    isGenerating ||
    isHeaderGenerating;
  const generateLabel =
    isGenerating || isHeaderGenerating
      ? "Generating..."
      : (headerGenerate?.label ?? "Generate");

  const handleHeaderGenerate = useCallback(async () => {
    if (!effectiveGenerate) return;
    try {
      const result = effectiveGenerate();
      if (result && typeof (result as Promise<void>).then === "function") {
        setIsHeaderGenerating(true);
        await result;
      }
    } finally {
      setIsHeaderGenerating(false);
    }
  }, [effectiveGenerate]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full min-h-0">
      {/* Left Card - Tool Form */}
      <Card className="flex flex-col h-full min-h-0 overflow-hidden py-0! gap-0">
        <CardHeader className="shrink-0 border-b px-6 py-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <CardTitle className="flex items-center gap-2">
                {toolMeta?.title ?? toolDef?.name ?? toolId}
              </CardTitle>
              <CardDescription>
                {toolMeta?.description ??
                  toolDef?.description ??
                  "This tool is not implemented yet. Check back soon."}
              </CardDescription>
            </div>
            <div className="shrink-0 flex items-center gap-2">
              {headerAction}
              <Button
                size="icon-sm"
                onClick={handleHeaderGenerate}
                disabled={generateDisabled}
                aria-label={generateLabel}
                title={generateLabel}
              >
                <Zap className="size-4" />
                <span className="sr-only">{generateLabel}</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <div className="flex-1 min-h-0 overflow-hidden">
          <ScrollArea className="h-full w-full">
            <div className="px-6 space-y-4 py-4">
              {ToolComponent ? (
                <ToolComponent
                  assets={assets}
                  state={state}
                  setState={setState}
                  onGenerate={handleToolGenerate}
                  setHeaderAction={setHeaderAction}
                  setHeaderGenerate={setHeaderGenerate}
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

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { InfoIcon, PlusIcon, TrashIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { ToolProps } from "@/lib/utils/tool-registry";

import { generateCSPOutput } from "./lib/generator";
import {
  DEFAULT_STATE,
  DEFAULT_DIRECTIVES,
  type CSPState,
  type CSPDirectiveConfig,
  type CSPDirective,
  type CSPValue,
} from "./types";

function FieldLabel({
  htmlFor,
  label,
  help,
  optional,
}: {
  htmlFor: string;
  label: string;
  help: string;
  optional?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <Label htmlFor={htmlFor}>
        {label}
        {optional && (
          <span className="text-muted-foreground font-normal ml-1">
            (optional)
          </span>
        )}
      </Label>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-sm text-muted-foreground hover:text-foreground"
            aria-label={`Help: ${label}`}
          >
            <InfoIcon className="size-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={6}>
          {help}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

const COMMON_VALUES: CSPValue[] = [
  "'self'",
  "'unsafe-inline'",
  "'unsafe-eval'",
  "'unsafe-hashes'",
  "'strict-dynamic'",
  "'none'",
  "data:",
  "blob:",
  "https:",
  "http:",
];

export function CSPComponent({
  assets,
  state,
  setState,
  onGenerate,
  setHeaderGenerate,
}: ToolProps) {
  const currentState = useMemo(
    () => ({
      ...DEFAULT_STATE,
      ...(state as Partial<CSPState>),
      directives: (state as Partial<CSPState>)?.directives || DEFAULT_DIRECTIVES,
    }),
    [state]
  );

  const currentStateRef = useRef(currentState);
  useEffect(() => {
    currentStateRef.current = currentState;
  }, [currentState]);

  const previewKey = useMemo(
    () => JSON.stringify(currentState),
    [currentState]
  );

  // Real-time output generation
  useEffect(() => {
    const output = generateCSPOutput(currentState);
    onGenerate(output);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewKey]);

  const handleGenerate = useCallback(() => {
    const output = generateCSPOutput(currentStateRef.current);
    onGenerate(output);
  }, [onGenerate]);

  // Register header generate button
  useEffect(() => {
    if (!setHeaderGenerate) return;
    setHeaderGenerate({ onGenerate: handleGenerate, label: "Generate" });
    return () => setHeaderGenerate(null);
  }, [handleGenerate, setHeaderGenerate]);

  const updateDirective = (
    index: number,
    updates: Partial<CSPDirectiveConfig>
  ) => {
    const newDirectives = [...currentState.directives];
    newDirectives[index] = { ...newDirectives[index], ...updates };
    setState({ directives: newDirectives });
  };

  const addValueToDirective = (index: number, value: string) => {
    const directive = currentState.directives[index];
    if (!directive.values.includes(value as CSPValue)) {
      updateDirective(index, {
        values: [...directive.values, value as CSPValue],
      });
    }
  };

  const removeValueFromDirective = (index: number, valueIndex: number) => {
    const directive = currentState.directives[index];
    const newValues = directive.values.filter((_, i) => i !== valueIndex);
    updateDirective(index, { values: newValues });
  };

  const addCustomValue = (index: number, value: string) => {
    if (value.trim()) {
      addValueToDirective(index, value.trim());
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground space-y-2">
        <p className="font-medium text-foreground">Content Security Policy</p>
        <p>
          CSP helps prevent XSS attacks by controlling which resources can be
          loaded. Start with a restrictive policy and relax as needed.
        </p>
      </div>

      <div className="rounded-lg border p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label>Options</Label>
            <p className="text-xs text-muted-foreground">
              Configure CSP behavior
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="reportOnly">Report Only Mode</Label>
              <p className="text-xs text-muted-foreground">
                Use Content-Security-Policy-Report-Only header (for testing)
              </p>
            </div>
            <Switch
              id="reportOnly"
              checked={currentState.reportOnly}
              onCheckedChange={(checked) => setState({ reportOnly: checked })}
            />
          </div>
          <div className="space-y-2">
            <FieldLabel
              htmlFor="reportUri"
              label="Report URI"
              help="URL to send CSP violation reports to"
              optional
            />
            <Input
              id="reportUri"
              value={currentState.reportUri || ""}
              onChange={(e) => setState({ reportUri: e.target.value })}
              placeholder="https://example.com/csp-report"
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {currentState.directives.map((directive, index) => (
          <Collapsible key={directive.directive} defaultOpen={directive.enabled}>
            <div className="rounded-lg border p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CollapsibleTrigger className="text-sm font-medium">
                    {directive.directive}
                  </CollapsibleTrigger>
                  {directive.directive === "default-src" && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="size-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        Fallback for other directives that aren't specified
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
                <Switch
                  checked={directive.enabled}
                  onCheckedChange={(checked) =>
                    updateDirective(index, { enabled: checked })
                  }
                />
              </div>

              {directive.enabled && (
                <CollapsibleContent className="space-y-3 pt-2">
                  {directive.directive !== "upgrade-insecure-requests" &&
                    directive.directive !== "block-all-mixed-content" && (
                      <>
                        <div className="space-y-2">
                          <Label>Allowed Sources</Label>
                          <div className="flex flex-wrap gap-2">
                            {directive.values.map((value, valueIndex) => (
                              <div
                                key={valueIndex}
                                className="flex items-center gap-1 rounded-md border bg-muted px-2 py-1 text-sm"
                              >
                                <code className="text-xs">{value}</code>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-4 w-4 p-0"
                                  onClick={() =>
                                    removeValueFromDirective(index, valueIndex)
                                  }
                                >
                                  <TrashIcon className="size-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <Select
                            onValueChange={(value) =>
                              addValueToDirective(index, value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Add common value" />
                            </SelectTrigger>
                            <SelectContent>
                              {COMMON_VALUES.filter(
                                (v) => !directive.values.includes(v)
                              ).map((value) => (
                                <SelectItem key={value} value={value}>
                                  {value}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <div className="flex gap-2">
                            <Input
                              placeholder="Custom domain/URL"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  addCustomValue(
                                    index,
                                    (e.target as HTMLInputElement).value
                                  );
                                  (e.target as HTMLInputElement).value = "";
                                }
                              }}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                const input = (
                                  e.currentTarget.previousElementSibling as HTMLInputElement
                                );
                                addCustomValue(index, input.value);
                                input.value = "";
                              }}
                            >
                              <PlusIcon className="size-4" />
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                </CollapsibleContent>
              )}
            </div>
          </Collapsible>
        ))}
      </div>

      <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground space-y-2">
        <p className="font-medium text-foreground">Best Practices</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            Start with <strong>default-src 'self'</strong> and add exceptions
            as needed
          </li>
          <li>
            Avoid <strong>'unsafe-inline'</strong> and <strong>'unsafe-eval'</strong> when possible
          </li>
          <li>
            Use <strong>nonce</strong> or <strong>hash</strong> for inline scripts/styles
          </li>
          <li>
            Test in <strong>Report Only</strong> mode before enforcing
          </li>
          <li>
            Set <strong>object-src 'none'</strong> to prevent plugin attacks
          </li>
        </ul>
      </div>
    </div>
  );
}

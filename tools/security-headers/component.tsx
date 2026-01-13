"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { InfoIcon } from "lucide-react";

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
import type { ToolProps } from "@/lib/utils/tool-registry";

import { generateSecurityHeadersOutput } from "./lib/generator";
import {
  DEFAULT_STATE,
  type CrossOriginOpenerPolicy,
  type CrossOriginResourcePolicy,
  type FrameOptions,
  type ReferrerPolicy,
  type SecurityHeadersState,
} from "./types";

function FieldLabel({
  htmlFor,
  label,
  help,
}: {
  htmlFor: string;
  label: string;
  help: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Label htmlFor={htmlFor}>{label}</Label>
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

export function SecurityHeadersComponent({
  state,
  setState,
  onGenerate,
  setHeaderGenerate,
}: ToolProps) {
  const currentState = useMemo(
    () => ({ ...DEFAULT_STATE, ...(state as Partial<SecurityHeadersState>) }),
    [state]
  );

  const currentStateRef = useRef(currentState);
  useEffect(() => {
    currentStateRef.current = currentState;
  }, [currentState]);

  const previewKey = useMemo(
    () =>
      JSON.stringify({
        enableHsts: currentState.enableHsts,
        hstsMaxAgeSeconds: currentState.hstsMaxAgeSeconds,
        hstsIncludeSubdomains: currentState.hstsIncludeSubdomains,
        hstsPreload: currentState.hstsPreload,
        enableNosniff: currentState.enableNosniff,
        enableFrameOptions: currentState.enableFrameOptions,
        frameOptions: currentState.frameOptions,
        enableReferrerPolicy: currentState.enableReferrerPolicy,
        referrerPolicy: currentState.referrerPolicy,
        enableCoop: currentState.enableCoop,
        coop: currentState.coop,
        enableCorp: currentState.enableCorp,
        corp: currentState.corp,
      }),
    [
      currentState.enableHsts,
      currentState.hstsMaxAgeSeconds,
      currentState.hstsIncludeSubdomains,
      currentState.hstsPreload,
      currentState.enableNosniff,
      currentState.enableFrameOptions,
      currentState.frameOptions,
      currentState.enableReferrerPolicy,
      currentState.referrerPolicy,
      currentState.enableCoop,
      currentState.coop,
      currentState.enableCorp,
      currentState.corp,
    ]
  );

  // Real-time output generation
  useEffect(() => {
    onGenerate(generateSecurityHeadersOutput(currentState));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewKey]);

  const handleGenerate = useCallback(() => {
    onGenerate(generateSecurityHeadersOutput(currentStateRef.current));
  }, [onGenerate]);

  // Register header generate button
  useEffect(() => {
    if (!setHeaderGenerate) return;
    setHeaderGenerate({ onGenerate: handleGenerate, label: "Generate" });
    return () => setHeaderGenerate(null);
  }, [handleGenerate, setHeaderGenerate]);

  return (
    <div className="space-y-4">
      <div className="rounded-lg border p-4 space-y-4">
        <p className="text-sm font-semibold">Recommended baseline</p>

        {/* HSTS */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-0.5">
              <p className="text-sm font-medium">
                Strict-Transport-Security (HSTS)
              </p>
              <p className="text-xs text-muted-foreground">
                Forces HTTPS for returning visitors. Enable only on HTTPS-only
                production sites.
              </p>
            </div>
            <Switch
              className="shrink-0 mt-0.5"
              checked={currentState.enableHsts}
              onCheckedChange={(checked) => setState({ enableHsts: checked })}
              aria-label="Enable HSTS"
            />
          </div>

          {currentState.enableHsts ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <FieldLabel
                  htmlFor="hstsMaxAgeSeconds"
                  label="max-age (seconds)"
                  help="How long browsers should remember to use HTTPS. 6–12 months is common. Start smaller if you’re unsure."
                />
                <Input
                  id="hstsMaxAgeSeconds"
                  type="number"
                  min="0"
                  max="63072000"
                  step="3600"
                  value={currentState.hstsMaxAgeSeconds}
                  onChange={(e) =>
                    setState({
                      hstsMaxAgeSeconds: parseInt(e.target.value || "0", 10),
                    })
                  }
                />
              </div>

              <div className="flex items-start justify-between gap-3 rounded-md border px-3 py-2">
                <div className="min-w-0 space-y-0.5">
                  <p className="text-sm font-medium">SubDomains</p>
                  <p className="text-xs text-muted-foreground">
                    Include only if all subdomains support HTTPS.
                  </p>
                </div>
                <Switch
                  className="shrink-0 mt-0.5"
                  checked={currentState.hstsIncludeSubdomains}
                  onCheckedChange={(checked) =>
                    setState({ hstsIncludeSubdomains: checked })
                  }
                  aria-label="HSTS includeSubDomains"
                />
              </div>

              <div className="flex items-start justify-between gap-3 rounded-md border px-3 py-2">
                <div className="min-w-0 space-y-0.5">
                  <p className="text-sm font-medium">preload</p>
                  <p className="text-xs text-muted-foreground">
                    Only if you plan to submit to the preload list.
                  </p>
                </div>
                <Switch
                  className="shrink-0 mt-0.5"
                  checked={currentState.hstsPreload}
                  onCheckedChange={(checked) =>
                    setState({ hstsPreload: checked })
                  }
                  aria-label="HSTS preload"
                />
              </div>
            </div>
          ) : null}
        </div>

        {/* nosniff */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-0.5">
            <p className="text-sm font-medium">
              X-Content-Type-Options: nosniff
            </p>
            <p className="text-xs text-muted-foreground">
              Prevents MIME-type sniffing (safe default).
            </p>
          </div>
          <Switch
            className="shrink-0 mt-0.5"
            checked={currentState.enableNosniff}
            onCheckedChange={(checked) => setState({ enableNosniff: checked })}
            aria-label="Enable nosniff"
          />
        </div>

        {/* X-Frame-Options */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-0.5">
              <p className="text-sm font-medium">X-Frame-Options</p>
              <p className="text-xs text-muted-foreground">
                Protects against clickjacking by controlling if your site can be
                embedded in an iframe.
              </p>
            </div>
            <Switch
              className="shrink-0 mt-0.5"
              checked={currentState.enableFrameOptions}
              onCheckedChange={(checked) =>
                setState({ enableFrameOptions: checked })
              }
              aria-label="Enable X-Frame-Options"
            />
          </div>

          {currentState.enableFrameOptions ? (
            <div className="space-y-2">
              <FieldLabel
                htmlFor="frameOptions"
                label="X-Frame-Options value"
                help="SAMEORIGIN allows embedding by your own site only. DENY blocks all framing."
              />
              <Select
                value={currentState.frameOptions}
                onValueChange={(value: FrameOptions) =>
                  setState({ frameOptions: value })
                }
              >
                <SelectTrigger id="frameOptions" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sameorigin">
                    SAMEORIGIN (recommended)
                  </SelectItem>
                  <SelectItem value="deny">DENY</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ) : null}
        </div>

        {/* Referrer-Policy */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-0.5">
              <p className="text-sm font-medium">Referrer-Policy</p>
              <p className="text-xs text-muted-foreground">
                Controls how much referrer information is sent on navigation.
              </p>
            </div>
            <Switch
              className="shrink-0 mt-0.5"
              checked={currentState.enableReferrerPolicy}
              onCheckedChange={(checked) =>
                setState({ enableReferrerPolicy: checked })
              }
              aria-label="Enable Referrer-Policy"
            />
          </div>

          {currentState.enableReferrerPolicy ? (
            <div className="space-y-2">
              <FieldLabel
                htmlFor="referrerPolicy"
                label="Referrer-Policy value"
                help="strict-origin-when-cross-origin is a common safe default: full referrer on same-origin, only origin on cross-origin."
              />
              <Select
                value={currentState.referrerPolicy}
                onValueChange={(value: ReferrerPolicy) =>
                  setState({ referrerPolicy: value })
                }
              >
                <SelectTrigger id="referrerPolicy" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="strict-origin-when-cross-origin">
                    strict-origin-when-cross-origin (recommended)
                  </SelectItem>
                  <SelectItem value="no-referrer">no-referrer</SelectItem>
                  <SelectItem value="same-origin">same-origin</SelectItem>
                  <SelectItem value="origin">origin</SelectItem>
                  <SelectItem value="origin-when-cross-origin">
                    origin-when-cross-origin
                  </SelectItem>
                  <SelectItem value="strict-origin">strict-origin</SelectItem>
                  <SelectItem value="no-referrer-when-downgrade">
                    no-referrer-when-downgrade
                  </SelectItem>
                  <SelectItem value="unsafe-url">unsafe-url</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ) : null}
        </div>
      </div>

      <div className="rounded-lg border p-4 space-y-4">
        <p className="text-sm font-semibold">
          Cross-origin hardening (optional)
        </p>
        <p className="text-xs text-muted-foreground">
          These can improve isolation, but can break embeds, popups, or loading
          third-party resources. Enable only if you understand the impact.
        </p>

        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-0.5">
              <p className="text-sm font-medium">Cross-Origin-Opener-Policy</p>
              <p className="text-xs text-muted-foreground">
                Isolates browsing context (can affect popups and OAuth flows).
              </p>
            </div>
            <Switch
              className="shrink-0 mt-0.5"
              checked={currentState.enableCoop}
              onCheckedChange={(checked) => setState({ enableCoop: checked })}
              aria-label="Enable COOP"
            />
          </div>

          {currentState.enableCoop ? (
            <div className="space-y-2">
              <FieldLabel
                htmlFor="coop"
                label="COOP value"
                help="same-origin is strictest. same-origin-allow-popups is a common compromise when you need popups."
              />
              <Select
                value={currentState.coop}
                onValueChange={(value: CrossOriginOpenerPolicy) =>
                  setState({ coop: value })
                }
              >
                <SelectTrigger id="coop" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="same-origin">same-origin</SelectItem>
                  <SelectItem value="same-origin-allow-popups">
                    same-origin-allow-popups
                  </SelectItem>
                  <SelectItem value="unsafe-none">unsafe-none</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ) : null}
        </div>

        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-0.5">
              <p className="text-sm font-medium">
                Cross-Origin-Resource-Policy
              </p>
              <p className="text-xs text-muted-foreground">
                Restricts who can load your resources (images/scripts/fonts).
              </p>
            </div>
            <Switch
              className="shrink-0 mt-0.5"
              checked={currentState.enableCorp}
              onCheckedChange={(checked) => setState({ enableCorp: checked })}
              aria-label="Enable CORP"
            />
          </div>

          {currentState.enableCorp ? (
            <div className="space-y-2">
              <FieldLabel
                htmlFor="corp"
                label="CORP value"
                help="same-site allows your own site/subdomains. same-origin is stricter. cross-origin is permissive."
              />
              <Select
                value={currentState.corp}
                onValueChange={(value: CrossOriginResourcePolicy) =>
                  setState({ corp: value })
                }
              >
                <SelectTrigger id="corp" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="same-site">same-site</SelectItem>
                  <SelectItem value="same-origin">same-origin</SelectItem>
                  <SelectItem value="cross-origin">cross-origin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

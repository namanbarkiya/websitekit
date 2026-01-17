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
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ToolProps } from "@/lib/utils/tool-registry";

import { generateCookieConsentOutput } from "./lib/generator";
import {
  DEFAULT_STATE,
  DEFAULT_CATEGORIES,
  type CookieConsentState,
  type CookieCategory,
  type ConsentStyle,
  type Position,
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

export function CookieConsentComponent({
  assets,
  state,
  setState,
  onGenerate,
  setHeaderGenerate,
}: ToolProps) {
  const currentState = useMemo(
    () => ({
      ...DEFAULT_STATE,
      ...(state as Partial<CookieConsentState>),
      cookieCategories:
        (state as Partial<CookieConsentState>)?.cookieCategories ||
        DEFAULT_STATE.cookieCategories,
    }),
    [state]
  );

  // Initialize from assets
  useEffect(() => {
    const updates: Partial<CookieConsentState> = {};
    if (!currentState.companyName && assets.name) {
      updates.companyName = assets.name;
    }
    if (!currentState.privacyPolicyUrl && assets.domain) {
      const url = assets.domain.startsWith("http")
        ? assets.domain
        : `https://${assets.domain}`;
      updates.privacyPolicyUrl = `${url}/privacy-policy`;
    }
    if (Object.keys(updates).length > 0) {
      setState(updates);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assets.name, assets.domain, setState]);

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
    const output = generateCookieConsentOutput(currentState);
    onGenerate(output);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewKey]);

  const handleGenerate = useCallback(() => {
    const output = generateCookieConsentOutput(currentStateRef.current);
    onGenerate(output);
  }, [onGenerate]);

  // Register header generate button
  useEffect(() => {
    if (!setHeaderGenerate) return;
    setHeaderGenerate({ onGenerate: handleGenerate, label: "Generate" });
    return () => setHeaderGenerate(null);
  }, [handleGenerate, setHeaderGenerate]);

  const addCookieCategory = () => {
    const newCategory: CookieCategory = {
      id: `category-${Date.now()}`,
      name: "",
      description: "",
      required: false,
      enabledByDefault: false,
      scriptExamples: "",
    };
    setState({
      cookieCategories: [...currentState.cookieCategories, newCategory],
    });
  };

  const removeCookieCategory = (id: string) => {
    setState({
      cookieCategories: currentState.cookieCategories.filter(
        (cat) => cat.id !== id
      ),
    });
  };

  const updateCookieCategory = (id: string, updates: Partial<CookieCategory>) => {
    setState({
      cookieCategories: currentState.cookieCategories.map((cat) =>
        cat.id === id ? { ...cat, ...updates } : cat
      ),
    });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground space-y-2">
        <p className="font-medium text-foreground">Value Proposition</p>
        <p>
          This tool generates a complete, GDPR-compliant cookie consent solution with:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>Working implementation</strong> - Ready to use code, not just a template
          </li>
          <li>
            <strong>Category-based consent</strong> - Users can choose which cookies to accept
          </li>
          <li>
            <strong>Analytics integration</strong> - Pre-configured for Google Analytics or Plausible
          </li>
          <li>
            <strong>Settings modal</strong> - Built-in cookie preferences management
          </li>
          <li>
            <strong>Explicit consent</strong> - Only loads scripts after user acceptance
          </li>
        </ul>
      </div>

      <div className="rounded-lg border p-4 space-y-4">
        <h3 className="font-medium">Basic Information</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <FieldLabel
              htmlFor="companyName"
              label="Company Name"
              help="Your company or organization name"
            />
            <Input
              id="companyName"
              value={currentState.companyName}
              onChange={(e) => setState({ companyName: e.target.value })}
              placeholder="Acme Inc."
            />
          </div>
          <div className="space-y-2">
            <FieldLabel
              htmlFor="message"
              label="Consent Message"
              help="Message shown to users about cookie usage"
            />
            <Textarea
              id="message"
              value={currentState.message}
              onChange={(e) => setState({ message: e.target.value })}
              rows={2}
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg border p-4 space-y-4">
        <h3 className="font-medium">Appearance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <FieldLabel
              htmlFor="style"
              label="Style"
              help="Consent banner style"
            />
            <Select
              value={currentState.style}
              onValueChange={(value: ConsentStyle) =>
                setState({ style: value })
              }
            >
              <SelectTrigger id="style">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="banner">Banner</SelectItem>
                <SelectItem value="modal">Modal</SelectItem>
                <SelectItem value="inline">Inline</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <FieldLabel
              htmlFor="position"
              label="Position"
              help="Where to display the consent banner"
            />
            <Select
              value={currentState.position}
              onValueChange={(value: Position) =>
                setState({ position: value })
              }
            >
              <SelectTrigger id="position">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="top">Top</SelectItem>
                <SelectItem value="bottom">Bottom</SelectItem>
                <SelectItem value="top-left">Top Left</SelectItem>
                <SelectItem value="top-right">Top Right</SelectItem>
                <SelectItem value="bottom-left">Bottom Left</SelectItem>
                <SelectItem value="bottom-right">Bottom Right</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <FieldLabel
              htmlFor="theme"
              label="Theme"
              help="Color theme for the consent banner"
            />
            <Select
              value={currentState.theme}
              onValueChange={(value: "light" | "dark" | "auto") =>
                setState({ theme: value })
              }
            >
              <SelectTrigger id="theme">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="auto">Auto (system)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="rounded-lg border p-4 space-y-4">
        <h3 className="font-medium">Buttons</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <FieldLabel
              htmlFor="acceptButtonText"
              label="Accept Button Text"
              help="Text for the accept button"
            />
            <Input
              id="acceptButtonText"
              value={currentState.acceptButtonText}
              onChange={(e) =>
                setState({ acceptButtonText: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <FieldLabel
              htmlFor="declineButtonText"
              label="Decline Button Text"
              help="Text for the decline button"
            />
            <Input
              id="declineButtonText"
              value={currentState.declineButtonText}
              onChange={(e) =>
                setState({ declineButtonText: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <FieldLabel
              htmlFor="settingsButtonText"
              label="Settings Button Text"
              help="Text for the settings button"
            />
            <Input
              id="settingsButtonText"
              value={currentState.settingsButtonText}
              onChange={(e) =>
                setState({ settingsButtonText: e.target.value })
              }
            />
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="showDeclineButton">Show Decline Button</Label>
              <p className="text-xs text-muted-foreground">
                Allow users to decline cookies (required for GDPR)
              </p>
            </div>
            <Switch
              id="showDeclineButton"
              checked={currentState.showDeclineButton}
              onCheckedChange={(checked) =>
                setState({ showDeclineButton: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="showSettingsButton">Show Settings Button</Label>
              <p className="text-xs text-muted-foreground">
                Enable cookie category selection (recommended)
              </p>
            </div>
            <Switch
              id="showSettingsButton"
              checked={currentState.showSettingsButton}
              onCheckedChange={(checked) =>
                setState({ showSettingsButton: checked })
              }
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg border p-4 space-y-4">
        <h3 className="font-medium">Cookie Categories</h3>
        <p className="text-sm text-muted-foreground">
          Define cookie categories users can accept or decline. Each category can have custom scripts that only load when accepted.
        </p>
        <div className="space-y-3">
          {currentState.cookieCategories.map((category) => (
            <div key={category.id} className="rounded-lg border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label>{category.name || "Unnamed Category"}</Label>
                  {category.required && (
                    <span className="text-xs bg-muted px-2 py-0.5 rounded">
                      Required
                    </span>
                  )}
                </div>
                {!category.required && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCookieCategory(category.id)}
                  >
                    <TrashIcon className="size-4" />
                  </Button>
                )}
              </div>

              <div className="space-y-3">
                <div className="space-y-2">
                  <FieldLabel
                    htmlFor={`cat-name-${category.id}`}
                    label="Category Name"
                    help="Display name for this cookie category"
                  />
                  <Input
                    id={`cat-name-${category.id}`}
                    value={category.name}
                    onChange={(e) =>
                      updateCookieCategory(category.id, { name: e.target.value })
                    }
                    placeholder="Analytics"
                  />
                </div>
                <div className="space-y-2">
                  <FieldLabel
                    htmlFor={`cat-desc-${category.id}`}
                    label="Description"
                    help="Explain what this category is used for"
                  />
                  <Textarea
                    id={`cat-desc-${category.id}`}
                    value={category.description}
                    onChange={(e) =>
                      updateCookieCategory(category.id, {
                        description: e.target.value,
                      })
                    }
                    rows={2}
                    placeholder="Help us understand how visitors interact with our website..."
                  />
                </div>
                {!category.required && (
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor={`cat-enabled-${category.id}`}>
                        Enabled by Default
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Pre-check this category (still requires user action to accept)
                      </p>
                    </div>
                    <Switch
                      id={`cat-enabled-${category.id}`}
                      checked={category.enabledByDefault}
                      onCheckedChange={(checked) =>
                        updateCookieCategory(category.id, {
                          enabledByDefault: checked,
                        })
                      }
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <FieldLabel
                    htmlFor={`cat-scripts-${category.id}`}
                    label="Script Examples"
                    help="Example code that will run when this category is accepted"
                    optional
                  />
                  <Textarea
                    id={`cat-scripts-${category.id}`}
                    value={category.scriptExamples}
                    onChange={(e) =>
                      updateCookieCategory(category.id, {
                        scriptExamples: e.target.value,
                      })
                    }
                    rows={3}
                    className="font-mono text-xs"
                    placeholder="// Example: gtag('config', 'GA_MEASUREMENT_ID');"
                  />
                </div>
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={addCookieCategory} className="w-full">
            <PlusIcon className="size-4 mr-2" />
            Add Cookie Category
          </Button>
        </div>
      </div>

      <div className="rounded-lg border p-4 space-y-4">
        <h3 className="font-medium">Analytics Integration</h3>
        <p className="text-sm text-muted-foreground">
          Pre-configure common analytics providers. Scripts will only load after user consent.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <FieldLabel
              htmlFor="analyticsProvider"
              label="Analytics Provider"
              help="Select your analytics provider for automatic integration"
              optional
            />
            <Select
              value={currentState.analyticsProvider || "none"}
              onValueChange={(value: "google-analytics" | "plausible" | "custom" | "none") =>
                setState({ analyticsProvider: value })
              }
            >
              <SelectTrigger id="analyticsProvider">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None / Custom</SelectItem>
                <SelectItem value="google-analytics">Google Analytics</SelectItem>
                <SelectItem value="plausible">Plausible Analytics</SelectItem>
                <SelectItem value="custom">Custom Implementation</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {(currentState.analyticsProvider === "google-analytics" ||
            currentState.analyticsProvider === "plausible") && (
            <div className="space-y-2">
              <FieldLabel
                htmlFor="analyticsId"
                label={
                  currentState.analyticsProvider === "google-analytics"
                    ? "Google Analytics ID"
                    : "Plausible Domain"
                }
                help={
                  currentState.analyticsProvider === "google-analytics"
                    ? "Your GA4 Measurement ID (e.g., G-XXXXXXXXXX)"
                    : "Your Plausible domain (e.g., example.com)"
                }
              />
              <Input
                id="analyticsId"
                value={currentState.analyticsId || ""}
                onChange={(e) => setState({ analyticsId: e.target.value })}
                placeholder={
                  currentState.analyticsProvider === "google-analytics"
                    ? "G-XXXXXXXXXX"
                    : "example.com"
                }
              />
            </div>
          )}
        </div>
      </div>

      <div className="rounded-lg border p-4 space-y-4">
        <h3 className="font-medium">Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <FieldLabel
              htmlFor="privacyPolicyUrl"
              label="Privacy Policy URL"
              help="Link to your privacy policy"
              optional
            />
            <Input
              id="privacyPolicyUrl"
              value={currentState.privacyPolicyUrl}
              onChange={(e) => setState({ privacyPolicyUrl: e.target.value })}
              placeholder="https://example.com/privacy-policy"
            />
          </div>
          <div className="space-y-2">
            <FieldLabel
              htmlFor="cookiePolicyUrl"
              label="Cookie Policy URL"
              help="Link to your cookie policy (if separate)"
              optional
            />
            <Input
              id="cookiePolicyUrl"
              value={currentState.cookiePolicyUrl}
              onChange={(e) => setState({ cookiePolicyUrl: e.target.value })}
              placeholder="https://example.com/cookie-policy"
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg border p-4 space-y-4">
        <h3 className="font-medium">Compliance</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="gdprCompliant">GDPR Compliant</Label>
              <p className="text-xs text-muted-foreground">
                Include GDPR-required features (explicit consent, etc.)
              </p>
            </div>
            <Switch
              id="gdprCompliant"
              checked={currentState.gdprCompliant}
              onCheckedChange={(checked) =>
                setState({ gdprCompliant: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="requireExplicitConsent">
                Require Explicit Consent
              </Label>
              <p className="text-xs text-muted-foreground">
                Don't load tracking scripts until user accepts (GDPR best practice)
              </p>
            </div>
            <Switch
              id="requireExplicitConsent"
              checked={currentState.requireExplicitConsent}
              onCheckedChange={(checked) =>
                setState({ requireExplicitConsent: checked })
              }
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 p-4 text-sm space-y-2">
        <p className="font-medium text-blue-900 dark:text-blue-100">
          💡 How to Use
        </p>
        <ol className="list-decimal pl-5 space-y-1 text-blue-800 dark:text-blue-200">
          <li>Copy the generated CSS, HTML, and JavaScript code</li>
          <li>Place CSS in your <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">head</code> section</li>
          <li>Place HTML and JavaScript before closing <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">body</code> tag</li>
          <li>Customize the analytics initialization code if needed</li>
          <li>Test by clearing cookies and refreshing - the banner should appear</li>
          <li>Verify analytics only loads after user accepts cookies</li>
        </ol>
      </div>
    </div>
  );
}

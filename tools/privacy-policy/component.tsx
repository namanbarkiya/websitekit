"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { InfoIcon, PlusIcon, TrashIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ToolProps } from "@/lib/utils/tool-registry";

import { generatePrivacyPolicyOutput } from "./lib/generator";
import { DEFAULT_STATE, type PrivacyPolicyState } from "./types";

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

export function PrivacyPolicyComponent({
  assets,
  state,
  setState,
  onGenerate,
  setHeaderGenerate,
}: ToolProps) {
  const currentState = useMemo(
    () => ({ ...DEFAULT_STATE, ...(state as Partial<PrivacyPolicyState>) }),
    [state]
  );

  // Initialize from assets
  useEffect(() => {
    const updates: Partial<PrivacyPolicyState> = {};
    if (!currentState.companyName && assets.name) {
      updates.companyName = assets.name;
    }
    if (!currentState.websiteUrl && assets.domain) {
      const url = assets.domain.startsWith("http")
        ? assets.domain
        : `https://${assets.domain}`;
      updates.websiteUrl = url;
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
    const output = generatePrivacyPolicyOutput(currentState);
    onGenerate(output);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewKey]);

  const handleGenerate = useCallback(() => {
    const output = generatePrivacyPolicyOutput(currentStateRef.current);
    onGenerate(output);
  }, [onGenerate]);

  // Register header generate button
  useEffect(() => {
    if (!setHeaderGenerate) return;
    setHeaderGenerate({ onGenerate: handleGenerate, label: "Generate" });
    return () => setHeaderGenerate(null);
  }, [handleGenerate, setHeaderGenerate]);

  const addDataCollected = () => {
    setState({
      dataCollected: [...currentState.dataCollected, ""],
    });
  };

  const removeDataCollected = (index: number) => {
    setState({
      dataCollected: currentState.dataCollected.filter((_, i) => i !== index),
    });
  };

  const updateDataCollected = (index: number, value: string) => {
    const newData = [...currentState.dataCollected];
    newData[index] = value;
    setState({ dataCollected: newData });
  };

  const addDataUsage = () => {
    setState({
      dataUsage: [...currentState.dataUsage, ""],
    });
  };

  const removeDataUsage = (index: number) => {
    setState({
      dataUsage: currentState.dataUsage.filter((_, i) => i !== index),
    });
  };

  const updateDataUsage = (index: number, value: string) => {
    const newData = [...currentState.dataUsage];
    newData[index] = value;
    setState({ dataUsage: newData });
  };

  const addUserRight = () => {
    setState({
      userRights: [...currentState.userRights, ""],
    });
  };

  const removeUserRight = (index: number) => {
    setState({
      userRights: currentState.userRights.filter((_, i) => i !== index),
    });
  };

  const updateUserRight = (index: number, value: string) => {
    const newRights = [...currentState.userRights];
    newRights[index] = value;
    setState({ userRights: newRights });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
        <p className="font-medium text-foreground mb-2">Legal Disclaimer</p>
        <p>
          This tool generates a privacy policy template. It is not legal advice.
          Consult with a lawyer to ensure compliance with applicable laws in your
          jurisdiction.
        </p>
      </div>

      <div className="rounded-lg border p-4 space-y-4">
        <h3 className="font-medium">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              htmlFor="websiteUrl"
              label="Website URL"
              help="Your website URL"
            />
            <Input
              id="websiteUrl"
              value={currentState.websiteUrl}
              onChange={(e) => setState({ websiteUrl: e.target.value })}
              placeholder="https://example.com"
            />
          </div>
          <div className="space-y-2">
            <FieldLabel
              htmlFor="contactEmail"
              label="Contact Email"
              help="Email address for privacy inquiries"
            />
            <Input
              id="contactEmail"
              type="email"
              value={currentState.contactEmail}
              onChange={(e) => setState({ contactEmail: e.target.value })}
              placeholder="privacy@example.com"
            />
          </div>
          <div className="space-y-2">
            <FieldLabel
              htmlFor="effectiveDate"
              label="Effective Date"
              help="When this policy becomes effective"
            />
            <Input
              id="effectiveDate"
              type="date"
              value={currentState.effectiveDate}
              onChange={(e) => setState({ effectiveDate: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg border p-4 space-y-4">
        <h3 className="font-medium">Data Collection</h3>
        <div className="space-y-2">
          <Label>Types of Data Collected</Label>
          {currentState.dataCollected.map((item, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={item}
                onChange={(e) => updateDataCollected(index, e.target.value)}
                placeholder="e.g., Name, Email address"
              />
              {currentState.dataCollected.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeDataCollected(index)}
                >
                  <TrashIcon className="size-4" />
                </Button>
              )}
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addDataCollected}>
            <PlusIcon className="size-4 mr-2" />
            Add Data Type
          </Button>
        </div>
      </div>

      <div className="rounded-lg border p-4 space-y-4">
        <h3 className="font-medium">Data Usage</h3>
        <div className="space-y-2">
          <Label>How We Use Your Data</Label>
          {currentState.dataUsage.map((item, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={item}
                onChange={(e) => updateDataUsage(index, e.target.value)}
                placeholder="e.g., To provide and maintain our service"
              />
              {currentState.dataUsage.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeDataUsage(index)}
                >
                  <TrashIcon className="size-4" />
                </Button>
              )}
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addDataUsage}>
            <PlusIcon className="size-4 mr-2" />
            Add Usage Purpose
          </Button>
        </div>
      </div>

      <div className="rounded-lg border p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="dataSharing">Share Data with Third Parties</Label>
            <p className="text-xs text-muted-foreground">
              Do you share user data with third parties?
            </p>
          </div>
          <Switch
            id="dataSharing"
            checked={currentState.dataSharing}
            onCheckedChange={(checked) => setState({ dataSharing: checked })}
          />
        </div>
        {currentState.dataSharing && (
          <div className="space-y-2">
            <FieldLabel
              htmlFor="dataSharingDetails"
              label="Sharing Details"
              help="Describe how and with whom you share data"
            />
            <Textarea
              id="dataSharingDetails"
              value={currentState.dataSharingDetails}
              onChange={(e) =>
                setState({ dataSharingDetails: e.target.value })
              }
              rows={3}
            />
          </div>
        )}
      </div>

      <div className="rounded-lg border p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="cookiesUsed">Use Cookies</Label>
            <p className="text-xs text-muted-foreground">
              Does your website use cookies?
            </p>
          </div>
          <Switch
            id="cookiesUsed"
            checked={currentState.cookiesUsed}
            onCheckedChange={(checked) => setState({ cookiesUsed: checked })}
          />
        </div>
        {currentState.cookiesUsed && (
          <div className="space-y-2">
            <FieldLabel
              htmlFor="cookiesDetails"
              label="Cookie Details"
              help="Describe how you use cookies"
            />
            <Textarea
              id="cookiesDetails"
              value={currentState.cookiesDetails}
              onChange={(e) => setState({ cookiesDetails: e.target.value })}
              rows={2}
            />
          </div>
        )}
      </div>

      <div className="rounded-lg border p-4 space-y-4">
        <h3 className="font-medium">User Rights</h3>
        <div className="space-y-2">
          <Label>Rights Users Have</Label>
          {currentState.userRights.map((right, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={right}
                onChange={(e) => updateUserRight(index, e.target.value)}
                placeholder="e.g., Right to access your personal data"
              />
              {currentState.userRights.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeUserRight(index)}
                >
                  <TrashIcon className="size-4" />
                </Button>
              )}
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addUserRight}>
            <PlusIcon className="size-4 mr-2" />
            Add User Right
          </Button>
        </div>
      </div>

      <div className="rounded-lg border p-4 space-y-4">
        <h3 className="font-medium">Compliance</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="gdprCompliant">GDPR Compliant</Label>
              <p className="text-xs text-muted-foreground">
                Include GDPR-specific sections
              </p>
            </div>
            <Switch
              id="gdprCompliant"
              checked={currentState.gdprCompliant}
              onCheckedChange={(checked) => setState({ gdprCompliant: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="ccpaCompliant">CCPA Compliant</Label>
              <p className="text-xs text-muted-foreground">
                Include CCPA-specific sections
              </p>
            </div>
            <Switch
              id="ccpaCompliant"
              checked={currentState.ccpaCompliant}
              onCheckedChange={(checked) => setState({ ccpaCompliant: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="childrenProtection">Children's Privacy</Label>
              <p className="text-xs text-muted-foreground">
                Include children's privacy protection section
              </p>
            </div>
            <Switch
              id="childrenProtection"
              checked={currentState.childrenProtection}
              onCheckedChange={(checked) =>
                setState({ childrenProtection: checked })
              }
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg border p-4 space-y-4">
        <h3 className="font-medium">Additional Information</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <FieldLabel
              htmlFor="dataRetention"
              label="Data Retention"
              help="How long you retain user data"
            />
            <Textarea
              id="dataRetention"
              value={currentState.dataRetention}
              onChange={(e) => setState({ dataRetention: e.target.value })}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <FieldLabel
              htmlFor="securityMeasures"
              label="Security Measures"
              help="How you protect user data"
            />
            <Textarea
              id="securityMeasures"
              value={currentState.securityMeasures}
              onChange={(e) => setState({ securityMeasures: e.target.value })}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <FieldLabel
              htmlFor="thirdPartyServices"
              label="Third-Party Services"
              help="Third-party services you use (analytics, etc.)"
              optional
            />
            <Textarea
              id="thirdPartyServices"
              value={currentState.thirdPartyServices}
              onChange={(e) => setState({ thirdPartyServices: e.target.value })}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <FieldLabel
              htmlFor="changesPolicy"
              label="Changes Policy"
              help="How you notify users of policy changes"
            />
            <Textarea
              id="changesPolicy"
              value={currentState.changesPolicy}
              onChange={(e) => setState({ changesPolicy: e.target.value })}
              rows={2}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

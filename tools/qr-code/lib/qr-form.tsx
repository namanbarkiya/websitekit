"use client";

import { ChevronDownIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { QRCodeState } from "../types";

interface QRFormProps {
  state: QRCodeState;
  onStateChange: (updates: Partial<QRCodeState>) => void;
  optionsOpen: boolean;
  onOptionsOpenChange: (open: boolean) => void;
}

export function QRForm({
  state,
  onStateChange,
  optionsOpen,
  onOptionsOpenChange,
}: QRFormProps) {
  return (
    <div className="space-y-4">
      {/* Content Input */}
      <div className="space-y-2">
        <Label htmlFor="content">Content (URL or Text)</Label>
        <Input
          id="content"
          value={state.content}
          onChange={(e) => onStateChange({ content: e.target.value })}
          placeholder="https://example.com or any text"
        />
      </div>

      <Collapsible
        open={optionsOpen}
        onOpenChange={onOptionsOpenChange}
        className="rounded-lg border"
      >
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="flex w-full items-center justify-between px-4 py-3 text-left"
          >
            <span className="text-sm font-semibold">Options</span>
            <ChevronDownIcon
              className={[
                "size-4 text-muted-foreground transition-transform",
                optionsOpen ? "rotate-180" : "",
              ].join(" ")}
            />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-4 pb-4 space-y-4">
            {/* Size */}
            <div className="space-y-2">
              <Label htmlFor="size">Size (pixels)</Label>
              <Input
                id="size"
                type="number"
                min="100"
                max="1000"
                step="10"
                value={state.size}
                onChange={(e) =>
                  onStateChange({
                    size: parseInt(e.target.value) || 256,
                  })
                }
              />
            </div>

            {/* Margin */}
            <div className="space-y-2">
              <Label htmlFor="margin">Margin</Label>
              <Input
                id="margin"
                type="number"
                min="0"
                max="10"
                value={state.margin}
                onChange={(e) =>
                  onStateChange({
                    margin: parseInt(e.target.value) || 4,
                  })
                }
              />
            </div>

            {/* Error Correction Level */}
            <div className="space-y-2">
              <Label htmlFor="errorCorrection">Error Correction Level</Label>
              <Select
                value={state.errorCorrectionLevel}
                onValueChange={(value: "L" | "M" | "Q" | "H") =>
                  onStateChange({ errorCorrectionLevel: value })
                }
              >
                <SelectTrigger id="errorCorrection">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="L">L (Low - ~7%)</SelectItem>
                  <SelectItem value="M">M (Medium - ~15%)</SelectItem>
                  <SelectItem value="Q">Q (Quartile - ~25%)</SelectItem>
                  <SelectItem value="H">H (High - ~30%)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Colors */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="colorDark">Dark Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="colorDark"
                    type="color"
                    value={state.colorDark}
                    onChange={(e) =>
                      onStateChange({ colorDark: e.target.value })
                    }
                    className="w-16 h-10"
                  />
                  <Input
                    type="text"
                    value={state.colorDark}
                    onChange={(e) =>
                      onStateChange({ colorDark: e.target.value })
                    }
                    placeholder="#000000"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="colorLight">Light Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="colorLight"
                    type="color"
                    value={state.colorLight}
                    onChange={(e) =>
                      onStateChange({ colorLight: e.target.value })
                    }
                    className="w-16 h-10"
                  />
                  <Input
                    type="text"
                    value={state.colorLight}
                    onChange={(e) =>
                      onStateChange({ colorLight: e.target.value })
                    }
                    placeholder="#FFFFFF"
                  />
                </div>
              </div>
            </div>

            {/* Format */}
            <div className="space-y-2">
              <Label htmlFor="format">Export Format</Label>
              <Select
                value={state.format}
                onValueChange={(value: "svg" | "png") =>
                  onStateChange({ format: value })
                }
              >
                <SelectTrigger id="format">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="svg">SVG (Scalable Vector)</SelectItem>
                  <SelectItem value="png">PNG (Raster Image)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

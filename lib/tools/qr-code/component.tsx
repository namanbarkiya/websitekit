"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import QRCode from "qrcode";
import type { ToolProps } from "@/lib/utils/tool-registry";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface QRCodeState {
  content: string;
  size: number;
  margin: number;
  errorCorrectionLevel: "L" | "M" | "Q" | "H";
  colorDark: string;
  colorLight: string;
  format: "svg" | "png";
}

const DEFAULT_STATE: QRCodeState = {
  content: "",
  size: 256,
  margin: 4,
  errorCorrectionLevel: "M",
  colorDark: "#000000",
  colorLight: "#FFFFFF",
  format: "svg",
};

export function QRCodeComponent({
  assets,
  state,
  setState,
  onGenerate,
  setHeaderGenerate,
}: ToolProps) {
  const [qrSvg, setQrSvg] = useState<string>("");
  const [qrPng, setQrPng] = useState<Blob | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(true);

  const currentState = (state as Partial<QRCodeState>) || {};
  const formState: QRCodeState = { ...DEFAULT_STATE, ...currentState };
  const formStateRef = useRef(formState);
  const qrSvgRef = useRef(qrSvg);
  const qrPngRef = useRef(qrPng);

  useEffect(() => {
    formStateRef.current = formState;
  }, [formState]);
  useEffect(() => {
    qrSvgRef.current = qrSvg;
  }, [qrSvg]);
  useEffect(() => {
    qrPngRef.current = qrPng;
  }, [qrPng]);

  // Push a live preview + latest file to the right panel
  useEffect(() => {
    if (!formState.content.trim()) return;
    if (!qrSvg) return; // preview is always SVG

    const previewHtml = `<div style="display:flex;justify-content:center;align-items:center;padding:2rem;">${qrSvg}</div>`;

    if (formState.format === "svg") {
      const svgBlob = new Blob([qrSvg], { type: "image/svg+xml" });
      onGenerate({
        type: "files",
        files: [
          {
            filename: "qr-code.svg",
            content: svgBlob,
            mimeType: "image/svg+xml",
          },
        ],
        preview: previewHtml,
      });
      return;
    }

    // PNG export: wait until blob is ready
    if (!qrPng) return;
    onGenerate({
      type: "files",
      files: [
        {
          filename: "qr-code.png",
          content: qrPng,
          mimeType: "image/png",
        },
      ],
      preview: previewHtml,
    });
  }, [formState.content, formState.format, onGenerate, qrPng, qrSvg]);

  // Memoize state values for effect dependencies
  const stateKey = useMemo(
    () =>
      `${formState.content}|${formState.size}|${formState.margin}|${formState.errorCorrectionLevel}|${formState.colorDark}|${formState.colorLight}`,
    [
      formState.content,
      formState.size,
      formState.margin,
      formState.errorCorrectionLevel,
      formState.colorDark,
      formState.colorLight,
    ]
  );

  // Initialize from assets if available
  useEffect(() => {
    const currentState = (state as Partial<QRCodeState>) || {};
    const currentContent = currentState.content || "";
    if (!currentContent && assets.domain) {
      setState({
        ...DEFAULT_STATE,
        ...currentState,
        content: assets.domain.startsWith("http")
          ? assets.domain
          : `https://${assets.domain}`,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assets.domain]);

  // Generate QR code whenever state changes
  useEffect(() => {
    if (!formState.content.trim()) {
      setQrSvg("");
      setQrPng(null);
      return;
    }

    let cancelled = false;

    const generateQR = async () => {
      setIsGenerating(true);
      try {
        // Generate SVG
        const svgString = await QRCode.toString(formState.content, {
          type: "svg",
          width: formState.size,
          margin: formState.margin,
          color: {
            dark: formState.colorDark,
            light: formState.colorLight,
          },
          errorCorrectionLevel: formState.errorCorrectionLevel,
        });
        if (!cancelled) {
          setQrSvg(svgString);
        }

        // Generate PNG blob
        const canvas = document.createElement("canvas");
        await QRCode.toCanvas(canvas, formState.content, {
          width: formState.size,
          margin: formState.margin,
          color: {
            dark: formState.colorDark,
            light: formState.colorLight,
          },
          errorCorrectionLevel: formState.errorCorrectionLevel,
        });

        canvas.toBlob((blob) => {
          if (!cancelled) {
            setQrPng(blob);
            setIsGenerating(false);
          }
        }, "image/png");
      } catch (error) {
        console.error("Error generating QR code:", error);
        if (!cancelled) {
          setIsGenerating(false);
        }
      }
    };

    generateQR();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateKey]);

  const handleGenerate = useCallback(() => {
    const st = formStateRef.current;
    const svg = qrSvgRef.current;
    const png = qrPngRef.current;

    if (!st.content.trim()) return;

    const selectedFormat = st.format;
    const filename = `qr-code-${Date.now()}.${selectedFormat}`;

    // Always use SVG for preview
    const previewHtml = svg
      ? `<div style="display: flex; justify-content: center; align-items: center; padding: 2rem;">
           ${svg}
         </div>`
      : undefined;

    if (selectedFormat === "svg" && svg) {
      const svgBlob = new Blob([svg], { type: "image/svg+xml" });
      onGenerate({
        type: "files",
        files: [
          {
            filename,
            content: svgBlob,
            mimeType: "image/svg+xml",
          },
        ],
        preview: previewHtml,
      });
    } else if (selectedFormat === "png" && png) {
      onGenerate({
        type: "files",
        files: [
          {
            filename,
            content: png,
            mimeType: "image/png",
          },
        ],
        preview: previewHtml,
      });
    }
  }, [onGenerate]);

  // Register global header "Generate" button handler
  useEffect(() => {
    if (!setHeaderGenerate) return;
    const disabled = !formState.content.trim() || isGenerating;
    setHeaderGenerate({
      onGenerate: handleGenerate,
      disabled,
      label: "Generate",
    });
    return () => setHeaderGenerate(null);
  }, [formState.content, handleGenerate, isGenerating, setHeaderGenerate]);

  return (
    <div className="space-y-4">
      {/* Content Input */}
      <div className="space-y-2">
        <Label htmlFor="content">Content (URL or Text)</Label>
        <Input
          id="content"
          value={formState.content}
          onChange={(e) =>
            setState({ ...formState, content: e.target.value })
          }
          placeholder="https://example.com or any text"
        />
      </div>

      <Collapsible open={optionsOpen} onOpenChange={setOptionsOpen} className="rounded-lg border">
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
                value={formState.size}
                onChange={(e) =>
                  setState({
                    ...formState,
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
                value={formState.margin}
                onChange={(e) =>
                  setState({ ...formState, margin: parseInt(e.target.value) || 4 })
                }
              />
            </div>

            {/* Error Correction Level */}
            <div className="space-y-2">
              <Label htmlFor="errorCorrection">Error Correction Level</Label>
              <Select
                value={formState.errorCorrectionLevel}
                onValueChange={(value: "L" | "M" | "Q" | "H") =>
                  setState({ ...formState, errorCorrectionLevel: value })
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
                    value={formState.colorDark}
                    onChange={(e) =>
                      setState({ ...formState, colorDark: e.target.value })
                    }
                    className="w-16 h-10"
                  />
                  <Input
                    type="text"
                    value={formState.colorDark}
                    onChange={(e) =>
                      setState({ ...formState, colorDark: e.target.value })
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
                    value={formState.colorLight}
                    onChange={(e) =>
                      setState({ ...formState, colorLight: e.target.value })
                    }
                    className="w-16 h-10"
                  />
                  <Input
                    type="text"
                    value={formState.colorLight}
                    onChange={(e) =>
                      setState({ ...formState, colorLight: e.target.value })
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
                value={formState.format}
                onValueChange={(value: "svg" | "png") =>
                  setState({ ...formState, format: value })
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

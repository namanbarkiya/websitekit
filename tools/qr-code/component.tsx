"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { ToolProps } from "@/lib/utils/tool-registry";

import { QRForm } from "./lib/qr-form";
import { generateQRCode } from "./lib/qr-generator";
import { DEFAULT_STATE, type QRCodeState } from "./types";

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
        const result = await generateQRCode(formState);
        if (!cancelled) {
          setQrSvg(result.svg);
          setQrPng(result.png);
          setIsGenerating(false);
        }
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
    <QRForm
      state={formState}
      onStateChange={(updates) => setState({ ...formState, ...updates })}
      optionsOpen={optionsOpen}
      onOptionsOpenChange={setOptionsOpen}
    />
  );
}

"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
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
import type { ToolProps } from "@/lib/utils/tool-registry";

import { generateGradientOutput } from "./lib/generator";
import { DEFAULT_STATE, type GradientState, type GradientType } from "./types";

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function round(n: number): number {
  return Math.round(n);
}

function angleFromPointDeg(dx: number, dy: number): number {
  // Convert vector to CSS-ish degrees:
  // 0deg points up, 90deg points right.
  const rad = Math.atan2(dx, -dy);
  const deg = (rad * 180) / Math.PI;
  return (deg + 360) % 360;
}

function positionFromClientX(el: HTMLElement, clientX: number): number {
  const r = el.getBoundingClientRect();
  const x = clamp((clientX - r.left) / Math.max(1, r.width), 0, 1);
  return round(x * 100);
}

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

export function GradientComponent({
  assets,
  state,
  setState,
  onGenerate,
  setHeaderGenerate,
}: ToolProps) {
  const currentState = useMemo(
    () => ({ ...DEFAULT_STATE, ...(state as Partial<GradientState>) }),
    [state]
  );

  // Initialize from assets
  useEffect(() => {
    if (!assets.primaryColor) return;
    const stops = currentState.stops ?? DEFAULT_STATE.stops;
    if (!stops?.[0]?.color && assets.primaryColor) {
      setState({
        stops: [
          { color: assets.primaryColor, position: 0 },
          ...(stops.slice(1) || [{ color: "#a855f7", position: 100 }]),
        ],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assets.primaryColor]);

  const currentStateRef = useRef(currentState);
  useEffect(() => {
    currentStateRef.current = currentState;
  }, [currentState]);

  const previewKey = useMemo(
    () =>
      JSON.stringify({
        type: currentState.type,
        angle: currentState.angle,
        radialX: currentState.radialX,
        radialY: currentState.radialY,
        stops: currentState.stops,
        includeFallback: currentState.includeFallback,
      }),
    [
      currentState.angle,
      currentState.includeFallback,
      currentState.radialX,
      currentState.radialY,
      currentState.stops,
      currentState.type,
    ]
  );

  useEffect(() => {
    onGenerate(generateGradientOutput(currentState));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewKey]);

  const handleGenerate = useCallback(() => {
    onGenerate(generateGradientOutput(currentStateRef.current));
  }, [onGenerate]);

  useEffect(() => {
    if (!setHeaderGenerate) return;
    setHeaderGenerate({ onGenerate: handleGenerate, label: "Generate" });
    return () => setHeaderGenerate(null);
  }, [handleGenerate, setHeaderGenerate]);

  const stops = currentState.stops ?? DEFAULT_STATE.stops;

  const updateStop = (idx: number, updates: Partial<(typeof stops)[number]>) => {
    const next = stops.map((s, i) => (i === idx ? { ...s, ...updates } : s));
    setState({ stops: next });
  };

  const addStop = () => {
    const next = [...stops];
    if (next.length >= 5) return;
    const last = next[next.length - 1] ?? { color: "#000000", position: 100 };
    const prev = next[next.length - 2] ?? { color: "#ffffff", position: 0 };
    next.push({
      color: last.color,
      position: clamp(Math.round((prev.position + last.position) / 2), 0, 100),
    });
    setState({ stops: next });
  };

  const removeStop = (idx: number) => {
    if (stops.length <= 2) return;
    setState({ stops: stops.filter((_, i) => i !== idx) });
  };

  const previewDeclaration = useMemo(() => {
    const s = currentState;
    const normalizedStops = (s.stops ?? DEFAULT_STATE.stops)
      .map((st) => ({
        color: st.color || "#000000",
        position: clamp(Number.isFinite(st.position) ? st.position : 0, 0, 100),
      }))
      .sort((a, b) => a.position - b.position)
      .map((st) => `${st.color} ${st.position}%`)
      .join(", ");

    if (s.type === "radial") {
      return `radial-gradient(circle at ${clamp(s.radialX, 0, 100)}% ${clamp(
        s.radialY,
        0,
        100
      )}%, ${normalizedStops})`;
    }
    return `linear-gradient(${clamp(s.angle, 0, 360)}deg, ${normalizedStops})`;
  }, [currentState]);

  const previewRef = useRef<HTMLDivElement | null>(null);
  const stopBarRef = useRef<HTMLDivElement | null>(null);
  const draggingStopIdxRef = useRef<number | null>(null);
  const draggingModeRef = useRef<"angle" | "radial" | null>(null);

  const onPreviewPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!previewRef.current) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    if (currentState.type === "radial") {
      draggingModeRef.current = "radial";
      const r = previewRef.current.getBoundingClientRect();
      const x = clamp((e.clientX - r.left) / Math.max(1, r.width), 0, 1);
      const y = clamp((e.clientY - r.top) / Math.max(1, r.height), 0, 1);
      setState({ radialX: round(x * 100), radialY: round(y * 100) });
      return;
    }
    draggingModeRef.current = "angle";
    const r = previewRef.current.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    setState({ angle: round(angleFromPointDeg(dx, dy)) });
  };

  const onPreviewPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!previewRef.current) return;
    if (!draggingModeRef.current) return;

    if (draggingModeRef.current === "radial") {
      const r = previewRef.current.getBoundingClientRect();
      const x = clamp((e.clientX - r.left) / Math.max(1, r.width), 0, 1);
      const y = clamp((e.clientY - r.top) / Math.max(1, r.height), 0, 1);
      setState({ radialX: round(x * 100), radialY: round(y * 100) });
      return;
    }

    const r = previewRef.current.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    setState({ angle: round(angleFromPointDeg(dx, dy)) });
  };

  const onPreviewPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingModeRef.current = null;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const onStopHandlePointerDown = (
    e: React.PointerEvent<HTMLButtonElement>,
    idx: number
  ) => {
    e.stopPropagation();
    draggingStopIdxRef.current = idx;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    const bar = stopBarRef.current;
    if (!bar) return;
    updateStop(idx, { position: positionFromClientX(bar, e.clientX) });
  };

  const onStopHandlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const idx = draggingStopIdxRef.current;
    const bar = stopBarRef.current;
    if (idx === null || !bar) return;
    updateStop(idx, { position: positionFromClientX(bar, e.clientX) });
  };

  const onStopHandlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    draggingStopIdxRef.current = null;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border overflow-hidden">
        <div
          ref={previewRef}
          className="relative h-56 w-full touch-none"
          style={{ backgroundImage: previewDeclaration }}
          onPointerDown={onPreviewPointerDown}
          onPointerMove={onPreviewPointerMove}
          onPointerUp={onPreviewPointerUp}
          onPointerCancel={onPreviewPointerUp}
          aria-label="Gradient preview (drag to adjust)"
        >
          {currentState.type === "linear" ? (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute left-3 top-3 rounded-md bg-background/70 px-2 py-1 text-xs text-foreground backdrop-blur">
                Drag to rotate • {round(clamp(currentState.angle, 0, 360))}°
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute left-3 top-3 rounded-md bg-background/70 px-2 py-1 text-xs text-foreground backdrop-blur">
                Drag to move focal point • {round(clamp(currentState.radialX, 0, 100))}%
                , {round(clamp(currentState.radialY, 0, 100))}%
              </div>
              <div
                className="absolute size-3 rounded-full border border-foreground/60 bg-background/70 backdrop-blur"
                style={{
                  left: `calc(${clamp(currentState.radialX, 0, 100)}% - 6px)`,
                  top: `calc(${clamp(currentState.radialY, 0, 100)}% - 6px)`,
                }}
              />
            </div>
          )}
        </div>
        <div className="border-t bg-muted/20 p-3 space-y-2">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold">Stops (drag handles)</p>
            <p className="text-xs text-muted-foreground">Drag dots to reposition</p>
          </div>
          <div
            ref={stopBarRef}
            className="relative h-10 rounded-md border bg-background overflow-hidden"
            aria-label="Gradient stops bar"
          >
            <div
              className="absolute inset-0"
              style={{ backgroundImage: previewDeclaration }}
            />
            <div className="absolute inset-0 bg-linear-to-b from-transparent to-background/20" />
            {stops.map((stop, idx) => (
              <button
                key={idx}
                type="button"
                className="absolute top-1/2 -translate-y-1/2 size-5 rounded-full border-2 border-background shadow-sm"
                style={{
                  left: `calc(${clamp(stop.position, 0, 100)}% - 10px)`,
                  backgroundColor: stop.color,
                }}
                onPointerDown={(e) => onStopHandlePointerDown(e, idx)}
                onPointerMove={onStopHandlePointerMove}
                onPointerUp={onStopHandlePointerUp}
                onPointerCancel={onStopHandlePointerUp}
                aria-label={`Drag stop ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-lg border p-4 space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <FieldLabel
              htmlFor="gradientType"
              label="Type"
              help="Linear gradients transition in one direction; radial gradients radiate outward from a point."
            />
            <Select
              value={currentState.type}
              onValueChange={(value: GradientType) => setState({ type: value })}
            >
              <SelectTrigger id="gradientType" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="linear">Linear</SelectItem>
                <SelectItem value="radial">Radial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {currentState.type === "linear" ? (
            <div className="space-y-2">
              <FieldLabel
                htmlFor="angle"
                label="Angle (deg)"
                help="0deg points up, 90deg points right. Common angles: 45, 90, 135."
              />
              <div className="space-y-2">
                <input
                  id="angle"
                  type="range"
                  min={0}
                  max={360}
                  step={1}
                  value={clamp(currentState.angle, 0, 360)}
                  onChange={(e) =>
                    setState({
                      angle: clamp(parseInt(e.target.value || "0", 10), 0, 360),
                    })
                  }
                  className="w-full accent-primary"
                  aria-label="Angle slider"
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>0°</span>
                  <span className="font-medium text-foreground">
                    {round(clamp(currentState.angle, 0, 360))}°
                  </span>
                  <span>360°</span>
                </div>
              </div>
            </div>
          ) : null}

          {currentState.type === "radial" ? (
            <div className="space-y-2">
              <FieldLabel
                htmlFor="radialX"
                label="Focal point"
                help="Controls where the radial gradient starts (like a spotlight). Drag in the preview or use the sliders."
              />
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>X</span>
                    <span className="font-medium text-foreground">
                      {round(clamp(currentState.radialX, 0, 100))}%
                    </span>
                  </div>
                  <input
                    id="radialX"
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={clamp(currentState.radialX, 0, 100)}
                    onChange={(e) =>
                      setState({
                        radialX: clamp(parseInt(e.target.value || "0", 10), 0, 100),
                      })
                    }
                    className="w-full accent-primary"
                    aria-label="Radial X slider"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Y</span>
                    <span className="font-medium text-foreground">
                      {round(clamp(currentState.radialY, 0, 100))}%
                    </span>
                  </div>
                  <input
                    id="radialY"
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={clamp(currentState.radialY, 0, 100)}
                    onChange={(e) =>
                      setState({
                        radialY: clamp(parseInt(e.target.value || "0", 10), 0, 100),
                      })
                    }
                    className="w-full accent-primary"
                    aria-label="Radial Y slider"
                  />
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-0.5">
            <p className="text-sm font-medium">Include fallback color</p>
            <p className="text-xs text-muted-foreground">
              Adds a <code>background-color</code> line as a safe fallback.
            </p>
          </div>
          <Switch
            className="shrink-0 mt-0.5"
            checked={currentState.includeFallback}
            onCheckedChange={(checked) => setState({ includeFallback: checked })}
            aria-label="Include fallback color"
          />
        </div>
      </div>

      <div className="rounded-lg border p-4 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold">Color stops</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addStop}
            disabled={stops.length >= 5}
          >
            <PlusIcon className="size-4" />
            Add stop
          </Button>
        </div>

        <div className="space-y-3">
          {stops.map((stop, idx) => (
            <div
              key={idx}
              className="rounded-md border p-3 grid grid-cols-1 gap-3 md:grid-cols-[1fr_140px_auto]"
            >
              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={stop.color}
                    onChange={(e) => updateStop(idx, { color: e.target.value })}
                    className="w-16 h-10 px-1"
                    aria-label={`Stop ${idx + 1} color picker`}
                  />
                  <Input
                    type="text"
                    value={stop.color}
                    onChange={(e) => updateStop(idx, { color: e.target.value })}
                    placeholder="#000000"
                    aria-label={`Stop ${idx + 1} color`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <FieldLabel
                  htmlFor={`pos-${idx}`}
                  label="Position (%)"
                  help="Controls where the stop sits in the gradient from 0% to 100%."
                />
                <div className="space-y-2">
                  <input
                    id={`pos-${idx}`}
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={clamp(stop.position, 0, 100)}
                    onChange={(e) =>
                      updateStop(idx, {
                        position: clamp(parseInt(e.target.value || "0", 10), 0, 100),
                      })
                    }
                    className="w-full accent-primary"
                    aria-label={`Stop ${idx + 1} position slider`}
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>0%</span>
                    <span className="font-medium text-foreground">
                      {round(clamp(stop.position, 0, 100))}%
                    </span>
                    <span>100%</span>
                  </div>
                </div>
              </div>

              <div className="flex md:justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeStop(idx)}
                  disabled={stops.length <= 2}
                  aria-label={`Remove stop ${idx + 1}`}
                >
                  <TrashIcon className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">
          Tip: Keep stops ordered by position for predictable results (we sort them
          automatically in output).
        </p>
      </div>
    </div>
  );
}


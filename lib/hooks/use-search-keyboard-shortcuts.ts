"use client";

import { useEffect, useRef } from "react";

export function useSearchKeyboardShortcuts(
  inputRef: React.RefObject<HTMLInputElement | null>,
  onClear: () => void
) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const inEditable =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;
      const key = e.key.toLowerCase();
      const cmdK = (e.metaKey || e.ctrlKey) && key === "k";
      const slash = e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey;
      if ((cmdK || slash) && !inEditable) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (key === "escape" && document.activeElement === inputRef.current) {
        onClear();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [inputRef, onClear]);
}

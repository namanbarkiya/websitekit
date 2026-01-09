/**
 * Tool State Management Hook
 *
 * Hook for tools to manage their local state
 */

import { useCallback, useState } from "react";

export interface UseToolStateOptions {
  /** Initial state */
  initialState?: Record<string, unknown>;
  /** Callback when state changes */
  onStateChange?: (state: Record<string, unknown>) => void;
}

/**
 * Hook for managing tool local state
 *
 * @example
 * ```tsx
 * const { state, setState, resetState } = useToolState({
 *   initialState: { title: '', description: '' },
 * });
 * ```
 */
export function useToolState(options: UseToolStateOptions = {}) {
  const { initialState = {}, onStateChange } = options;

  const [state, setStateInternal] =
    useState<Record<string, unknown>>(initialState);

  const setState = useCallback(
    (updates: Partial<Record<string, unknown>>) => {
      setStateInternal((prev) => {
        const next = { ...prev, ...updates };
        onStateChange?.(next);
        return next;
      });
    },
    [onStateChange]
  );

  const resetState = useCallback(() => {
    setStateInternal(initialState);
    onStateChange?.(initialState);
  }, [initialState, onStateChange]);

  return {
    state,
    setState,
    resetState,
  };
}

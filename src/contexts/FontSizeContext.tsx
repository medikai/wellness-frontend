"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type FontSizeContextValue = {
  fontSizePx: number;
  minPx: number;
  maxPx: number;
  setFontSizePx: (nextPx: number) => void;
  increase: () => void;
  decrease: () => void;
};

const DEFAULT_FONT_SIZE_PX = 20;
const MIN_FONT_SIZE_PX = 16;
const MAX_FONT_SIZE_PX = 32;
const STORAGE_KEY = "app_font_size_px";

const FontSizeContext = createContext<FontSizeContextValue | undefined>(undefined);

export const FontSizeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fontSizePx, setFontSizePxState] = useState<number>(DEFAULT_FONT_SIZE_PX);

  useEffect(() => {
    try {
      const stored = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
      if (stored) {
        const parsed = Number(stored);
        if (!Number.isNaN(parsed)) {
          setFontSizePxState(Math.min(MAX_FONT_SIZE_PX, Math.max(MIN_FONT_SIZE_PX, parsed)));
        }
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.style.fontSize = `${fontSizePx}px`;
    }
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, String(fontSizePx));
      }
    } catch {
      // ignore storage errors
    }
  }, [fontSizePx]);

  const setFontSizePx = useCallback((nextPx: number) => {
  const clamped = Math.min(MAX_FONT_SIZE_PX, Math.max(MIN_FONT_SIZE_PX, Math.round(nextPx)));
  setFontSizePxState(clamped);
}, []);


  const increase = useCallback(() => setFontSizePxState(prev => Math.min(MAX_FONT_SIZE_PX, prev + 1)), []);
  const decrease = useCallback(() => setFontSizePxState(prev => Math.max(MIN_FONT_SIZE_PX, prev - 1)), []);

  const value = useMemo<FontSizeContextValue>(() => ({
    fontSizePx,
    minPx: MIN_FONT_SIZE_PX,
    maxPx: MAX_FONT_SIZE_PX,
    setFontSizePx,
    increase,
    decrease,
  }), [fontSizePx, setFontSizePx, increase, decrease]);

  return (
    <FontSizeContext.Provider value={value}>
      {children}
    </FontSizeContext.Provider>
  );
};

export const useFontSize = (): FontSizeContextValue => {
  const ctx = useContext(FontSizeContext);
  if (!ctx) {
    throw new Error("useFontSize must be used within a FontSizeProvider");
  }
  return ctx;
};


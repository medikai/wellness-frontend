//src/components/TimerPill.tsx
"use client";
import React from "react";

type Props = {
  elapsedSec: number;
  leftSec: number;
  warn: boolean;
  over: boolean;
  isHost: boolean;
  onAdd15: () => void;
};

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
}

export default function TimerPill({ elapsedSec, leftSec, warn, over, isHost, onAdd15 }: Props) {
  const bg = over ? "bg-red-100 text-red-800" : warn ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800";
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${bg}`}>
      <span>Elapsed {fmt(elapsedSec)}</span>
      <span>•</span>
      <span>Left {fmt(leftSec)}</span>
      {isHost && (
        <>
          <span className="mx-1">•</span>
          <button className="underline" onClick={onAdd15}>+15</button>
        </>
      )}
    </div>
  );
}

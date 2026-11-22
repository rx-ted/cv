"use client"

import type { AppLanguage } from "@/lib/resume/schema"
import type { ZoomMode } from "@/templates/ResumePreview"

const ZOOM_OPTIONS: Array<{ value: ZoomMode; label: string }> = [
  { value: 0.5, label: "50%" },
  { value: 0.75, label: "75%" },
  { value: 1, label: "100%" },
]

export function ZoomControls({
  zoom,
  onChange,
  lang,
  className,
}: {
  zoom: ZoomMode
  onChange: (z: ZoomMode) => void
  lang: AppLanguage
  className?: string
}) {
  const fitLabel = lang === "zh-CN" ? "适应窗口" : "Fit"
  const options = [...ZOOM_OPTIONS, { value: "fit" as const, label: fitLabel }]
  return (
    <div
      className={`no-print flex items-center gap-1 bg-background border border-border rounded-md p-1 shadow-sm ${className || ""}`.trim()}
    >
      {options.map((opt) => (
        <button
          key={String(opt.value)}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`px-2.5 py-1 text-xs rounded ${zoom === opt.value ? "bg-foreground text-background" : "hover:bg-accent text-foreground/80"}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

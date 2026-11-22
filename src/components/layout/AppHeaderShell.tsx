"use client"

import type { ReactNode } from "react"

export function AppHeaderShell({
  left,
  right,
  className,
  containerClassName,
}: {
  left: ReactNode
  right: ReactNode
  className?: string
  containerClassName?: string
}) {
  return (
    <header
      className={`no-print sticky top-0 z-20 bg-background/90 backdrop-blur border-b shrink-0 ${className || ""}`.trim()}
    >
      <div
        className={`${containerClassName ?? "max-w-6xl mx-auto px-4"} h-14 flex items-center justify-between gap-3`}
      >
        <div className="flex items-center gap-2 min-w-0">{left}</div>
        <div className="flex items-center gap-2 shrink-0">{right}</div>
      </div>
    </header>
  )
}

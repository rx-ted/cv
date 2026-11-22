"use client"

import { Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { t } from "@/i18n/strings"
import type { AppLanguage, ResumeDocument } from "@/lib/resume/schema"
import { ResumeForm } from "./ResumeForm"

export function EditorFormPanel({
  resume,
  lang,
  width,
  open = true,
  onToggle,
  layout = "sidebar",
}: {
  resume: ResumeDocument
  lang: AppLanguage
  width?: number
  open?: boolean
  onToggle?: () => void
  layout?: "sidebar" | "stacked"
}) {
  const title = t(lang, "contentPanel")
  const isStacked = layout === "stacked"

  if (!open) {
    if (isStacked) {
      return null
    }
    return (
      <div className="no-print shrink-0 border-r h-full bg-muted/30 flex flex-col items-center py-2 gap-2">
        {onToggle ? (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onToggle}
            title={lang === "zh-CN" ? "展开内容面板" : "Expand content panel"}
            aria-label={
              lang === "zh-CN" ? "展开内容面板" : "Expand content panel"
            }
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        ) : null}
        <span className="text-xs text-muted-foreground [writing-mode:vertical-rl]">
          {title}
        </span>
      </div>
    )
  }

  return (
    <div
      className={`@container ${isStacked ? "w-full" : "shrink-0 border-r h-full"} bg-muted/30 overflow-y-auto no-print`}
      style={!isStacked && width ? { width } : undefined}
    >
      {isStacked ? null : (
        <div className="sticky top-0 z-10 border-b bg-muted/30 backdrop-blur px-4 py-3 flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          {onToggle ? (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onToggle}
              title={
                lang === "zh-CN" ? "收起内容面板" : "Collapse content panel"
              }
              aria-label={
                lang === "zh-CN" ? "收起内容面板" : "Collapse content panel"
              }
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
          ) : null}
        </div>
      )}
      <div className="p-3">
        <ResumeForm resume={resume} lang={lang} />
      </div>
    </div>
  )
}

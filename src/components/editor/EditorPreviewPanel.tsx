"use client"

import { ZoomControls } from "@/components/preview/ZoomControls"
import type { AppLanguage, ResumeDocument } from "@/lib/resume/schema"
import type { ZoomMode } from "@/templates/ResumePreview"
import { ResumePreview } from "@/templates/ResumePreview"

export function EditorPreviewPanel({
  resume,
  lang,
  zoom,
  onZoomChange,
}: {
  resume: ResumeDocument
  lang: AppLanguage
  zoom: ZoomMode
  onZoomChange: (z: ZoomMode) => void
}) {
  return (
    <div className="flex-1 overflow-auto bg-muted/50 p-4 flex flex-col items-center print-area print-wrapper print:bg-white print:p-0">
      <ZoomControls
        zoom={zoom}
        onChange={onZoomChange}
        lang={lang}
        className="mb-3 sticky top-0 z-10"
      />
      <div className="w-full">
        <ResumePreview resume={resume} lang={lang} zoom={zoom} />
      </div>
    </div>
  )
}

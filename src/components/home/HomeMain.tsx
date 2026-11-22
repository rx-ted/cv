"use client"

import { ZoomControls } from "@/components/preview/ZoomControls"
import type { AppLanguage, ResumeDocument } from "@/lib/resume/schema"
import type { ZoomMode } from "@/templates/ResumePreview"
import { ResumePreview } from "@/templates/ResumePreview"

export function HomeMain({
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
    <main className="flex-1 print-area print-wrapper py-6 flex justify-center overflow-auto print:bg-white">
      <div className="w-full px-4 print:px-0 flex flex-col items-center">
        <ZoomControls
          zoom={zoom}
          onChange={onZoomChange}
          lang={lang}
          className="mb-3"
        />
        <div className="w-full">
          <ResumePreview resume={resume} lang={lang} zoom={zoom} />
        </div>
      </div>
    </main>
  )
}

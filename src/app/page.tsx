"use client"

import { useMemo, useState } from "react"
import { HomeHeader } from "@/components/home/HomeHeader"
import { HomeMain } from "@/components/home/HomeMain"
import { AppFooter } from "@/components/layout/AppFooter"
import { getDefaultResume } from "@/lib/resume/document"
import { useAppStore } from "@/stores/app"
import type { ZoomMode } from "@/templates/ResumePreview"

export default function HomePage() {
  const lang = useAppStore((s) => s.language)
  const prefs = useAppStore((s) => s.preferences)
  const [zoom, setZoom] = useState<ZoomMode>(1)

  const previewDoc = useMemo(() => {
    const base = getDefaultResume(lang)
    const copy = structuredClone(base)
    copy.meta.cvfree.theme = structuredClone(prefs.theme)
    copy.meta.cvfree.text = structuredClone(prefs.text)
    copy.meta.cvfree.layout = structuredClone(prefs.layout)
    return copy
  }, [lang, prefs])

  return (
    <div className="min-h-screen bg-muted/30 print:bg-white flex flex-col">
      <HomeHeader />
      <HomeMain
        resume={previewDoc}
        lang={lang}
        zoom={zoom}
        onZoomChange={setZoom}
      />
      <AppFooter lang={lang} />
    </div>
  )
}

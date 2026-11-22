"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { paginateSource } from "@/lib/pagination"
import { toLegacyResume } from "@/lib/resume/legacy-adapter"
import type { AppLanguage, ResumeDocument } from "@/lib/resume/schema"
import { ResumeDocument as LegacyResumeDocument } from "./resume-document"
import "./resume.css"

const MM_TO_PX = 96 / 25.4
const PAGE_PX = {
  A4: { w: 210 * MM_TO_PX, h: 297 * MM_TO_PX },
  Letter: { w: 215.9 * MM_TO_PX, h: 279.4 * MM_TO_PX },
} as const

export type ZoomMode = number | "fit"

type PageHtml = { index: number; html: string }

async function waitForAssets(root: HTMLElement) {
  if (typeof document !== "undefined" && "fonts" in document) {
    try {
      await (document as Document & { fonts?: FontFaceSet }).fonts?.ready
    } catch {
      // Ignore font readiness failures; measurement can still proceed.
    }
  }

  const images = Array.from(root.querySelectorAll("img"))
  if (images.length === 0) return
  await Promise.all(
    images.map(async (img) => {
      if (img.complete && img.naturalWidth > 0) return
      if (typeof img.decode === "function") {
        try {
          await img.decode()
          return
        } catch {
          // Fall through to load/error listeners.
        }
      }
      await new Promise<void>((resolve) => {
        const done = () => resolve()
        img.addEventListener("load", done, { once: true })
        img.addEventListener("error", done, { once: true })
      })
    }),
  )
}

export function ResumePreview({
  resume,
  lang,
  zoom = 1,
  onPageCount,
}: {
  resume: ResumeDocument
  lang: AppLanguage
  zoom?: ZoomMode
  onPageCount?: (n: number) => void
}) {
  const cv = resume.meta.cvfree
  const layout = cv.layout
  const format = (layout.format === "Letter" ? "Letter" : "A4") as
    | "A4"
    | "Letter"
  const paginationMode = layout.pagination === "dashed" ? "dashed" : "gap"
  const pageW = PAGE_PX[format].w
  const pageH = PAGE_PX[format].h
  const marginMm = Math.max(0, layout.margin ?? 16)
  const margin = marginMm * MM_TO_PX

  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [pages, setPages] = useState<PageHtml[]>([])
  const [fitScale, setFitScale] = useState(1)

  const contentW = pageW - margin * 2
  const contentH = pageH - margin * 2

  const legacy = useMemo(() => {
    const l = toLegacyResume(resume, lang) as any
    if (l.settings?.page) {
      // Margins are handled by the preview page container; keep the CV content
      // width aligned to the available content area to avoid double margins/overflow.
      l.settings.page.marginX = 0
      l.settings.page.marginY = 0
      l.settings.page.format = format
      l.settings.page._widthMm = contentW / MM_TO_PX
      l.settings.page._heightCss = "auto"
    }
    return l
  }, [resume, lang, format, contentW])

  useEffect(() => {
    // legacy is the rendered source trigger; measurement reads from DOM.
    void legacy
    let cancelled = false
    let raf = 0
    let timer: ReturnType<typeof setTimeout> | null = null

    const measure = async () => {
      const source = contentRef.current
      if (!source) return

      await waitForAssets(source)
      if (cancelled) return

      raf = window.requestAnimationFrame(() => {
        if (cancelled || !contentRef.current) return
        const result = paginateSource(contentRef.current, {
          page: { width: contentW, height: contentH },
          margins: { top: 0, right: 0, bottom: 0, left: 0 },
        })
        const nextPages =
          result.pages.length > 0
            ? result.pages.map((p) => ({
                index: p.index,
                html: p.fragments.map((f) => f.html).join(""),
              }))
            : [{ index: 0, html: "" }]
        setPages(nextPages)
        onPageCount?.(nextPages.length)
      })
    }

    // Delay to allow React to commit rendered source content.
    timer = setTimeout(() => {
      void measure()
    }, 0)

    const scheduleMeasure = () => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        void measure()
      }, 60)
    }

    const ro = new ResizeObserver(scheduleMeasure)
    if (contentRef.current) ro.observe(contentRef.current)

    const mo = new MutationObserver(scheduleMeasure)
    if (contentRef.current) {
      mo.observe(contentRef.current, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
      })
    }

    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts
    fonts?.addEventListener?.("loadingdone", scheduleMeasure)

    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
      if (raf) window.cancelAnimationFrame(raf)
      ro.disconnect()
      mo.disconnect()
      fonts?.removeEventListener?.("loadingdone", scheduleMeasure)
    }
  }, [legacy, contentW, contentH, onPageCount])

  useEffect(() => {
    if (zoom !== "fit") return
    const el = containerRef.current?.parentElement
    if (!el) return
    const update = () => {
      const w = el.clientWidth
      if (w > 0) setFitScale(Math.min(2, Math.max(0.25, (w - 16) / pageW)))
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [zoom, pageW])

  const scale = zoom === "fit" ? fitScale : typeof zoom === "number" ? zoom : 1
  const pageBg = cv.theme?.background || "#ffffff"
  const pageGap = paginationMode === "gap" ? 24 : 0

  return (
    <div
      className="w-full"
      id="resume-preview-root"
      data-format={format}
      style={{ position: "relative" }}
    >
      <style>{`
        @media print {
          @page { size: ${format === "Letter" ? "letter" : "A4"}; margin: 0; }
        }
      `}</style>
      {/* Hidden source content for measurement and pagination */}
      <div
        className="no-print"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: contentW,
          visibility: "hidden",
          pointerEvents: "none",
          overflow: "visible",
          zIndex: -1,
        }}
        aria-hidden
      >
        <div ref={contentRef} className="cv-source-content">
          <LegacyResumeDocument resume={legacy} />
        </div>
      </div>

      <div
        ref={containerRef}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top center",
          width: "fit-content",
          margin: "0 auto",
        }}
        className="print:!transform-none print:!w-full"
      >
        <div
          className="resume-pages"
          data-pagination={paginationMode}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: pageGap,
            width: pageW,
          }}
        >
          {pages.map((page) => (
            <div
              key={page.index}
              className="resume-page"
              data-page={page.index + 1}
              style={{
                width: pageW,
                height: pageH,
                background: pageBg,
                overflow: "hidden",
                position: "relative",
                boxShadow:
                  paginationMode === "gap"
                    ? "0 2px 8px rgba(0,0,0,0.1)"
                    : "none",
                borderBottom:
                  paginationMode === "dashed"
                    ? "1px dashed rgba(0,0,0,0.18)"
                    : "none",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: margin,
                  left: margin,
                  width: contentW,
                  height: contentH,
                  overflow: "hidden",
                }}
                // biome-ignore lint/security/noDangerouslySetInnerHtml: page slices are pre-rendered from trusted resume DOM
                dangerouslySetInnerHTML={{ __html: page.html }}
              />
              {layout.showPageFooter ? (
                <div
                  style={{
                    position: "absolute",
                    left: margin,
                    right: margin,
                    bottom: Math.max(10, margin * 0.45),
                    fontSize: "11px",
                    lineHeight: "14px",
                    color: cv.theme?.secondaryText || "#6b7280",
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <span
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {layout.pageFooterText || ""}
                  </span>
                  <span style={{ flexShrink: 0 }}>
                    {page.index + 1} / {pages.length}
                  </span>
                </div>
              ) : null}
              {layout.showPageHeader && layout.pageHeaderText ? (
                <div
                  style={{
                    position: "absolute",
                    left: margin,
                    right: margin,
                    top: Math.max(8, margin * 0.35),
                    fontSize: "11px",
                    lineHeight: "14px",
                    color: cv.theme?.secondaryText || "#6b7280",
                    textAlign: "center",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {layout.pageHeaderText}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

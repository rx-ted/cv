"use client"

import { Maximize2, Minimize2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import {
  ColorPicker,
  ColorPickerAlpha,
  ColorPickerArea,
  ColorPickerAreaThumb,
  ColorPickerChannels,
  ColorPickerContent,
  ColorPickerEyeDropper,
  ColorPickerFormatSelect,
  ColorPickerHue,
  ColorPickerInput,
  ColorPickerOutput,
  ColorPickerSwatchAdd,
  ColorPickerSwatches,
  ColorPickerTrigger,
} from "@/components/control-ui/ui/color-picker"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ResumeSelect } from "@/components/ui/resume-select"
import { Separator } from "@/components/ui/separator"
import { t } from "@/i18n/strings"
import { FONT_IDS, type FontId, resolveTemplateId } from "@/lib/resume/schema"
import { useAppStore } from "@/stores/app"
import { FONTS } from "@/templates/font-list"
import { getTemplateDescription, getTemplateLabel } from "@/templates/labels"
import { TEMPLATES } from "@/templates/registry"

const PRESET_THEMES = [
  {
    id: "professional-blue",
    name: { "zh-CN": "Professional Blue", en: "Professional Blue" },
    color: "#2563eb",
    textColor: "#1f2937",
    accentColor: "#0d9488",
    background: "#ffffff",
    secondaryText: "#6b7280",
    border: "#e5e7eb",
    mutedBackground: "#f3f4f6",
    link: "#1d4ed8",
  },
  {
    id: "modern-gray",
    name: { "zh-CN": "Modern Gray", en: "Modern Gray" },
    color: "#374151",
    textColor: "#111827",
    accentColor: "#64748b",
    background: "#ffffff",
    secondaryText: "#6b7280",
    border: "#e5e7eb",
    mutedBackground: "#f3f4f6",
    link: "#2563eb",
  },
  {
    id: "navy",
    name: { "zh-CN": "Navy", en: "Navy" },
    color: "#1e3a8a",
    textColor: "#1e293b",
    accentColor: "#3b82f6",
    background: "#ffffff",
    secondaryText: "#64748b",
    border: "#e2e8f0",
    mutedBackground: "#f1f5f9",
    link: "#2563eb",
  },
  {
    id: "elegant-green",
    name: { "zh-CN": "Elegant Green", en: "Elegant Green" },
    color: "#166534",
    textColor: "#1f2937",
    accentColor: "#65a30d",
    background: "#ffffff",
    secondaryText: "#6b7280",
    border: "#e5e7eb",
    mutedBackground: "#f0fdf4",
    link: "#0f766e",
  },
  {
    id: "minimal-black",
    name: { "zh-CN": "Minimal Black", en: "Minimal Black" },
    color: "#171717",
    textColor: "#262626",
    accentColor: "#737373",
    background: "#ffffff",
    secondaryText: "#737373",
    border: "#e5e5e5",
    mutedBackground: "#f5f5f5",
    link: "#2563eb",
  },
  {
    id: "warm-brown",
    name: { "zh-CN": "Warm Brown", en: "Warm Brown" },
    color: "#92400e",
    textColor: "#292524",
    accentColor: "#d97706",
    background: "#ffffff",
    secondaryText: "#78716c",
    border: "#e7e5e4",
    mutedBackground: "#faf5f0",
    link: "#0f766e",
  },
  {
    id: "elegant-purple",
    name: { "zh-CN": "Elegant Purple", en: "Elegant Purple" },
    color: "#6d28d9",
    textColor: "#27233a",
    accentColor: "#a855f7",
    background: "#ffffff",
    secondaryText: "#78728a",
    border: "#e9e5f0",
    mutedBackground: "#f5f3ff",
    link: "#2563eb",
  },
  {
    id: "burgundy",
    name: { "zh-CN": "Burgundy", en: "Burgundy" },
    color: "#881337",
    textColor: "#29212a",
    accentColor: "#be123c",
    background: "#ffffff",
    secondaryText: "#78716c",
    border: "#e7e5e4",
    mutedBackground: "#fff1f2",
    link: "#2563eb",
  },
] as const

function Group({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-3">
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <div className="space-y-3">{children}</div>
    </section>
  )
}

function RangeRow({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  unit?: string
  onChange: (v: number) => void
}) {
  const display = unit ? `${value}${unit}` : `${value}`
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <span className="text-xs text-muted-foreground tabular-nums">
          {display}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
    </div>
  )
}

const PICKER_SWATCHES = [
  "#2563eb",
  "#0d9488",
  "#1f2937",
  "#6b7280",
  "#e5e7eb",
  "#f3f4f6",
  "#ffffff",
  "#111827",
  "#dc2626",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#7c3aed",
]

function ColorRow({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  const [swatches, setSwatches] = useState(() => PICKER_SWATCHES)

  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <ColorPicker
          value={value || "#000000"}
          onValueChange={onChange}
          defaultFormat="hex"
        >
          <div className="flex items-center gap-2">
            <ColorPickerTrigger />
            <ColorPickerOutput />
          </div>
          <ColorPickerContent className="w-72">
            <ColorPickerArea>
              <ColorPickerAreaThumb />
            </ColorPickerArea>
            <div className="flex items-center gap-2">
              <ColorPickerEyeDropper />
              <div className="flex flex-1 flex-col gap-2">
                <ColorPickerHue />
                <ColorPickerAlpha />
              </div>
            </div>
            <div className="flex gap-2">
              <ColorPickerFormatSelect />
              <ColorPickerInput className="flex-1" />
            </div>
            <ColorPickerChannels />
            <ColorPickerSwatches label="Colors" colors={swatches}>
              <ColorPickerSwatchAdd
                onAdd={(v) =>
                  setSwatches((prev) =>
                    prev.includes(v) ? prev : [...prev, v],
                  )
                }
              />
            </ColorPickerSwatches>
          </ColorPickerContent>
        </ColorPicker>
      </div>
    </div>
  )
}

export function CustomizePanel({
  onClose,
  scope = "preferences",
  hideHeader = false,
}: {
  onClose?: () => void
  scope?: "preferences" | "active"
  layout?: "sidebar" | "stacked"
  hideHeader?: boolean
}) {
  const lang = useAppStore((s) => s.language)
  const prefs = useAppStore((s) => s.preferences)
  const activeResume = useAppStore((s) =>
    s.activeId ? s.resumes[s.activeId] : null,
  )
  const fonts = FONT_IDS

  const source =
    scope === "active" && activeResume ? activeResume.meta.cvfree : prefs
  const theme = source.theme
  const text = source.text
  const layout = source.layout
  const activeTemplate = resolveTemplateId(theme.template)

  const mutate = (
    fn: (t: typeof theme, tx: typeof text, l: typeof layout) => void,
  ) => {
    if (scope === "active") {
      const st = useAppStore.getState()
      if (st.activeId && st.resumes[st.activeId]) {
        st.updateActive((d) => {
          fn(d.meta.cvfree.theme, d.meta.cvfree.text, d.meta.cvfree.layout)
        })
        return
      }
    }
    useAppStore.getState().setPreferences((p) => {
      fn(p.theme, p.text, p.layout)
    })
  }

  const templateLabel = (id: string, name: string) =>
    getTemplateLabel(lang, id, name)
  const templateDesc = (id: string, desc: string) =>
    getTemplateDescription(lang, id, desc)

  return (
    <div className="h-full flex flex-col bg-background">
      {!hideHeader && (
        <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
          <div className="font-medium">{t(lang, "customize")}</div>
          {onClose ? (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onClose}
              title={lang === "zh-CN" ? "收起面板" : "Collapse panel"}
              aria-label={lang === "zh-CN" ? "收起面板" : "Collapse panel"}
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
          ) : null}
        </div>
      )}
      <div className="@container flex-1 overflow-y-auto p-4 space-y-6">
        <Group title={t(lang, "template")}>
          <div className="grid grid-cols-1 @sm:grid-cols-2 gap-2">
            {TEMPLATES.map((tpl) => {
              const name = templateLabel(tpl.id, tpl.name)
              const desc = templateDesc(tpl.id, tpl.description)
              return (
                <button
                  key={tpl.id}
                  onClick={() =>
                    mutate((th) => {
                      th.template = tpl.id
                    })
                  }
                  title={`${name}：${desc}`}
                  className={`border rounded p-2.5 text-left ${activeTemplate === tpl.id ? "border-primary bg-primary/10" : "border-border hover:border-foreground/30"}`}
                >
                  <div className="text-sm font-medium">{name}</div>
                  <div className="text-[11px] text-muted-foreground leading-tight mt-0.5 line-clamp-2">
                    {desc}
                  </div>
                </button>
              )
            })}
          </div>
        </Group>

        <Separator />

        <Group title={t(lang, "color")}>
          <div className="space-y-1.5">
            <Label>{t(lang, "presetThemes")}</Label>
            <div className="grid grid-cols-2 @sm:grid-cols-4 gap-2">
              {PRESET_THEMES.map((pt) => {
                const active =
                  theme.color.toLowerCase() === pt.color &&
                  theme.textColor.toLowerCase() === pt.textColor &&
                  theme.accentColor.toLowerCase() === pt.accentColor &&
                  theme.background.toLowerCase() === pt.background
                return (
                  <button
                    key={pt.id}
                    type="button"
                    onClick={() =>
                      mutate((th) => {
                        th.color = pt.color
                        th.textColor = pt.textColor
                        th.accentColor = pt.accentColor
                        th.background = pt.background
                        th.secondaryText = pt.secondaryText
                        th.border = pt.border
                        th.mutedBackground = pt.mutedBackground
                        th.link = pt.link
                      })
                    }
                    className={`border rounded p-2 text-left transition-colors ${active ? "border-primary bg-primary/10" : "border-border hover:border-foreground/30"}`}
                    title={pt.name.en}
                  >
                    <div className="flex gap-1 mb-1.5">
                      {[
                        pt.color,
                        pt.accentColor,
                        pt.textColor,
                        pt.background,
                      ].map((c, i) => (
                        <span
                          key={i}
                          className="h-3 w-3 rounded-full border border-border/60"
                          style={{ background: c }}
                        />
                      ))}
                    </div>
                    <div className="text-[11px] font-medium leading-tight truncate">
                      {lang === "zh-CN" ? pt.name["zh-CN"] : pt.name.en}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
          <ColorRow
            label={t(lang, "themeColor")}
            value={theme.color}
            onChange={(v) =>
              mutate((th) => {
                th.color = v
              })
            }
          />
          <ColorRow
            label={t(lang, "textColor")}
            value={theme.textColor}
            onChange={(v) =>
              mutate((th) => {
                th.textColor = v
              })
            }
          />
          <ColorRow
            label={t(lang, "accentColor")}
            value={theme.accentColor}
            onChange={(v) =>
              mutate((th) => {
                th.accentColor = v
              })
            }
          />
          <ColorRow
            label={t(lang, "bgColor")}
            value={theme.background}
            onChange={(v) =>
              mutate((th) => {
                th.background = v
              })
            }
          />
          <ColorRow
            label={t(lang, "secondaryText")}
            value={theme.secondaryText}
            onChange={(v) =>
              mutate((th) => {
                th.secondaryText = v
              })
            }
          />
          <ColorRow
            label={t(lang, "borderColor")}
            value={theme.border}
            onChange={(v) =>
              mutate((th) => {
                th.border = v
              })
            }
          />
          <ColorRow
            label={t(lang, "mutedBackground")}
            value={theme.mutedBackground}
            onChange={(v) =>
              mutate((th) => {
                th.mutedBackground = v
              })
            }
          />
          <ColorRow
            label={t(lang, "linkColor")}
            value={theme.link}
            onChange={(v) =>
              mutate((th) => {
                th.link = v
              })
            }
          />
        </Group>

        <Separator />

        <Group title={t(lang, "text")}>
          <ResumeSelect
            label={t(lang, "fontHeading")}
            value={text.fontHeading}
            onValueChange={(v) =>
              mutate((_th, tx) => {
                tx.fontHeading = v as FontId
              })
            }
            options={fonts.map((f) => ({ value: f, label: FONTS[f].label }))}
          />
          <ResumeSelect
            label={t(lang, "fontBody")}
            value={text.fontBody}
            onValueChange={(v) =>
              mutate((_th, tx) => {
                tx.fontBody = v as FontId
              })
            }
            options={fonts.map((f) => ({ value: f, label: FONTS[f].label }))}
          />
          <RangeRow
            label={t(lang, "fontSize")}
            value={text.fontSize}
            min={12}
            max={18}
            step={1}
            unit="px"
            onChange={(v) =>
              mutate((_th, tx) => {
                tx.fontSize = v
              })
            }
          />
          <RangeRow
            label={t(lang, "lineHeight")}
            value={text.lineHeight}
            min={1.2}
            max={2}
            step={0.05}
            onChange={(v) =>
              mutate((_th, tx) => {
                tx.lineHeight = Math.round(v * 100) / 100
              })
            }
          />
          <RangeRow
            label={t(lang, "fontWeight")}
            value={text.fontWeight}
            min={300}
            max={700}
            step={100}
            onChange={(v) =>
              mutate((_th, tx) => {
                tx.fontWeight = v
              })
            }
          />
          <RangeRow
            label={t(lang, "headingSize")}
            value={text.headingSize}
            min={16}
            max={36}
            step={1}
            unit="px"
            onChange={(v) =>
              mutate((_th, tx) => {
                tx.headingSize = v
              })
            }
          />
          <RangeRow
            label={t(lang, "paragraphSpacing")}
            value={text.paragraphSpacing}
            min={4}
            max={24}
            step={1}
            unit="px"
            onChange={(v) =>
              mutate((_th, tx) => {
                tx.paragraphSpacing = v
              })
            }
          />
        </Group>

        <Separator />

        <Group title={t(lang, "layout")}>
          <ResumeSelect
            label={t(lang, "columns")}
            value={layout.columns}
            onValueChange={(v) =>
              mutate((_th, _tx, l) => {
                l.columns = v as "single" | "double"
              })
            }
            options={[
              { value: "single", label: t(lang, "single") },
              { value: "double", label: t(lang, "double") },
            ]}
          />
          <ResumeSelect
            label={t(lang, "format")}
            value={layout.format}
            onValueChange={(v) =>
              mutate((_th, _tx, l) => {
                l.format = v as "A4" | "Letter"
                l.pageWidth = v === "A4" ? 794 : 816
              })
            }
            options={[
              { value: "A4", label: "A4" },
              { value: "Letter", label: "Letter" },
            ]}
          />
          <RangeRow
            label={t(lang, "margin")}
            value={layout.margin}
            min={8}
            max={40}
            step={1}
            unit="mm"
            onChange={(v) =>
              mutate((_th, _tx, l) => {
                l.margin = v
              })
            }
          />
          <RangeRow
            label={t(lang, "sectionSpacing")}
            value={layout.sectionSpacing}
            min={8}
            max={40}
            step={1}
            unit="px"
            onChange={(v) =>
              mutate((_th, _tx, l) => {
                l.sectionSpacing = v
              })
            }
          />
          <RangeRow
            label={t(lang, "columnRatio")}
            value={layout.columnRatio}
            min={30}
            max={70}
            step={1}
            unit="%"
            onChange={(v) =>
              mutate((_th, _tx, l) => {
                l.columnRatio = v
              })
            }
          />
          {layout.columns !== "double" && (
            <div className="text-xs text-muted-foreground">
              {lang === "zh-CN"
                ? "仅在双栏布局时生效。"
                : "Only effective in double-column layout."}
            </div>
          )}
          <div className="text-xs text-muted-foreground">
            {lang === "zh-CN"
              ? "预览与打印采用自动分页，页码显示为 1 / N。"
              : "Preview and print use automatic pagination with page numbers (1 / N)."}
          </div>
        </Group>
      </div>
    </div>
  )
}

const CUSTOMIZE_PANEL_WIDTH_KEY = "cvfree:customize-panel-width"
const CUSTOMIZE_PANEL_DEFAULT = 420
const CUSTOMIZE_PANEL_MIN = 320
const CUSTOMIZE_PANEL_MAX = 640

function clampCustomizePanelWidth(value: number) {
  return Math.min(CUSTOMIZE_PANEL_MAX, Math.max(CUSTOMIZE_PANEL_MIN, value))
}

const CUSTOMIZE_PANEL_HEIGHT_KEY = "cvfree:customize-panel-height"
const CUSTOMIZE_PANEL_HEIGHT_DEFAULT = 360
const CUSTOMIZE_PANEL_HEIGHT_MIN = 200
const CUSTOMIZE_PANEL_HEIGHT_MAX = 700

function clampCustomizePanelHeight(value: number) {
  return Math.min(
    CUSTOMIZE_PANEL_HEIGHT_MAX,
    Math.max(CUSTOMIZE_PANEL_HEIGHT_MIN, value),
  )
}

export function CustomizeDrawer({
  open,
  onOpenChange,
  inline = false,
  scope = "preferences",
  layout = "sidebar",
  width: controlledWidth,
  onWidthChange,
  fillHeight = false,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  inline?: boolean
  scope?: "preferences" | "active"
  layout?: "sidebar" | "stacked"
  width?: number
  onWidthChange?: (w: number) => void
  fillHeight?: boolean
}) {
  const lang = useAppStore((s) => s.language)
  const [internalWidth, setInternalWidth] = useState(CUSTOMIZE_PANEL_DEFAULT)
  const width = controlledWidth ?? internalWidth
  const widthHydratedRef = useRef(false)
  const onWidthChangeRef = useRef(onWidthChange)
  useEffect(() => {
    onWidthChangeRef.current = onWidthChange
  }, [onWidthChange])

  const setWidth = (w: number) => {
    const clamped = clampCustomizePanelWidth(w)
    if (onWidthChangeRef.current) onWidthChangeRef.current(clamped)
    else setInternalWidth(clamped)
  }

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CUSTOMIZE_PANEL_WIDTH_KEY)
      if (raw) {
        const parsed = Number(raw)
        if (Number.isFinite(parsed)) {
          const clamped = clampCustomizePanelWidth(parsed)
          if (onWidthChangeRef.current) onWidthChangeRef.current(clamped)
          // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate panel width from localStorage after mount
          else setInternalWidth(clamped)
        }
      }
    } catch {
      // ignore storage read errors
    }
    const id = requestAnimationFrame(() => {
      widthHydratedRef.current = true
    })
    return () => cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    if (!widthHydratedRef.current) return
    try {
      localStorage.setItem(
        CUSTOMIZE_PANEL_WIDTH_KEY,
        String(clampCustomizePanelWidth(width)),
      )
    } catch {
      // ignore storage write errors
    }
  }, [width])

  const [height, setHeight] = useState(CUSTOMIZE_PANEL_HEIGHT_DEFAULT)
  const heightHydratedRef = useRef(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CUSTOMIZE_PANEL_HEIGHT_KEY)
      if (raw) {
        const parsed = Number(raw)
        // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate panel height from localStorage after mount
        if (Number.isFinite(parsed))
          setHeight(clampCustomizePanelHeight(parsed))
      }
    } catch {
      // ignore storage read errors
    }
    const id = requestAnimationFrame(() => {
      heightHydratedRef.current = true
    })
    return () => cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    if (!heightHydratedRef.current) return
    try {
      localStorage.setItem(
        CUSTOMIZE_PANEL_HEIGHT_KEY,
        String(clampCustomizePanelHeight(height)),
      )
    } catch {
      // ignore storage write errors
    }
  }, [height])

  const dragRef = useRef<{ x: number; w: number } | null>(null)
  const heightDragRef = useRef<{ y: number; h: number } | null>(null)

  const onResizeStart = (e: React.MouseEvent) => {
    e.preventDefault()
    dragRef.current = { x: e.clientX, w: width }
    const onMove = (ev: MouseEvent) => {
      if (!dragRef.current) return
      setWidth(dragRef.current.w + ev.clientX - dragRef.current.x)
    }
    const onUp = () => {
      dragRef.current = null
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }
    document.body.style.cursor = "col-resize"
    document.body.style.userSelect = "none"
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
  }

  const onHeightResizeStart = (e: React.MouseEvent) => {
    e.preventDefault()
    heightDragRef.current = { y: e.clientY, h: height }
    const onMove = (ev: MouseEvent) => {
      if (!heightDragRef.current) return
      setHeight(
        clampCustomizePanelHeight(
          heightDragRef.current.h + heightDragRef.current.y - ev.clientY,
        ),
      )
    }
    const onUp = () => {
      heightDragRef.current = null
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }
    document.body.style.cursor = "row-resize"
    document.body.style.userSelect = "none"
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
  }

  const resizeHandle = (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize customize panel"
      onMouseDown={onResizeStart}
      className="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-blue-400/50 active:bg-blue-500/50 z-10"
      title="Drag to resize"
    />
  )

  const heightResizeHandle = (
    <div
      role="separator"
      aria-orientation="horizontal"
      aria-label="Resize customize panel height"
      onMouseDown={onHeightResizeStart}
      className="absolute left-0 right-0 top-0 h-1.5 cursor-row-resize hover:bg-blue-400/50 active:bg-blue-500/50 z-10"
      title="Drag to resize"
    />
  )

  if (inline) {
    if (layout === "stacked") {
      if (!open) {
        return (
          <button
            type="button"
            onClick={() => onOpenChange(true)}
            className="no-print shrink-0 border-t bg-background px-4 py-2 flex items-center justify-between gap-2 text-left hover:bg-muted/50 transition-colors"
            title={
              lang === "zh-CN" ? "展开自定义面板" : "Expand customize panel"
            }
            aria-label={
              lang === "zh-CN" ? "展开自定义面板" : "Expand customize panel"
            }
          >
            <span className="text-sm font-medium text-foreground">
              {t(lang, "customize")}
            </span>
            <Maximize2 className="w-4 h-4 text-muted-foreground" />
          </button>
        )
      }
      return (
        <div
          className={`no-print border-t overflow-hidden relative bg-background ${fillHeight ? "flex-1 min-h-0" : "shrink-0"}`}
          style={fillHeight ? undefined : { height }}
        >
          {!fillHeight ? heightResizeHandle : null}
          <CustomizePanel
            onClose={undefined}
            scope={scope}
            layout="stacked"
            hideHeader
          />
        </div>
      )
    }

    if (!open) {
      return (
        <button
          type="button"
          onClick={() => onOpenChange(true)}
          className="no-print shrink-0 border-r h-full bg-background flex flex-col items-center py-2 gap-2 hover:bg-muted/50 transition-colors px-1"
          title={lang === "zh-CN" ? "展开自定义面板" : "Expand customize panel"}
          aria-label={
            lang === "zh-CN" ? "展开自定义面板" : "Expand customize panel"
          }
        >
          <Maximize2 className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground [writing-mode:vertical-rl]">
            {t(lang, "customize")}
          </span>
        </button>
      )
    }
    return (
      <div
        className="no-print shrink-0 border-r h-full overflow-hidden relative bg-background"
        style={{ width }}
      >
        <CustomizePanel onClose={() => onOpenChange(false)} scope={scope} />
        {resizeHandle}
      </div>
    )
  }
  return (
    <div
      className={`no-print fixed top-14 right-0 bottom-0 bg-background border-l shadow-lg z-30 transform transition-transform duration-200 ${open ? "translate-x-0" : "translate-x-full"}`}
      style={{ width }}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-blue-400/50 active:bg-blue-500/50 z-10"
        onMouseDown={(e) => {
          e.preventDefault()
          dragRef.current = { x: e.clientX, w: width }
          const onMove = (ev: MouseEvent) => {
            if (!dragRef.current) return
            setWidth(dragRef.current.w + dragRef.current.x - ev.clientX)
          }
          const onUp = () => {
            dragRef.current = null
            window.removeEventListener("mousemove", onMove)
            window.removeEventListener("mouseup", onUp)
            document.body.style.cursor = ""
            document.body.style.userSelect = ""
          }
          document.body.style.cursor = "col-resize"
          document.body.style.userSelect = "none"
          window.addEventListener("mousemove", onMove)
          window.addEventListener("mouseup", onUp)
        }}
      />
      <CustomizePanel onClose={() => onOpenChange(false)} scope={scope} />
    </div>
  )
}

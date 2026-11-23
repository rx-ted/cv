"use client"

import {
  ChevronDown,
  ChevronUp,
  FileJson,
  FilePenLine,
  LayoutTemplate,
  Palette,
  RotateCcw,
  Upload,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState, useSyncExternalStore } from "react"
import { toast } from "sonner"
import { CustomizeDrawer } from "@/components/customize/CustomizeDrawer"
import { EditorFormPanel } from "@/components/editor/EditorFormPanel"
import { EditorHeader } from "@/components/editor/EditorHeader"
import { EditorPreviewPanel } from "@/components/editor/EditorPreviewPanel"
import { AppFooter } from "@/components/layout/AppFooter"
import { Button } from "@/components/ui/button"
import backendDevEn from "@/data/resume.backend-developer.en.json"
import backendDevZh from "@/data/resume.backend-developer.zh-CN.json"
import freshgradEn from "@/data/resume.freshgrad.en.json"
import freshgradZh from "@/data/resume.freshgrad.zh-CN.json"
import frontendDevEn from "@/data/resume.frontend-developer.en.json"
import frontendDevZh from "@/data/resume.frontend-developer.zh-CN.json"
import fullstackDevEn from "@/data/resume.fullstack-developer.en.json"
import fullstackDevZh from "@/data/resume.fullstack-developer.zh-CN.json"
import generalEn from "@/data/resume.general.en.json"
import generalZh from "@/data/resume.general.zh-CN.json"
import logisticsEn from "@/data/resume.logistics.en.json"
import logisticsZh from "@/data/resume.logistics.zh-CN.json"
import marketingEn from "@/data/resume.marketing.en.json"
import marketingZh from "@/data/resume.marketing.zh-CN.json"
import productManagerEn from "@/data/resume.product-manager.en.json"
import productManagerZh from "@/data/resume.product-manager.zh-CN.json"
import softwareEngineerEn from "@/data/resume.software-engineer.en.json"
import softwareEngineerZh from "@/data/resume.software-engineer.zh-CN.json"
import uiuxEn from "@/data/resume.uiux-designer.en.json"
import uiuxZh from "@/data/resume.uiux-designer.zh-CN.json"
import { parseImportedJson } from "@/exporters/json"
import { t } from "@/i18n/strings"
import { getDefaultResume, normalizeResume } from "@/lib/resume/document"
import { useAppStore } from "@/stores/app"
import type { ZoomMode } from "@/templates/ResumePreview"

const subscribeNoop = () => () => {}
const getMounted = () => true
const getServerMounted = () => false

const FORM_PANEL_WIDTH_KEY = "cvfree:editor-form-panel-width"
const FORM_PANEL_DEFAULT = 480
const FORM_PANEL_MIN = 320
const FORM_PANEL_MAX = 760

function clampFormPanelWidth(value: number) {
  return Math.min(FORM_PANEL_MAX, Math.max(FORM_PANEL_MIN, value))
}

type WorkspaceSection = "examples" | "content" | "design" | null

const EXAMPLE_OPTIONS = [
  { id: "general", zh: "通用岗位", en: "General" },
  { id: "software-engineer", zh: "软件工程师", en: "Software Engineer" },
  { id: "frontend-developer", zh: "前端工程师", en: "Frontend Developer" },
  { id: "backend-developer", zh: "后端工程师", en: "Backend Developer" },
  { id: "fullstack-developer", zh: "全栈工程师", en: "Full Stack Developer" },
  { id: "product-manager", zh: "产品经理", en: "Product Manager" },
  { id: "uiux-designer", zh: "UI/UX 设计师", en: "UI/UX Designer" },
  { id: "logistics", zh: "物流/供应链", en: "Logistics" },
  { id: "marketing", zh: "市场营销", en: "Marketing" },
  { id: "student", zh: "应届毕业生", en: "Student / Fresh Grad" },
] as const

type ExampleId = (typeof EXAMPLE_OPTIONS)[number]["id"] | null

export default function EditorPage() {
  const router = useRouter()
  const lang = useAppStore((s) => s.language)
  const resume = useAppStore((s) => (s.activeId ? s.resumes[s.activeId] : null))
  const importResume = useAppStore((s) => s.importResume)
  const resetActive = useAppStore((s) => s.resetActive)
  const mounted = useSyncExternalStore(
    subscribeNoop,
    getMounted,
    getServerMounted,
  )
  const [activeSection, setActiveSection] =
    useState<WorkspaceSection>("content")
  const [selectedExampleId, setSelectedExampleId] = useState<ExampleId>(null)
  const [zoom, setZoom] = useState<ZoomMode>(1)
  const [panelWidth, setPanelWidth] = useState(() => {
    if (typeof window === "undefined") return FORM_PANEL_DEFAULT
    try {
      const raw = localStorage.getItem(FORM_PANEL_WIDTH_KEY)
      if (raw) {
        const parsed = Number(raw)
        if (Number.isFinite(parsed)) return clampFormPanelWidth(parsed)
      }
    } catch {
      // ignore storage read errors
    }
    return FORM_PANEL_DEFAULT
  })
  const dragRef = useRef<{ x: number; w: number } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    try {
      localStorage.setItem(FORM_PANEL_WIDTH_KEY, String(panelWidth))
    } catch {
      // ignore storage write errors
    }
  }, [panelWidth])

  const onResizeStart = (e: React.MouseEvent) => {
    e.preventDefault()
    dragRef.current = { x: e.clientX, w: panelWidth }
    const onMove = (ev: MouseEvent) => {
      if (!dragRef.current) return
      const next = clampFormPanelWidth(
        dragRef.current.w + ev.clientX - dragRef.current.x,
      )
      setPanelWidth(next)
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

  useEffect(() => {
    if (mounted && !resume) router.replace("/")
  }, [mounted, resume, router])

  if (!mounted || !resume?.meta?.cvfree) {
    return <div className="p-8 text-sm text-muted-foreground">Loading...</div>
  }

  const getExampleRaw = (id: Exclude<ExampleId, null>) => {
    const isZh = lang === "zh-CN"
    switch (id) {
      case "general":
        return isZh ? generalZh : generalEn
      case "software-engineer":
        return isZh ? softwareEngineerZh : softwareEngineerEn
      case "frontend-developer":
        return isZh ? frontendDevZh : frontendDevEn
      case "backend-developer":
        return isZh ? backendDevZh : backendDevEn
      case "fullstack-developer":
        return isZh ? fullstackDevZh : fullstackDevEn
      case "product-manager":
        return isZh ? productManagerZh : productManagerEn
      case "uiux-designer":
        return isZh ? uiuxZh : uiuxEn
      case "logistics":
        return isZh ? logisticsZh : logisticsEn
      case "marketing":
        return isZh ? marketingZh : marketingEn
      case "student":
        return isZh ? freshgradZh : freshgradEn
      default:
        return isZh ? generalZh : generalEn
    }
  }

  const loadExampleById = (id: ExampleId) => {
    if (!id) return
    const raw = getExampleRaw(id)
    const doc = normalizeResume(raw, lang)
    doc.meta.cvfree.source = "template"
    const opt = EXAMPLE_OPTIONS.find((o) => o.id === id)
    doc.meta.cvfree.title = opt
      ? lang === "zh-CN"
        ? `${opt.zh}示例`
        : `${opt.en} Example`
      : lang === "zh-CN"
        ? "示例简历"
        : "Example Resume"
    importResume(doc)
    toast.success(lang === "zh-CN" ? "已加载示例" : "Example loaded")
  }

  const onImportJson = async (file: File) => {
    try {
      const text = await file.text()
      const doc = parseImportedJson(text)
      importResume(doc)
      toast.success(t(lang, "importSuccess"))
    } catch {
      toast.error(t(lang, "importError"))
    }
  }

  const onReset = () => {
    resetActive()
    toast.success(
      lang === "zh-CN" ? "已重置为初始数据" : "Reset to initial data",
    )
  }

  const toggleSection = (section: WorkspaceSection) => {
    setActiveSection((prev) => (prev === section ? null : section))
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <EditorHeader resume={resume} />
      <div className="flex h-[calc(100vh-3.5rem)] min-h-[640px] overflow-hidden print:h-auto print:min-h-0 print:overflow-visible print:block">
        <div
          className="flex flex-col shrink-0 min-h-0 border-r bg-muted/30 no-print"
          style={{ width: panelWidth }}
        >
          <div className="shrink-0 px-4 py-3 border-b bg-background/60">
            <h2 className="text-lg font-bold text-foreground">
              {t(lang, "editorPanel")}
            </h2>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto">
            {/* Examples & Templates */}
            <div className="border-b">
              <button
                type="button"
                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
                onClick={() => toggleSection("examples")}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">01</span>
                  <LayoutTemplate className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">
                      {t(lang, "examplesTemplates")}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t(lang, "examplesTemplatesDesc")}
                    </div>
                  </div>
                </div>
                {activeSection === "examples" ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
              <div
                className={`grid transition-all duration-200 ease-out ${
                  activeSection === "examples"
                    ? "grid-rows-[1fr]"
                    : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-4 pb-4 space-y-3">
                    <div className="grid grid-cols-1 gap-2">
                      {EXAMPLE_OPTIONS.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => loadExampleById(opt.id)}
                          className="text-left rounded-md border px-3 py-2 text-sm transition-colors border-border hover:bg-muted/50 hover:border-primary/50"
                        >
                          <div className="font-medium">
                            {lang === "zh-CN" ? opt.zh : opt.en}
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <FileJson className="w-4 h-4 mr-1.5" />
                        {lang === "zh-CN"
                          ? "导入 JSON Resume"
                          : "Import JSON Resume"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={onReset}
                      >
                        <RotateCcw className="w-4 h-4 mr-1.5" />
                        {lang === "zh-CN" ? "重置" : "Reset"}
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="application/json"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0]
                          if (f) void onImportJson(f)
                          e.target.value = ""
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Content Editor */}
            <div className="border-b">
              <button
                type="button"
                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
                onClick={() => toggleSection("content")}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">02</span>
                  <FilePenLine className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">
                      {lang === "zh-CN" ? "内容编辑" : "Content Editor"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {lang === "zh-CN"
                        ? "编辑简历各模块内容"
                        : "Edit resume sections"}
                    </div>
                  </div>
                </div>
                {activeSection === "content" ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
              <div
                className={`grid transition-all duration-200 ease-out ${
                  activeSection === "content"
                    ? "grid-rows-[1fr]"
                    : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-2 pb-2">
                    <EditorFormPanel
                      resume={resume}
                      lang={lang}
                      open={true}
                      onToggle={() => {}}
                      layout="stacked"
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Visual Design */}
            <div
              className={`border-b ${activeSection === "design" ? "flex-1 min-h-0 flex flex-col" : ""}`}
            >
              <button
                type="button"
                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
                onClick={() => toggleSection("design")}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">03</span>
                  <Palette className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">
                      {lang === "zh-CN" ? "视觉设计" : "Visual Design"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {lang === "zh-CN"
                        ? "模板、主题与排版"
                        : "Templates, theme & layout"}
                    </div>
                  </div>
                </div>
                {activeSection === "design" ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
              {activeSection === "design" ? (
                <div className="flex-1 min-h-0 overflow-hidden px-2 pb-2">
                  <CustomizeDrawer
                    open={true}
                    onOpenChange={() => {}}
                    inline
                    layout="stacked"
                    fillHeight={true}
                    scope="active"
                  />
                </div>
              ) : (
                <div className="grid transition-all duration-200 ease-out grid-rows-[0fr]">
                  <div className="overflow-hidden">
                    <div className="px-2 pb-2" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize panel"
          onMouseDown={onResizeStart}
          className="w-1.5 shrink-0 cursor-col-resize bg-border hover:bg-blue-400 active:bg-blue-500 transition-colors no-print"
          title="Drag to resize"
        />
        <EditorPreviewPanel
          resume={resume}
          lang={lang}
          zoom={zoom}
          onZoomChange={setZoom}
        />
      </div>
      <AppFooter lang={lang} />
    </div>
  )
}

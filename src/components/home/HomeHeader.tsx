"use client"

import { ChevronDown, Download, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useRef } from "react"
import { toast } from "sonner"
import { AppHeaderShell } from "@/components/layout/AppHeaderShell"
import { AppLogo } from "@/components/layout/AppLogo"
import { LanguageMenu } from "@/components/layout/LanguageMenu"
import { ThemeToggle } from "@/components/layout/ThemeToggle"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { exportDocx } from "@/exporters/docx"
import { exportJsonResume, parseImportedJson } from "@/exporters/json"
import { exportPdf } from "@/exporters/pdf"
import { t } from "@/i18n/strings"
import { getDefaultResume } from "@/lib/resume/document"
import { useAppStore } from "@/stores/app"
import { getTemplateLabel } from "@/templates/labels"
import { TEMPLATES } from "@/templates/registry"

export function HomeHeader() {
  const router = useRouter()
  const lang = useAppStore((s) => s.language)
  const prefs = useAppStore((s) => s.preferences)
  const createBlank = useAppStore((s) => s.createBlank)
  const createFromDefault = useAppStore((s) => s.createFromDefault)
  const createFromTemplate = useAppStore((s) => s.createFromTemplate)
  const importResume = useAppStore((s) => s.importResume)
  const fileRef = useRef<HTMLInputElement>(null)

  const previewDoc = () => {
    const base = getDefaultResume(lang)
    const copy = structuredClone(base)
    copy.meta.cvfree.theme = structuredClone(prefs.theme)
    copy.meta.cvfree.text = structuredClone(prefs.text)
    copy.meta.cvfree.layout = structuredClone(prefs.layout)
    return copy
  }

  const onBlank = () => {
    createBlank(prefs.theme.template)
    router.push("/editor")
  }
  const onFromCurrent = () => {
    createFromDefault()
    router.push("/editor")
  }
  const onFromTemplate = (tid: string) => {
    createFromTemplate(tid)
    router.push("/editor")
  }

  const onImport = async (file: File) => {
    try {
      const text = await file.text()
      const doc = parseImportedJson(text)
      importResume(doc)
      toast.success(t(lang, "importSuccess"))
      router.push("/editor")
    } catch {
      toast.error(t(lang, "importError"))
    }
  }

  return (
    <AppHeaderShell
      left={<AppLogo lang={lang} />}
      right={
        <>
          <LanguageMenu />
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="outline" size="sm" />}
            >
              <Plus className="w-4 h-4 mr-1" />
              {t(lang, "edit")}
              <ChevronDown className="w-3 h-3 ml-1" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem onClick={onBlank}>
                {t(lang, "blankResume")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onFromCurrent}>
                {t(lang, "createFromCurrent")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel>{t(lang, "fromTemplate")}</DropdownMenuLabel>
                {TEMPLATES.map((tpl) => (
                  <DropdownMenuItem
                    key={tpl.id}
                    onClick={() => onFromTemplate(tpl.id)}
                  >
                    {getTemplateLabel(lang, tpl.id, tpl.name)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button size="sm" />}>
              <Download className="w-4 h-4 mr-1" />
              {t(lang, "export")}
              <ChevronDown className="w-3 h-3 ml-1" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => exportPdf(lang)}>
                PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportDocx(previewDoc(), lang)}>
                DOCX
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportJsonResume(previewDoc())}>
                JSON Resume
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => fileRef.current?.click()}>
                {t(lang, "importJson")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) onImport(f)
              e.target.value = ""
            }}
          />
        </>
      }
    />
  )
}

"use client"

import { ArrowLeft, Download, Redo2, RotateCcw, Undo2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { AppHeaderShell } from "@/components/layout/AppHeaderShell"
import { AppLogo } from "@/components/layout/AppLogo"
import { LanguageMenu } from "@/components/layout/LanguageMenu"
import { ThemeToggle } from "@/components/layout/ThemeToggle"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ResumeInput } from "@/components/ui/resume-input"
import { exportDocx } from "@/exporters/docx"
import { exportJsonResume } from "@/exporters/json"
import { exportPdf } from "@/exporters/pdf"
import { t } from "@/i18n/strings"
import type { ResumeDocument } from "@/lib/resume/schema"
import { useAppStore } from "@/stores/app"

export function EditorHeader({ resume }: { resume: ResumeDocument }) {
  const router = useRouter()
  const lang = useAppStore((s) => s.language)
  const renameResume = useAppStore((s) => s.renameResume)
  const undo = useAppStore((s) => s.undo)
  const redo = useAppStore((s) => s.redo)
  const resetActive = useAppStore((s) => s.resetActive)
  const cv = resume.meta.cvfree

  return (
    <AppHeaderShell
      containerClassName="max-w-full px-3"
      left={
        <>
          <AppLogo lang={lang} />
          <div className="h-5 w-px bg-border mx-1 hidden sm:block" />
          <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
            <ArrowLeft className="w-4 h-4 mr-1" />
            {t(lang, "backToPreview")}
          </Button>
          <ResumeInput
            value={cv.title}
            onChange={(e) => renameResume(cv.id, e.target.value)}
            aria-label={t(lang, "resumeName")}
            inputSize="sm"
            appearance="outlined"
            containerClassName="space-y-0"
            className="w-44 md:w-56"
          />
          <span className="text-xs text-green-600 whitespace-nowrap hidden sm:inline">
            {t(lang, "saved")}
          </span>
        </>
      }
      right={
        <>
          <LanguageMenu />
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (
                window.confirm(
                  lang === "zh-CN"
                    ? "确定重置为创建时的初始内容？"
                    : "Reset to the initial content?",
                )
              )
                resetActive()
            }}
            title={lang === "zh-CN" ? "一键重置" : "Reset"}
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            {lang === "zh-CN" ? "重置" : "Reset"}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={undo}
            title={t(lang, "undo")}
          >
            <Undo2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={redo}
            title={t(lang, "redo")}
          >
            <Redo2 className="w-4 h-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="outline" size="sm" />}
            >
              <Download className="w-4 h-4 mr-1" />
              {t(lang, "export")}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => exportPdf(lang)}>
                PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportDocx(resume, lang)}>
                DOCX
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportJsonResume(resume)}>
                JSON Resume
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      }
    />
  )
}

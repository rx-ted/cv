"use client"

import { Languages } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { t } from "@/i18n/strings"
import { useAppStore } from "@/stores/app"

export function LanguageMenu() {
  const lang = useAppStore((s) => s.language)
  const setLanguage = useAppStore((s) => s.setLanguage)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="sm" />}>
        <Languages className="w-4 h-4 mr-1" />
        {lang === "zh-CN" ? t(lang, "chinese") : t(lang, "english")}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => setLanguage("zh-CN")}>
          中文
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("en")}>
          English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

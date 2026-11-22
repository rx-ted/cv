"use client"

import Image from "next/image"
import Link from "next/link"
import { t } from "@/i18n/strings"
import type { AppLanguage } from "@/lib/resume/schema"

export function AppLogo({ lang }: { lang: AppLanguage }) {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 hover:opacity-90 transition-opacity shrink-0"
    >
      <Image
        src="/icon-192x192.png"
        alt={t(lang, "appName")}
        width={28}
        height={28}
        className="rounded-sm"
      />
      <span className="font-semibold text-lg">{t(lang, "appName")}</span>
    </Link>
  )
}

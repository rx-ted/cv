"use client"

import { t } from "@/i18n/strings"
import type { AppLanguage } from "@/lib/resume/schema"

const EXTERNAL_LINKS = [
  { zh: "个人数字门户", en: "Personal Hub", href: "https://19981204.xyz" },
  { zh: "博客", en: "Blog", href: "https://blog.19981204.xyz" },
  { zh: "图片托管服务", en: "Picx", href: "https://picx.19981204.xyz" },
  { zh: "简历编辑器", en: "CV", href: "https://cv.19981204.xyz" },
]

export function AppFooter({ lang }: { lang: AppLanguage }) {
  const year = new Date().getFullYear()
  const isZh = lang === "zh-CN"
  const legal = [
    { label: isZh ? "服务条款" : "Terms", href: "/terms" },
    { label: isZh ? "隐私政策" : "Privacy", href: "/privacy" },
  ]

  return (
    <footer className="no-print border-t bg-background/80">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm font-medium text-foreground/80">
            {isZh ? "更多链接" : "More Links"}
          </div>
          <nav
            className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground"
            aria-label={isZh ? "外部链接" : "External links"}
          >
            {EXTERNAL_LINKS.map((item) => (
              <a
                key={item.en}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="hover:text-foreground transition-colors"
              >
                {isZh ? item.zh : item.en}
              </a>
            ))}
          </nav>
        </div>

        <div className="border-t pt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>
              © 2026{" "}
              <a
                href="https://github.com/rx-ted"
                target="_blank"
                rel="noreferrer"
                className="hover:text-foreground transition-colors underline-offset-2 hover:underline"
              >
                rx-ted / 木羽
              </a>
              {isZh ? "。保留所有权利。" : ". All rights reserved."}
            </span>
          </div>
          <nav
            className="flex flex-wrap items-center gap-x-4 gap-y-1"
            aria-label={isZh ? "法律信息" : "Legal"}
          >
            {legal.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="hover:text-foreground transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}

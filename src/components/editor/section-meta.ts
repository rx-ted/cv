import type { ReactNode } from "react"
import type { UIKey } from "@/i18n/strings"
import type { AppLanguage, ResumeDocument } from "@/lib/resume/schema"

export type SectionKey =
  | "basics"
  | "work"
  | "education"
  | "projects"
  | "skills"
  | "certificates"
  | "languages"
  | "interests"
  | "awards"
  | "publications"
  | "volunteer"
  | "references"
  | "custom"

export type SectionMeta = {
  key: SectionKey
  labelKey: UIKey
  fixed?: boolean // cannot be reordered (basics)
  canHide?: boolean
}

export const SECTION_META: Record<SectionKey, SectionMeta> = {
  basics: { key: "basics", labelKey: "basics", fixed: true, canHide: false },
  work: { key: "work", labelKey: "work", canHide: true },
  education: { key: "education", labelKey: "education", canHide: true },
  projects: { key: "projects", labelKey: "projects", canHide: true },
  skills: { key: "skills", labelKey: "skills", canHide: true },
  certificates: {
    key: "certificates",
    labelKey: "certificates",
    canHide: true,
  },
  languages: { key: "languages", labelKey: "languagesSec", canHide: true },
  interests: { key: "interests", labelKey: "interests", canHide: true },
  awards: { key: "awards", labelKey: "awards", canHide: true },
  publications: {
    key: "publications",
    labelKey: "publications",
    canHide: true,
  },
  volunteer: { key: "volunteer", labelKey: "volunteer", canHide: true },
  references: { key: "references", labelKey: "references", canHide: true },
  custom: { key: "custom", labelKey: "custom", canHide: true },
}

export const DEFAULT_SECTION_ORDER: SectionKey[] = [
  "basics",
  "work",
  "education",
  "projects",
  "skills",
  "certificates",
  "languages",
  "interests",
  "awards",
  "publications",
  "volunteer",
  "references",
  "custom",
]

export function normalizeSectionOrder(order?: string[]): SectionKey[] {
  const known = new Set(DEFAULT_SECTION_ORDER)
  const seen = new Set<SectionKey>()
  const out: SectionKey[] = []
  for (const k of order || []) {
    if (known.has(k as SectionKey) && !seen.has(k as SectionKey)) {
      seen.add(k as SectionKey)
      out.push(k as SectionKey)
    }
  }
  for (const k of DEFAULT_SECTION_ORDER) {
    if (!seen.has(k)) out.push(k)
  }
  // ensure basics first and fixed
  const withoutBasics = out.filter((k) => k !== "basics")
  return ["basics", ...withoutBasics]
}

export type SectionControlProps = {
  open: boolean
  onToggleOpen: () => void
  dragHandle?: ReactNode
  onMoveUp?: () => void
  onMoveDown?: () => void
  canMoveUp?: boolean
  canMoveDown?: boolean
  onDeleteModule?: () => void
}

export type SectionEditorProps = {
  resume: ResumeDocument
  lang: AppLanguage
} & SectionControlProps

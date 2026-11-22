"use client"

import { GripVertical } from "lucide-react"
import { type ReactNode, useState } from "react"
import {
  Sortable,
  SortableItem,
  SortableItemHandle,
} from "@/components/reui/sortable"
import { t } from "@/i18n/strings"
import type { AppLanguage, ResumeDocument } from "@/lib/resume/schema"
import { useAppStore } from "@/stores/app"
import {
  normalizeSectionOrder,
  SECTION_META,
  type SectionEditorProps,
  type SectionKey,
} from "./section-meta"
import { AwardsSection } from "./sections/AwardsSection"
import { BasicsSection } from "./sections/BasicsSection"
import { CertificatesSection } from "./sections/CertificatesSection"
import { CustomSectionsEditor } from "./sections/CustomSectionsEditor"
import { EducationSection } from "./sections/EducationSection"
import { InterestsSection } from "./sections/InterestsSection"
import { LanguagesSection } from "./sections/LanguagesSection"
import { ProjectsSection } from "./sections/ProjectsSection"
import { PublicationsSection } from "./sections/PublicationsSection"
import { ReferencesSection } from "./sections/ReferencesSection"
import { SkillsSection } from "./sections/SkillsSection"
import { VolunteerSection } from "./sections/VolunteerSection"
import { WorkSection } from "./sections/WorkSection"

const RENDERERS: Record<SectionKey, React.ComponentType<SectionEditorProps>> = {
  basics: BasicsSection,
  work: WorkSection,
  education: EducationSection,
  projects: ProjectsSection,
  skills: SkillsSection,
  certificates: CertificatesSection,
  languages: LanguagesSection,
  interests: InterestsSection,
  awards: AwardsSection,
  publications: PublicationsSection,
  volunteer: VolunteerSection,
  references: ReferencesSection,
  custom: CustomSectionsEditor,
}

function clearSectionData(d: ResumeDocument, key: SectionKey) {
  switch (key) {
    case "work":
      d.work = []
      break
    case "education":
      d.education = []
      break
    case "projects":
      d.projects = []
      break
    case "skills":
      d.skills = []
      break
    case "certificates":
      d.certificates = []
      break
    case "languages":
      d.languages = []
      break
    case "interests":
      d.interests = []
      break
    case "awards":
      d.awards = []
      break
    case "publications":
      d.publications = []
      break
    case "volunteer":
      d.volunteer = []
      break
    case "references":
      d.references = []
      break
    case "custom":
      d.meta.cvfree.customSections = []
      break
    default:
      break
  }
}

export function ResumeForm({
  resume,
  lang,
}: {
  resume: ResumeDocument
  lang: AppLanguage
}) {
  const updateActive = useAppStore((s) => s.updateActive)
  const [activeKey, setActiveKey] = useState<SectionKey | null>("basics")
  const order = normalizeSectionOrder(resume.meta.cvfree.sectionOrder)
  const fixed = order.filter((k) => SECTION_META[k]?.fixed)
  const reorderable = order.filter((k) => !SECTION_META[k]?.fixed)

  const setOrder = (nextReorderable: SectionKey[]) => {
    updateActive((d) => {
      d.meta.cvfree.sectionOrder = [...fixed, ...nextReorderable]
    })
  }

  const move = (key: SectionKey, dir: -1 | 1) => {
    const idx = reorderable.indexOf(key)
    if (idx < 0) return
    const nextIdx = idx + dir
    if (nextIdx < 0 || nextIdx >= reorderable.length) return
    const next = [...reorderable]
    const [item] = next.splice(idx, 1)
    next.splice(nextIdx, 0, item)
    setOrder(next)
  }

  const deleteModule = (key: SectionKey) => {
    const meta = SECTION_META[key]
    if (!meta || meta.fixed) return
    const ok = window.confirm(
      lang === "zh-CN"
        ? `确定删除“${t(lang, meta.labelKey)}”模块吗？此操作会清空该模块内容并隐藏。`
        : `Delete "${t(lang, meta.labelKey)}" section? This will clear its content and hide it.`,
    )
    if (!ok) return
    updateActive((d) => {
      clearSectionData(d, key)
      d.meta.cvfree.sectionVisibility[key] = false
    })
    if (activeKey === key) setActiveKey("basics")
  }

  const renderSection = (key: SectionKey, dragHandle?: ReactNode) => {
    const Comp = RENDERERS[key]
    if (!Comp) return null
    const meta = SECTION_META[key]
    const idx = reorderable.indexOf(key)
    const isReorderable = !!meta && !meta.fixed
    return (
      <Comp
        key={key}
        resume={resume}
        lang={lang}
        open={activeKey === key}
        onToggleOpen={() => setActiveKey((cur) => (cur === key ? null : key))}
        dragHandle={dragHandle}
        onMoveUp={isReorderable ? () => move(key, -1) : undefined}
        onMoveDown={isReorderable ? () => move(key, 1) : undefined}
        canMoveUp={isReorderable && idx > 0}
        canMoveDown={isReorderable && idx >= 0 && idx < reorderable.length - 1}
        onDeleteModule={isReorderable ? () => deleteModule(key) : undefined}
      />
    )
  }

  return (
    <div className="space-y-3">
      {fixed.map((k) => renderSection(k))}
      <Sortable
        value={reorderable}
        onValueChange={setOrder}
        getItemValue={(k) => k}
        className="space-y-3"
      >
        {reorderable.map((k) => (
          <SortableItem key={k} value={k}>
            {renderSection(
              k,
              <SortableItemHandle className="text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing shrink-0 mr-0.5">
                <GripVertical className="w-4 h-4" />
              </SortableItemHandle>,
            )}
          </SortableItem>
        ))}
      </Sortable>
    </div>
  )
}

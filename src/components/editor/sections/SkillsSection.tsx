"use client"

import { Field } from "@/components/editor/ui/Field"
import { ItemCard } from "@/components/editor/ui/ItemCard"
import { SectionCard } from "@/components/editor/ui/SectionCard"
import { Sortable } from "@/components/reui/sortable"
import { ResumeSelect } from "@/components/ui/resume-select"
import { t } from "@/i18n/strings"
import { uid } from "@/lib/resume/schema"
import { useAppStore } from "@/stores/app"
import type { SectionEditorProps } from "../section-meta"

export function SkillsSection({
  resume,
  lang,
  open,
  onToggleOpen,
  dragHandle,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  onDeleteModule,
}: SectionEditorProps) {
  const updateActive = useAppStore((s) => s.updateActive)
  const visible = resume.meta.cvfree.sectionVisibility.skills !== false
  const items = resume.skills
  return (
    <SectionCard
      id="section-skills"
      title={t(lang, "skills")}
      visible={visible}
      hiddenLabel={t(lang, "hidden")}
      moveUpLabel={t(lang, "moveUp")}
      moveDownLabel={t(lang, "moveDown")}
      deleteModuleLabel={t(lang, "deleteModule")}
      showLabel={t(lang, "show")}
      hideLabelAction={t(lang, "hide")}
      open={open}
      onOpenChange={() => onToggleOpen()}
      dragHandle={dragHandle}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      canMoveUp={canMoveUp}
      canMoveDown={canMoveDown}
      onDeleteModule={onDeleteModule}
      count={items.length}
      onToggle={() =>
        updateActive((d) => {
          d.meta.cvfree.sectionVisibility.skills = !visible
        })
      }
      onAdd={() =>
        updateActive((d) => {
          d.skills.push({
            id: uid("skill"),
            name: "",
            level: "",
            keywords: [],
            visible: true,
          })
        })
      }
      addLabel={t(lang, "add")}
    >
      {items.length === 0 ? (
        <div className="text-xs text-muted-foreground">
          {t(lang, "noContent")}
        </div>
      ) : (
        <Sortable
          value={items}
          onValueChange={(next) =>
            updateActive((d) => {
              d.skills = next
            })
          }
          getItemValue={(i) => i.id}
          className="space-y-3"
        >
          {items.map((s) => (
            <ItemCard
              key={s.id}
              id={s.id}
              onDelete={() =>
                updateActive((d) => {
                  d.skills = d.skills.filter((x) => x.id !== s.id)
                })
              }
            >
              <div className="grid grid-cols-1 @md:grid-cols-2 gap-2">
                <Field
                  label={t(lang, "skillName")}
                  value={s.name}
                  onChange={(v) =>
                    updateActive((d) => {
                      const it = d.skills.find((x) => x.id === s.id)
                      if (it) it.name = v
                    })
                  }
                />
                <ResumeSelect
                  label={t(lang, "level")}
                  value={s.level || ""}
                  onValueChange={(v) =>
                    updateActive((d) => {
                      const it = d.skills.find((x) => x.id === s.id)
                      if (it) it.level = v
                    })
                  }
                  options={[
                    { value: "", label: t(lang, "notSet") },
                    { value: "新手", label: t(lang, "skillLevelNovice") },
                    { value: "初级", label: t(lang, "skillLevelBeginner") },
                    { value: "熟练", label: t(lang, "skillLevelSkillful") },
                    { value: "资深", label: t(lang, "skillLevelExperienced") },
                    { value: "专家", label: t(lang, "skillLevelExpert") },
                  ]}
                />
              </div>
              <Field
                label={t(lang, "keywords")}
                value={(s.keywords || []).join(", ")}
                onChange={(v) =>
                  updateActive((d) => {
                    const it = d.skills.find((x) => x.id === s.id)
                    if (it)
                      it.keywords = v
                        .split(",")
                        .map((x) => x.trim())
                        .filter(Boolean)
                  })
                }
              />
            </ItemCard>
          ))}
        </Sortable>
      )}
    </SectionCard>
  )
}

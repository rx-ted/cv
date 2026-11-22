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

export function LanguagesSection({
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
  const visible = resume.meta.cvfree.sectionVisibility.languages !== false
  const items = resume.languages
  return (
    <SectionCard
      id="section-languages"
      title={t(lang, "languagesSec")}
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
          d.meta.cvfree.sectionVisibility.languages = !visible
        })
      }
      onAdd={() =>
        updateActive((d) => {
          d.languages.push({
            id: uid("lang"),
            language: "",
            fluency: "",
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
              d.languages = next
            })
          }
          getItemValue={(i) => i.id}
          className="space-y-3"
        >
          {items.map((l) => (
            <ItemCard
              key={l.id}
              id={l.id}
              onDelete={() =>
                updateActive((d) => {
                  d.languages = d.languages.filter((x) => x.id !== l.id)
                })
              }
            >
              <div className="grid grid-cols-1 @md:grid-cols-2 gap-2">
                <Field
                  label={t(lang, "name")}
                  value={l.language}
                  onChange={(v) =>
                    updateActive((d) => {
                      const it = d.languages.find((x) => x.id === l.id)
                      if (it) it.language = v
                    })
                  }
                />
                <ResumeSelect
                  label={t(lang, "fluency")}
                  value={l.fluency || ""}
                  onValueChange={(v) =>
                    updateActive((d) => {
                      const it = d.languages.find((x) => x.id === l.id)
                      if (it) it.fluency = v
                    })
                  }
                  options={[
                    { value: "", label: t(lang, "notSet") },
                    { value: "基础", label: t(lang, "langFluencyBasic") },
                    {
                      value: "会话",
                      label: t(lang, "langFluencyConversational"),
                    },
                    { value: "熟练", label: t(lang, "langFluencyProficient") },
                    { value: "流利", label: t(lang, "langFluencyFluent") },
                    { value: "母语", label: t(lang, "langFluencyNative") },
                  ]}
                />
              </div>
            </ItemCard>
          ))}
        </Sortable>
      )}
    </SectionCard>
  )
}

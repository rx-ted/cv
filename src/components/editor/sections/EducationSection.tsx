"use client"

import { RichText } from "@/components/editor/RichText"
import { Field } from "@/components/editor/ui/Field"
import { ItemCard } from "@/components/editor/ui/ItemCard"
import { SectionCard } from "@/components/editor/ui/SectionCard"
import { Sortable } from "@/components/reui/sortable"
import { Label } from "@/components/ui/label"
import { t } from "@/i18n/strings"
import { uid } from "@/lib/resume/schema"
import { useAppStore } from "@/stores/app"
import type { SectionEditorProps } from "../section-meta"

export function EducationSection({
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
  const visible = resume.meta.cvfree.sectionVisibility.education !== false
  const items = resume.education
  return (
    <SectionCard
      id="section-education"
      title={t(lang, "education")}
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
          d.meta.cvfree.sectionVisibility.education = !visible
        })
      }
      onAdd={() =>
        updateActive((d) => {
          d.education.push({
            id: uid("edu"),
            institution: "",
            url: "",
            area: "",
            studyType: "",
            startDate: "",
            endDate: "",
            gpa: "",
            courses: [],
            highlights: [],
            summary: "",
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
              d.education = next
            })
          }
          getItemValue={(i) => i.id}
          className="space-y-3"
        >
          {items.map((e) => (
            <ItemCard
              key={e.id}
              id={e.id}
              onDelete={() =>
                updateActive((d) => {
                  d.education = d.education.filter((x) => x.id !== e.id)
                })
              }
            >
              <div className="grid grid-cols-1 @md:grid-cols-2 gap-2">
                <Field
                  label={t(lang, "institution")}
                  value={e.institution}
                  onChange={(v) =>
                    updateActive((d) => {
                      const it = d.education.find((x) => x.id === e.id)
                      if (it) it.institution = v
                    })
                  }
                />
                <Field
                  label={t(lang, "studyType")}
                  value={e.studyType}
                  onChange={(v) =>
                    updateActive((d) => {
                      const it = d.education.find((x) => x.id === e.id)
                      if (it) it.studyType = v
                    })
                  }
                />
                <Field
                  label={t(lang, "area")}
                  value={e.area}
                  onChange={(v) =>
                    updateActive((d) => {
                      const it = d.education.find((x) => x.id === e.id)
                      if (it) it.area = v
                    })
                  }
                />
                <Field
                  label={t(lang, "gpa")}
                  value={e.gpa}
                  onChange={(v) =>
                    updateActive((d) => {
                      const it = d.education.find((x) => x.id === e.id)
                      if (it) it.gpa = v
                    })
                  }
                />
                <Field
                  label={t(lang, "startDate")}
                  value={e.startDate}
                  onChange={(v) =>
                    updateActive((d) => {
                      const it = d.education.find((x) => x.id === e.id)
                      if (it) it.startDate = v
                    })
                  }
                />
                <Field
                  label={t(lang, "endDate")}
                  value={e.endDate}
                  onChange={(v) =>
                    updateActive((d) => {
                      const it = d.education.find((x) => x.id === e.id)
                      if (it) it.endDate = v
                    })
                  }
                />
                <Field
                  className="col-span-2"
                  label={t(lang, "url")}
                  value={e.url}
                  onChange={(v) =>
                    updateActive((d) => {
                      const it = d.education.find((x) => x.id === e.id)
                      if (it) it.url = v
                    })
                  }
                />
                <Field
                  className="col-span-2"
                  label={t(lang, "courses")}
                  value={(e.courses || []).join(", ")}
                  onChange={(v) =>
                    updateActive((d) => {
                      const it = d.education.find((x) => x.id === e.id)
                      if (it)
                        it.courses = v
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean)
                    })
                  }
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">{t(lang, "description")}</Label>
                <RichText
                  value={e.summary}
                  onChange={(v) =>
                    updateActive((d) => {
                      const it = d.education.find((x) => x.id === e.id)
                      if (it) it.summary = v
                    })
                  }
                />
              </div>
              <Field
                label={t(lang, "highlights")}
                value={(e.highlights || []).join("\n")}
                onChange={(v) =>
                  updateActive((d) => {
                    const it = d.education.find((x) => x.id === e.id)
                    if (it) it.highlights = v.split("\n").filter(Boolean)
                  })
                }
                textarea
                rows={3}
              />
            </ItemCard>
          ))}
        </Sortable>
      )}
    </SectionCard>
  )
}

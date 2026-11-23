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

export function WorkSection({
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
  const cv = resume.meta.cvfree
  const visible = cv.sectionVisibility.work !== false
  const items = resume.work
  return (
    <SectionCard
      id="section-work"
      title={t(lang, "work")}
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
          d.meta.cvfree.sectionVisibility.work = !visible
        })
      }
      onAdd={() =>
        updateActive((d) => {
          d.work.push({
            id: uid("work"),
            name: "",
            position: "",
            url: "",
            startDate: "",
            endDate: "",
            summary: "",
            highlights: [],
            location: "",
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
              d.work = next
            })
          }
          getItemValue={(i) => i.id}
          className="space-y-3"
        >
          {items.map((w) => (
            <ItemCard
              key={w.id}
              id={w.id}
              onDelete={() =>
                updateActive((d) => {
                  d.work = d.work.filter((x) => x.id !== w.id)
                })
              }
            >
              <div className="grid grid-cols-1 @md:grid-cols-2 gap-2">
                <Field
                  label={t(lang, "company")}
                  value={w.name}
                  onChange={(v) =>
                    updateActive((d) => {
                      const it = d.work.find((x) => x.id === w.id)
                      if (it) it.name = v
                    })
                  }
                />
                <Field
                  label={t(lang, "position")}
                  value={w.position}
                  onChange={(v) =>
                    updateActive((d) => {
                      const it = d.work.find((x) => x.id === w.id)
                      if (it) it.position = v
                    })
                  }
                />
                <Field
                  label={t(lang, "location")}
                  value={w.location}
                  onChange={(v) =>
                    updateActive((d) => {
                      const it = d.work.find((x) => x.id === w.id)
                      if (it) it.location = v
                    })
                  }
                />
                <Field
                  label={t(lang, "url")}
                  value={w.url}
                  onChange={(v) =>
                    updateActive((d) => {
                      const it = d.work.find((x) => x.id === w.id)
                      if (it) it.url = v
                    })
                  }
                />
                <Field
                  label={t(lang, "startDate")}
                  value={w.startDate}
                  onChange={(v) =>
                    updateActive((d) => {
                      const it = d.work.find((x) => x.id === w.id)
                      if (it) it.startDate = v
                    })
                  }
                />
                <Field
                  label={t(lang, "endDate")}
                  value={w.endDate}
                  onChange={(v) =>
                    updateActive((d) => {
                      const it = d.work.find((x) => x.id === w.id)
                      if (it) it.endDate = v
                    })
                  }
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">{t(lang, "description")}</Label>
                <RichText
                  value={w.summary}
                  onChange={(v) =>
                    updateActive((d) => {
                      const it = d.work.find((x) => x.id === w.id)
                      if (it) it.summary = v
                    })
                  }
                />
              </div>
              <Field
                label={t(lang, "highlights")}
                value={(w.highlights || []).join("\n")}
                onChange={(v) =>
                  updateActive((d) => {
                    const it = d.work.find((x) => x.id === w.id)
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

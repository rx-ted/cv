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

export function VolunteerSection({
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
  const visible = resume.meta.cvfree.sectionVisibility.volunteer !== false
  const items = resume.volunteer
  return (
    <SectionCard
      id="section-volunteer"
      title={t(lang, "volunteer")}
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
          d.meta.cvfree.sectionVisibility.volunteer = !visible
        })
      }
      onAdd={() =>
        updateActive((d) => {
          d.volunteer.push({
            id: uid("vol"),
            organization: "",
            position: "",
            url: "",
            startDate: "",
            endDate: "",
            summary: "",
            highlights: [],
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
              d.volunteer = next
            })
          }
          getItemValue={(i) => i.id}
          className="space-y-3"
        >
          {items.map((v) => (
            <ItemCard
              key={v.id}
              id={v.id}
              onDelete={() =>
                updateActive((d) => {
                  d.volunteer = d.volunteer.filter((x) => x.id !== v.id)
                })
              }
            >
              <div className="grid grid-cols-1 @md:grid-cols-2 gap-2">
                <Field
                  label={t(lang, "organization")}
                  value={v.organization}
                  onChange={(val) =>
                    updateActive((d) => {
                      const it = d.volunteer.find((x) => x.id === v.id)
                      if (it) it.organization = val
                    })
                  }
                />
                <Field
                  label={t(lang, "position")}
                  value={v.position}
                  onChange={(val) =>
                    updateActive((d) => {
                      const it = d.volunteer.find((x) => x.id === v.id)
                      if (it) it.position = val
                    })
                  }
                />
                <Field
                  label={t(lang, "startDate")}
                  value={v.startDate}
                  onChange={(val) =>
                    updateActive((d) => {
                      const it = d.volunteer.find((x) => x.id === v.id)
                      if (it) it.startDate = val
                    })
                  }
                />
                <Field
                  label={t(lang, "endDate")}
                  value={v.endDate}
                  onChange={(val) =>
                    updateActive((d) => {
                      const it = d.volunteer.find((x) => x.id === v.id)
                      if (it) it.endDate = val
                    })
                  }
                />
                <Field
                  className="col-span-2"
                  label={t(lang, "url")}
                  value={v.url}
                  onChange={(val) =>
                    updateActive((d) => {
                      const it = d.volunteer.find((x) => x.id === v.id)
                      if (it) it.url = val
                    })
                  }
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">{t(lang, "description")}</Label>
                <RichText
                  value={v.summary}
                  onChange={(val) =>
                    updateActive((d) => {
                      const it = d.volunteer.find((x) => x.id === v.id)
                      if (it) it.summary = val
                    })
                  }
                />
              </div>
              <Field
                label={t(lang, "highlights")}
                value={(v.highlights || []).join("\n")}
                onChange={(val) =>
                  updateActive((d) => {
                    const it = d.volunteer.find((x) => x.id === v.id)
                    if (it) it.highlights = val.split("\n").filter(Boolean)
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

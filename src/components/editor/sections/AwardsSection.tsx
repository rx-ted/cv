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

export function AwardsSection({
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
  const visible = resume.meta.cvfree.sectionVisibility["awards"] !== false
  const items = resume.awards
  return (
    <SectionCard
      id="section-awards"
      title={t(lang, "awards")}
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
          d.meta.cvfree.sectionVisibility["awards"] = !visible
        })
      }
      onAdd={() =>
        updateActive((d) => {
          d.awards.push({
            id: uid("award"),
            title: "",
            date: "",
            awarder: "",
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
              d.awards = next
            })
          }
          getItemValue={(i) => i.id}
          className="space-y-3"
        >
          {items.map((a) => (
            <ItemCard
              key={a.id}
              id={a.id}
              onDelete={() =>
                updateActive((d) => {
                  d.awards = d.awards.filter((x) => x.id !== a.id)
                })
              }
            >
              <div className="grid grid-cols-1 @md:grid-cols-2 gap-2">
                <Field
                  className="col-span-2"
                  label={t(lang, "itemTitle")}
                  value={a.title}
                  onChange={(v) =>
                    updateActive((d) => {
                      const it = d.awards.find((x) => x.id === a.id)
                      if (it) it.title = v
                    })
                  }
                />
                <Field
                  label={t(lang, "awarder")}
                  value={a.awarder}
                  onChange={(v) =>
                    updateActive((d) => {
                      const it = d.awards.find((x) => x.id === a.id)
                      if (it) it.awarder = v
                    })
                  }
                />
                <Field
                  label={t(lang, "date")}
                  value={a.date}
                  onChange={(v) =>
                    updateActive((d) => {
                      const it = d.awards.find((x) => x.id === a.id)
                      if (it) it.date = v
                    })
                  }
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">{t(lang, "description")}</Label>
                <RichText
                  value={a.summary}
                  onChange={(v) =>
                    updateActive((d) => {
                      const it = d.awards.find((x) => x.id === a.id)
                      if (it) it.summary = v
                    })
                  }
                />
              </div>
            </ItemCard>
          ))}
        </Sortable>
      )}
    </SectionCard>
  )
}

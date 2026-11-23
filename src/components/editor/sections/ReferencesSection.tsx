"use client"

import { Field } from "@/components/editor/ui/Field"
import { ItemCard } from "@/components/editor/ui/ItemCard"
import { SectionCard } from "@/components/editor/ui/SectionCard"
import { Sortable } from "@/components/reui/sortable"
import { t } from "@/i18n/strings"
import { uid } from "@/lib/resume/schema"
import { useAppStore } from "@/stores/app"
import type { SectionEditorProps } from "../section-meta"

export function ReferencesSection({
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
  const visible = resume.meta.cvfree.sectionVisibility.references !== false
  const items = resume.references
  return (
    <SectionCard
      id="section-references"
      title={t(lang, "references")}
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
          d.meta.cvfree.sectionVisibility.references = !visible
        })
      }
      onAdd={() =>
        updateActive((d) => {
          d.references.push({
            id: uid("ref"),
            name: "",
            reference: "",
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
              d.references = next
            })
          }
          getItemValue={(i) => i.id}
          className="space-y-3"
        >
          {items.map((r) => (
            <ItemCard
              key={r.id}
              id={r.id}
              onDelete={() =>
                updateActive((d) => {
                  d.references = d.references.filter((x) => x.id !== r.id)
                })
              }
            >
              <Field
                label={t(lang, "name")}
                value={r.name}
                onChange={(v) =>
                  updateActive((d) => {
                    const it = d.references.find((x) => x.id === r.id)
                    if (it) it.name = v
                  })
                }
              />
              <Field
                label={t(lang, "referenceText")}
                value={r.reference}
                onChange={(v) =>
                  updateActive((d) => {
                    const it = d.references.find((x) => x.id === r.id)
                    if (it) it.reference = v
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

"use client"

import { Field } from "@/components/editor/ui/Field"
import { ItemCard } from "@/components/editor/ui/ItemCard"
import { SectionCard } from "@/components/editor/ui/SectionCard"
import { Sortable } from "@/components/reui/sortable"
import { t } from "@/i18n/strings"
import { uid } from "@/lib/resume/schema"
import { useAppStore } from "@/stores/app"
import type { SectionEditorProps } from "../section-meta"

export function InterestsSection({
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
  const visible = resume.meta.cvfree.sectionVisibility.interests !== false
  const items = resume.interests
  return (
    <SectionCard
      id="section-interests"
      title={t(lang, "interests")}
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
          d.meta.cvfree.sectionVisibility.interests = !visible
        })
      }
      onAdd={() =>
        updateActive((d) => {
          d.interests.push({
            id: uid("int"),
            name: "",
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
              d.interests = next
            })
          }
          getItemValue={(i) => i.id}
          className="space-y-3"
        >
          {items.map((it) => (
            <ItemCard
              key={it.id}
              id={it.id}
              onDelete={() =>
                updateActive((d) => {
                  d.interests = d.interests.filter((x) => x.id !== it.id)
                })
              }
            >
              <Field
                label={t(lang, "name")}
                value={it.name}
                onChange={(v) =>
                  updateActive((d) => {
                    const item = d.interests.find((x) => x.id === it.id)
                    if (item) item.name = v
                  })
                }
              />
              <Field
                label={t(lang, "keywords")}
                value={(it.keywords || []).join(", ")}
                onChange={(v) =>
                  updateActive((d) => {
                    const item = d.interests.find((x) => x.id === it.id)
                    if (item)
                      item.keywords = v
                        .split(",")
                        .map((s) => s.trim())
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

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

export function PublicationsSection({
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
  const visible = resume.meta.cvfree.sectionVisibility["publications"] !== false
  const items = resume.publications
  return (
    <SectionCard
      id="section-publications"
      title={t(lang, "publications")}
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
          d.meta.cvfree.sectionVisibility["publications"] = !visible
        })
      }
      onAdd={() =>
        updateActive((d) => {
          d.publications.push({
            id: uid("pub"),
            name: "",
            publisher: "",
            releaseDate: "",
            url: "",
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
              d.publications = next
            })
          }
          getItemValue={(i) => i.id}
          className="space-y-3"
        >
          {items.map((p) => (
            <ItemCard
              key={p.id}
              id={p.id}
              onDelete={() =>
                updateActive((d) => {
                  d.publications = d.publications.filter((x) => x.id !== p.id)
                })
              }
            >
              <div className="grid grid-cols-1 @md:grid-cols-2 gap-2">
                <Field
                  className="col-span-2"
                  label={t(lang, "itemTitle")}
                  value={p.name}
                  onChange={(v) =>
                    updateActive((d) => {
                      const it = d.publications.find((x) => x.id === p.id)
                      if (it) it.name = v
                    })
                  }
                />
                <Field
                  label={t(lang, "publisher")}
                  value={p.publisher}
                  onChange={(v) =>
                    updateActive((d) => {
                      const it = d.publications.find((x) => x.id === p.id)
                      if (it) it.publisher = v
                    })
                  }
                />
                <Field
                  label={t(lang, "releaseDate")}
                  value={p.releaseDate}
                  onChange={(v) =>
                    updateActive((d) => {
                      const it = d.publications.find((x) => x.id === p.id)
                      if (it) it.releaseDate = v
                    })
                  }
                />
                <Field
                  className="col-span-2"
                  label={t(lang, "url")}
                  value={p.url}
                  onChange={(v) =>
                    updateActive((d) => {
                      const it = d.publications.find((x) => x.id === p.id)
                      if (it) it.url = v
                    })
                  }
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">{t(lang, "description")}</Label>
                <RichText
                  value={p.summary}
                  onChange={(v) =>
                    updateActive((d) => {
                      const it = d.publications.find((x) => x.id === p.id)
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

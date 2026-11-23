"use client"

import { Field } from "@/components/editor/ui/Field"
import { ItemCard } from "@/components/editor/ui/ItemCard"
import { SectionCard } from "@/components/editor/ui/SectionCard"
import { Sortable } from "@/components/reui/sortable"
import { t } from "@/i18n/strings"
import { uid } from "@/lib/resume/schema"
import { useAppStore } from "@/stores/app"
import type { SectionEditorProps } from "../section-meta"

export function CertificatesSection({
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
  const visible = resume.meta.cvfree.sectionVisibility.certificates !== false
  const items = resume.certificates
  return (
    <SectionCard
      id="section-certificates"
      title={t(lang, "certificates")}
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
          d.meta.cvfree.sectionVisibility.certificates = !visible
        })
      }
      onAdd={() =>
        updateActive((d) => {
          d.certificates.push({
            id: uid("cert"),
            name: "",
            date: "",
            issuer: "",
            url: "",
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
              d.certificates = next
            })
          }
          getItemValue={(i) => i.id}
          className="space-y-3"
        >
          {items.map((c) => (
            <ItemCard
              key={c.id}
              id={c.id}
              onDelete={() =>
                updateActive((d) => {
                  d.certificates = d.certificates.filter((x) => x.id !== c.id)
                })
              }
            >
              <div className="grid grid-cols-1 @md:grid-cols-2 gap-2">
                <Field
                  label={t(lang, "name")}
                  value={c.name}
                  onChange={(v) =>
                    updateActive((d) => {
                      const it = d.certificates.find((x) => x.id === c.id)
                      if (it) it.name = v
                    })
                  }
                />
                <Field
                  label={t(lang, "issuer")}
                  value={c.issuer}
                  onChange={(v) =>
                    updateActive((d) => {
                      const it = d.certificates.find((x) => x.id === c.id)
                      if (it) it.issuer = v
                    })
                  }
                />
                <Field
                  label={t(lang, "date")}
                  value={c.date}
                  onChange={(v) =>
                    updateActive((d) => {
                      const it = d.certificates.find((x) => x.id === c.id)
                      if (it) it.date = v
                    })
                  }
                />
                <Field
                  label={t(lang, "url")}
                  value={c.url}
                  onChange={(v) =>
                    updateActive((d) => {
                      const it = d.certificates.find((x) => x.id === c.id)
                      if (it) it.url = v
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

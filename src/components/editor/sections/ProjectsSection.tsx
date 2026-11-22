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

export function ProjectsSection({
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
  const visible = resume.meta.cvfree.sectionVisibility["projects"] !== false
  const items = resume.projects
  return (
    <SectionCard
      id="section-projects"
      title={t(lang, "projects")}
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
          d.meta.cvfree.sectionVisibility["projects"] = !visible
        })
      }
      onAdd={() =>
        updateActive((d) => {
          d.projects.push({
            id: uid("proj"),
            name: "",
            description: "",
            highlights: [],
            keywords: [],
            startDate: "",
            endDate: "",
            url: "",
            roles: [],
            entity: "",
            type: "",
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
              d.projects = next
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
                  d.projects = d.projects.filter((x) => x.id !== p.id)
                })
              }
            >
              <div className="grid grid-cols-1 @md:grid-cols-2 gap-2">
                <Field
                  label={t(lang, "projectName")}
                  value={p.name}
                  onChange={(v) =>
                    updateActive((d) => {
                      const it = d.projects.find((x) => x.id === p.id)
                      if (it) it.name = v
                    })
                  }
                />
                <Field
                  label={t(lang, "url")}
                  value={p.url}
                  onChange={(v) =>
                    updateActive((d) => {
                      const it = d.projects.find((x) => x.id === p.id)
                      if (it) it.url = v
                    })
                  }
                />
                <Field
                  label={t(lang, "entity")}
                  value={p.entity}
                  onChange={(v) =>
                    updateActive((d) => {
                      const it = d.projects.find((x) => x.id === p.id)
                      if (it) it.entity = v
                    })
                  }
                />
                <Field
                  label={t(lang, "projectType")}
                  value={p.type}
                  onChange={(v) =>
                    updateActive((d) => {
                      const it = d.projects.find((x) => x.id === p.id)
                      if (it) it.type = v
                    })
                  }
                />
                <Field
                  label={t(lang, "startDate")}
                  value={p.startDate}
                  onChange={(v) =>
                    updateActive((d) => {
                      const it = d.projects.find((x) => x.id === p.id)
                      if (it) it.startDate = v
                    })
                  }
                />
                <Field
                  label={t(lang, "endDate")}
                  value={p.endDate}
                  onChange={(v) =>
                    updateActive((d) => {
                      const it = d.projects.find((x) => x.id === p.id)
                      if (it) it.endDate = v
                    })
                  }
                />
              </div>
              <Field
                label={t(lang, "roles")}
                value={(p.roles || []).join(", ")}
                onChange={(v) =>
                  updateActive((d) => {
                    const it = d.projects.find((x) => x.id === p.id)
                    if (it)
                      it.roles = v
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean)
                  })
                }
              />
              <Field
                label={t(lang, "keywords")}
                value={(p.keywords || []).join(", ")}
                onChange={(v) =>
                  updateActive((d) => {
                    const it = d.projects.find((x) => x.id === p.id)
                    if (it)
                      it.keywords = v
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean)
                  })
                }
              />
              <div className="space-y-1">
                <Label className="text-xs">{t(lang, "description")}</Label>
                <RichText
                  value={p.description}
                  onChange={(v) =>
                    updateActive((d) => {
                      const it = d.projects.find((x) => x.id === p.id)
                      if (it) it.description = v
                    })
                  }
                />
              </div>
              <Field
                label={t(lang, "highlights")}
                value={(p.highlights || []).join("\n")}
                onChange={(v) =>
                  updateActive((d) => {
                    const it = d.projects.find((x) => x.id === p.id)
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

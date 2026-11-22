"use client"

import { Copy, Eye, EyeOff, GripVertical, Plus, Trash2 } from "lucide-react"
import { RichText } from "@/components/editor/RichText"
import { Field } from "@/components/editor/ui/Field"
import { SectionCard } from "@/components/editor/ui/SectionCard"
import {
  Sortable,
  SortableItem,
  SortableItemHandle,
} from "@/components/reui/sortable"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { t } from "@/i18n/strings"
import { uid } from "@/lib/resume/schema"
import { useAppStore } from "@/stores/app"
import type { SectionEditorProps } from "../section-meta"

export function CustomSectionsEditor({
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
  const groupVisible = cv.sectionVisibility["custom"] !== false
  const sections = cv.customSections || []

  const addSection = () =>
    updateActive((d) => {
      d.meta.cvfree.customSections.push({
        id: uid("csec"),
        title: lang === "zh-CN" ? "自定义模块" : "Custom Section",
        visible: true,
        items: [],
      })
    })

  return (
    <SectionCard
      id="section-custom"
      title={t(lang, "custom")}
      visible={groupVisible}
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
      count={sections.length}
      onToggle={() =>
        updateActive((d) => {
          d.meta.cvfree.sectionVisibility["custom"] = !groupVisible
        })
      }
      onAdd={addSection}
      addLabel={t(lang, "addSection")}
    >
      {sections.length === 0 ? (
        <div className="text-xs text-muted-foreground">
          {t(lang, "noContent")}
        </div>
      ) : (
        <Sortable
          value={sections}
          onValueChange={(next) =>
            updateActive((d) => {
              d.meta.cvfree.customSections = next
            })
          }
          getItemValue={(i) => i.id}
          className="space-y-4"
        >
          {sections.map((sec) => (
            <SortableItem
              key={sec.id}
              value={sec.id}
              className="border rounded-md bg-muted/20"
            >
              <div className="flex items-center gap-2 px-3 py-2 border-b bg-card rounded-t-md">
                <SortableItemHandle className="text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing">
                  <GripVertical className="w-4 h-4" />
                </SortableItemHandle>
                <div className="flex-1 min-w-0">
                  <Field
                    label={t(lang, "sectionTitle")}
                    value={sec.title}
                    onChange={(v) =>
                      updateActive((d) => {
                        const s = d.meta.cvfree.customSections.find(
                          (x) => x.id === sec.id,
                        )
                        if (s) s.title = v
                      })
                    }
                  />
                </div>
                <div className="flex items-center gap-1 self-end pb-0.5">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    title={
                      sec.visible !== false ? t(lang, "hide") : t(lang, "show")
                    }
                    onClick={() =>
                      updateActive((d) => {
                        const s = d.meta.cvfree.customSections.find(
                          (x) => x.id === sec.id,
                        )
                        if (s) s.visible = s.visible === false
                      })
                    }
                  >
                    {sec.visible !== false ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    title={t(lang, "duplicate")}
                    onClick={() =>
                      updateActive((d) => {
                        const idx = d.meta.cvfree.customSections.findIndex(
                          (x) => x.id === sec.id,
                        )
                        if (idx < 0) return
                        const src = d.meta.cvfree.customSections[idx]
                        const copy = {
                          ...src,
                          id: uid("csec"),
                          title: `${src.title} (${t(lang, "copy")})`,
                          items: (src.items || []).map((it) => ({
                            ...it,
                            id: uid("citem"),
                          })),
                        }
                        d.meta.cvfree.customSections.splice(idx + 1, 0, copy)
                      })
                    }
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-red-600"
                    title={t(lang, "delete")}
                    onClick={() =>
                      updateActive((d) => {
                        d.meta.cvfree.customSections =
                          d.meta.cvfree.customSections.filter(
                            (x) => x.id !== sec.id,
                          )
                      })
                    }
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div
                className={`p-3 space-y-3 ${sec.visible === false ? "opacity-60" : ""}`}
              >
                <Sortable
                  value={sec.items || []}
                  onValueChange={(items) =>
                    updateActive((d) => {
                      const s = d.meta.cvfree.customSections.find(
                        (x) => x.id === sec.id,
                      )
                      if (s) s.items = items
                    })
                  }
                  getItemValue={(i) => i.id}
                  className="space-y-2"
                >
                  {(sec.items || []).map((it) => (
                    <SortableItem
                      key={it.id}
                      value={it.id}
                      className="border rounded p-2 space-y-2 bg-card"
                    >
                      <div className="flex gap-2 items-start">
                        <SortableItemHandle className="mt-1.5 text-muted-foreground cursor-grab active:cursor-grabbing">
                          <GripVertical className="w-3.5 h-3.5" />
                        </SortableItemHandle>
                        <div className="flex-1 space-y-2 relative pr-6 min-w-0">
                          <button
                            type="button"
                            onClick={() =>
                              updateActive((d) => {
                                const s = d.meta.cvfree.customSections.find(
                                  (x) => x.id === sec.id,
                                )
                                if (s)
                                  s.items = s.items.filter(
                                    (x) => x.id !== it.id,
                                  )
                              })
                            }
                            className="absolute top-0 right-0 text-muted-foreground hover:text-red-600"
                            title={t(lang, "delete")}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <div className="grid grid-cols-1 @md:grid-cols-2 gap-2">
                            <Field
                              label={t(lang, "itemTitle")}
                              value={it.title}
                              onChange={(v) =>
                                updateActive((d) => {
                                  const s = d.meta.cvfree.customSections.find(
                                    (x) => x.id === sec.id,
                                  )
                                  const ci = s?.items.find(
                                    (x) => x.id === it.id,
                                  )
                                  if (ci) ci.title = v
                                })
                              }
                            />
                            <Field
                              label={t(lang, "subtitle")}
                              value={it.subtitle}
                              onChange={(v) =>
                                updateActive((d) => {
                                  const s = d.meta.cvfree.customSections.find(
                                    (x) => x.id === sec.id,
                                  )
                                  const ci = s?.items.find(
                                    (x) => x.id === it.id,
                                  )
                                  if (ci) ci.subtitle = v
                                })
                              }
                            />
                            <Field
                              label={t(lang, "date")}
                              value={it.date}
                              onChange={(v) =>
                                updateActive((d) => {
                                  const s = d.meta.cvfree.customSections.find(
                                    (x) => x.id === sec.id,
                                  )
                                  const ci = s?.items.find(
                                    (x) => x.id === it.id,
                                  )
                                  if (ci) ci.date = v
                                })
                              }
                            />
                            <Field
                              label={t(lang, "url")}
                              value={it.url}
                              onChange={(v) =>
                                updateActive((d) => {
                                  const s = d.meta.cvfree.customSections.find(
                                    (x) => x.id === sec.id,
                                  )
                                  const ci = s?.items.find(
                                    (x) => x.id === it.id,
                                  )
                                  if (ci) ci.url = v
                                })
                              }
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">
                              {t(lang, "description")}
                            </Label>
                            <RichText
                              value={it.description}
                              onChange={(v) =>
                                updateActive((d) => {
                                  const s = d.meta.cvfree.customSections.find(
                                    (x) => x.id === sec.id,
                                  )
                                  const ci = s?.items.find(
                                    (x) => x.id === it.id,
                                  )
                                  if (ci) ci.description = v
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </SortableItem>
                  ))}
                </Sortable>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    updateActive((d) => {
                      const s = d.meta.cvfree.customSections.find(
                        (x) => x.id === sec.id,
                      )
                      if (s)
                        s.items.push({
                          id: uid("citem"),
                          title: "",
                          subtitle: "",
                          date: "",
                          description: "",
                          url: "",
                        })
                    })
                  }
                >
                  <Plus className="w-3 h-3 mr-1" />
                  {t(lang, "addItem")}
                </Button>
              </div>
            </SortableItem>
          ))}
        </Sortable>
      )}
    </SectionCard>
  )
}

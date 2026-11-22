"use client"

import { Plus, Trash2 } from "lucide-react"
import { RichText } from "@/components/editor/RichText"
import { Field } from "@/components/editor/ui/Field"
import { SectionCard } from "@/components/editor/ui/SectionCard"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ResumeInput } from "@/components/ui/resume-input"
import { t } from "@/i18n/strings"
import { useAppStore } from "@/stores/app"
import type { SectionEditorProps } from "../section-meta"

export function BasicsSection({
  resume,
  lang,
  open,
  onToggleOpen,
}: SectionEditorProps) {
  const updateActive = useAppStore((s) => s.updateActive)
  const b = resume.basics
  return (
    <SectionCard
      id="section-basics"
      title={t(lang, "basics")}
      visible={true}
      canToggle={false}
      open={open}
      onOpenChange={() => onToggleOpen()}
      moveUpLabel={t(lang, "moveUp")}
      moveDownLabel={t(lang, "moveDown")}
      deleteModuleLabel={t(lang, "deleteModule")}
      showLabel={t(lang, "show")}
      hideLabelAction={t(lang, "hide")}
    >
      <div className="grid grid-cols-1 @md:grid-cols-2 gap-2">
        <Field
          label={t(lang, "name")}
          value={b.name}
          onChange={(v) =>
            updateActive((d) => {
              d.basics.name = v
            })
          }
        />
        <Field
          label={t(lang, "label")}
          value={b.label}
          onChange={(v) =>
            updateActive((d) => {
              d.basics.label = v
            })
          }
        />
        <Field
          label={t(lang, "email")}
          value={b.email}
          onChange={(v) =>
            updateActive((d) => {
              d.basics.email = v
            })
          }
        />
        <Field
          label={t(lang, "phone")}
          value={b.phone}
          onChange={(v) =>
            updateActive((d) => {
              d.basics.phone = v
            })
          }
        />
        <Field
          label={t(lang, "website")}
          value={b.url}
          onChange={(v) =>
            updateActive((d) => {
              d.basics.url = v
            })
          }
        />
        <Field
          label={t(lang, "image")}
          value={b.image}
          onChange={(v) =>
            updateActive((d) => {
              d.basics.image = v
            })
          }
        />
        <Field
          label={t(lang, "city")}
          value={b.location.city}
          onChange={(v) =>
            updateActive((d) => {
              d.basics.location.city = v
            })
          }
        />
        <Field
          label={t(lang, "region")}
          value={b.location.region}
          onChange={(v) =>
            updateActive((d) => {
              d.basics.location.region = v
            })
          }
        />
        <Field
          label={t(lang, "country")}
          value={b.location.countryCode}
          onChange={(v) =>
            updateActive((d) => {
              d.basics.location.countryCode = v
            })
          }
        />
        <Field
          label={t(lang, "address")}
          value={b.location.address}
          onChange={(v) =>
            updateActive((d) => {
              d.basics.location.address = v
            })
          }
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs">{t(lang, "profiles")}</Label>
        <div className="space-y-2">
          {b.profiles.map((p, i) => (
            <div
              key={i}
              className="grid grid-cols-1 @md:grid-cols-[1fr_1fr_1.4fr_auto] gap-2 @md:items-center"
            >
              <ResumeInput
                inputSize="sm"
                containerClassName="space-y-0"
                placeholder={t(lang, "network")}
                value={p.network}
                onChange={(e) =>
                  updateActive((d) => {
                    d.basics.profiles[i].network = e.target.value
                  })
                }
              />
              <ResumeInput
                inputSize="sm"
                containerClassName="space-y-0"
                placeholder={t(lang, "username")}
                value={p.username}
                onChange={(e) =>
                  updateActive((d) => {
                    d.basics.profiles[i].username = e.target.value
                  })
                }
              />
              <ResumeInput
                inputSize="sm"
                containerClassName="space-y-0"
                placeholder={t(lang, "url")}
                value={p.url}
                onChange={(e) =>
                  updateActive((d) => {
                    d.basics.profiles[i].url = e.target.value
                  })
                }
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-red-600"
                onClick={() =>
                  updateActive((d) => {
                    d.basics.profiles.splice(i, 1)
                  })
                }
                title={t(lang, "delete")}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            updateActive((d) => {
              d.basics.profiles.push({ network: "", username: "", url: "" })
            })
          }
        >
          <Plus className="w-3 h-3 mr-1" />
          {t(lang, "add")}
        </Button>
      </div>

      <div className="space-y-1">
        <Label className="text-xs">{t(lang, "summary")}</Label>
        <RichText
          value={b.summary}
          onChange={(v) =>
            updateActive((d) => {
              d.basics.summary = v
            })
          }
        />
      </div>
    </SectionCard>
  )
}

"use client"

import { current } from "immer"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"
import {
  cloneAsUserResume,
  createBlankResume,
  deepCloneResume,
  getDefaultResume,
} from "@/lib/resume/document"
import type {
  AppLanguage,
  LayoutConfig,
  ResumeDocument,
  TemplateId,
  TextConfig,
  ThemeConfig,
} from "@/lib/resume/schema"
import { nowIso, uid } from "@/lib/resume/schema"

export type SaveState = "idle" | "saving" | "saved"
type HistoryEntry = { past: ResumeDocument[]; future: ResumeDocument[] }

export type Preferences = {
  theme: ThemeConfig
  text: TextConfig
  layout: LayoutConfig
}

const defaultPrefs = (): Preferences => ({
  theme: {
    template: "classic",
    color: "#2563eb",
    background: "#ffffff",
    textColor: "#1f2937",
    accentColor: "#0d9488",
    secondaryText: "#6b7280",
    border: "#e5e7eb",
    mutedBackground: "#f3f4f6",
    link: "#1d4ed8",
  },
  text: {
    fontHeading: "inter",
    fontBody: "inter",
    fontSize: 14,
    lineHeight: 1.5,
    fontWeight: 400,
    headingSize: 24,
    paragraphSpacing: 8,
  },
  layout: {
    columns: "single",
    pageWidth: 794,
    format: "A4",
    margin: 16,
    sectionSpacing: 16,
    columnRatio: 35,
    dateFormat: "MMM YYYY",
    showPageHeader: false,
    showPageFooter: false,
    pageHeaderText: "",
    pageFooterText: "",
    pagination: "gap",
  },
})

type AppState = {
  language: AppLanguage
  resumes: Record<string, ResumeDocument>
  activeId: string | null
  saveState: SaveState
  history: Record<string, HistoryEntry>
  preferences: Preferences
  setLanguage: (lang: AppLanguage) => void
  setPreferences: (recipe: (p: Preferences) => void) => void
  applyPreferencesTo: (doc: ResumeDocument) => ResumeDocument
  setActive: (id: string | null) => void
  getActive: () => ResumeDocument | null

  createBlank: (template?: string) => string
  createFromDefault: () => string
  createFromTemplate: (template: string) => string
  importResume: (doc: ResumeDocument) => string
  deleteResume: (id: string) => void
  renameResume: (id: string, title: string) => void

  updateActive: (
    recipe: (draft: ResumeDocument) => void,
    pushHistory?: boolean,
  ) => void
  undo: () => void
  redo: () => void
  resetActive: () => void
}

const HISTORY_LIMIT = 60
function pushHistoryEntry(
  hist: HistoryEntry | undefined,
  snapshot: ResumeDocument,
): HistoryEntry {
  const h = hist || { past: [], future: [] }
  return {
    past: [...h.past.slice(-HISTORY_LIMIT + 1), deepCloneResume(snapshot)],
    future: [],
  }
}

export const useAppStore = create<AppState>()(
  persist(
    immer((set, get) => ({
      language: "zh-CN",
      resumes: {},
      activeId: null,
      saveState: "idle",
      history: {},
      preferences: defaultPrefs(),
      setLanguage: (lang) =>
        set((s) => {
          s.language = lang
        }),
      setPreferences: (recipe) =>
        set((s) => {
          recipe(s.preferences)
        }),
      applyPreferencesTo: (doc) => {
        const p = get().preferences
        const copy = deepCloneResume(doc)
        copy.meta.cvfree.theme = deepCloneResume(p.theme)
        copy.meta.cvfree.text = deepCloneResume(p.text)
        copy.meta.cvfree.layout = deepCloneResume(p.layout)
        return copy
      },
      setActive: (id) =>
        set((s) => {
          s.activeId = id
        }),
      getActive: () => {
        const s = get()
        return s.activeId ? s.resumes[s.activeId] || null : null
      },

      createBlank: (template: string = "classic") => {
        const lang = get().language
        const doc = createBlankResume(lang, template)
        const p = get().preferences
        doc.meta.cvfree.theme = { ...p.theme, template }
        doc.meta.cvfree.text = deepCloneResume(p.text)
        doc.meta.cvfree.layout = deepCloneResume(p.layout)
        const id = doc.meta.cvfree.id
        set((s) => {
          s.resumes[id] = doc
          s.activeId = id
          s.saveState = "saved"
        })
        return id
      },

      createFromDefault: () => {
        const lang = get().language
        const def = getDefaultResume(lang)
        const doc = cloneAsUserResume(
          def,
          lang,
          lang === "zh-CN" ? "我的简历" : "My Resume",
        )
        const p = get().preferences
        doc.meta.cvfree.theme = deepCloneResume(p.theme)
        doc.meta.cvfree.text = deepCloneResume(p.text)
        doc.meta.cvfree.layout = deepCloneResume(p.layout)
        const id = doc.meta.cvfree.id
        set((s) => {
          s.resumes[id] = doc
          s.activeId = id
          s.saveState = "saved"
        })
        return id
      },

      createFromTemplate: (template: string) => {
        const lang = get().language
        const def = getDefaultResume(lang)
        const doc = cloneAsUserResume(
          def,
          lang,
          lang === "zh-CN" ? "我的简历" : "My Resume",
        )
        const p = get().preferences
        doc.meta.cvfree.theme = { ...deepCloneResume(p.theme), template }
        doc.meta.cvfree.text = deepCloneResume(p.text)
        doc.meta.cvfree.layout = deepCloneResume(p.layout)
        const id = doc.meta.cvfree.id
        set((s) => {
          s.resumes[id] = doc
          s.activeId = id
          s.saveState = "saved"
        })
        return id
      },

      importResume: (doc) => {
        const id = doc.meta.cvfree.id || uid("resume")
        doc.meta.cvfree.id = id
        set((s) => {
          s.resumes[id] = doc
          s.activeId = id
          s.saveState = "saved"
        })
        return id
      },

      deleteResume: (id) =>
        set((s) => {
          delete s.resumes[id]
          delete s.history[id]
          if (s.activeId === id) {
            const ids = Object.keys(s.resumes)
            s.activeId = ids[0] || null
          }
        }),

      renameResume: (id, title) =>
        set((s) => {
          if (s.resumes[id]) {
            s.resumes[id].meta.cvfree.title = title
            s.resumes[id].meta.cvfree.updatedAt = nowIso()
          }
        }),

      updateActive: (recipe, push = true) =>
        set((s) => {
          const id = s.activeId
          if (!id || !s.resumes[id]) return
          if (push)
            s.history[id] = pushHistoryEntry(
              s.history[id],
              current(s.resumes[id]) as any,
            )
          recipe(s.resumes[id])
          s.resumes[id].meta.cvfree.updatedAt = nowIso()
          s.resumes[id].meta.lastModified = s.resumes[id].meta.cvfree.updatedAt
          s.saveState = "saved"
        }),

      undo: () =>
        set((s) => {
          const id = s.activeId
          if (!id || !s.resumes[id]) return
          const h = s.history[id]
          if (!h || h.past.length === 0) return
          const prev = h.past[h.past.length - 1]
          h.past = h.past.slice(0, -1)
          h.future = [
            deepCloneResume(current(s.resumes[id]) as any),
            ...h.future,
          ]
          s.resumes[id] = prev
          s.saveState = "saved"
        }),

      redo: () =>
        set((s) => {
          const id = s.activeId
          if (!id || !s.resumes[id]) return
          const h = s.history[id]
          if (!h || h.future.length === 0) return
          const next = h.future[0]
          h.future = h.future.slice(1)
          h.past = [...h.past, deepCloneResume(current(s.resumes[id]) as any)]
          s.resumes[id] = next
          s.saveState = "saved"
        }),

      resetActive: () =>
        set((s) => {
          const id = s.activeId
          if (!id || !s.resumes[id]) return
          const cur = current(s.resumes[id]) as any
          const init = cur.meta?.cvfree?.initial
          if (!init) return
          const restored = deepCloneResume(init) as any
          restored.meta = restored.meta || {}
          restored.meta.cvfree = restored.meta.cvfree || {}
          restored.meta.cvfree.id = id
          restored.meta.cvfree.initial = deepCloneResume(init)
          restored.meta.cvfree.updatedAt = nowIso()
          restored.meta.lastModified = restored.meta.cvfree.updatedAt
          s.history[id] = { past: [], future: [] }
          s.resumes[id] = restored
          s.saveState = "saved"
        }),
    })),
    {
      name: "cvfree-app",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        language: s.language,
        resumes: s.resumes,
        activeId: s.activeId,
        preferences: s.preferences,
      }),
      version: 1,
      merge: (persisted: any, currentState) => {
        const p = (persisted || {}) as any
        const merged = { ...currentState, ...p } as any
        const themeDefaults = {
          template: "classic",
          color: "#2563eb",
          background: "#ffffff",
          textColor: "#1f2937",
          accentColor: "#0d9488",
          secondaryText: "#6b7280",
          border: "#e5e7eb",
          mutedBackground: "#f3f4f6",
          link: "#1d4ed8",
        }
        if (merged.preferences && typeof merged.preferences === "object") {
          merged.preferences = {
            ...currentState.preferences,
            ...merged.preferences,
            theme: {
              ...themeDefaults,
              ...(currentState.preferences?.theme || {}),
              ...(merged.preferences.theme || {}),
            },
          }
        }
        if (merged.resumes && typeof merged.resumes === "object") {
          const fixed: any = {}
          for (const [id, r] of Object.entries(merged.resumes as any)) {
            const doc: any = r || {}
            const meta = doc.meta || {}
            const cv = meta.cvfree || {}
            fixed[id] = {
              ...doc,
              basics: {
                ...(doc.basics || {}),
                location: (doc.basics || {}).location || {
                  address: "",
                  postalCode: "",
                  city: "",
                  countryCode: "",
                  region: "",
                },
                profiles: Array.isArray((doc.basics || {}).profiles)
                  ? doc.basics.profiles
                  : [],
              },
              work: Array.isArray(doc.work)
                ? doc.work.map((x: any) => ({
                    ...x,
                    visible: x?.visible !== false,
                  }))
                : [],
              volunteer: Array.isArray(doc.volunteer)
                ? doc.volunteer.map((x: any) => ({
                    ...x,
                    visible: x?.visible !== false,
                  }))
                : [],
              education: Array.isArray(doc.education)
                ? doc.education.map((x: any) => ({
                    ...x,
                    visible: x?.visible !== false,
                  }))
                : [],
              awards: Array.isArray(doc.awards)
                ? doc.awards.map((x: any) => ({
                    ...x,
                    visible: x?.visible !== false,
                  }))
                : [],
              certificates: Array.isArray(doc.certificates)
                ? doc.certificates.map((x: any) => ({
                    ...x,
                    visible: x?.visible !== false,
                  }))
                : [],
              publications: Array.isArray(doc.publications)
                ? doc.publications.map((x: any) => ({
                    ...x,
                    visible: x?.visible !== false,
                  }))
                : [],
              skills: Array.isArray(doc.skills)
                ? doc.skills.map((x: any) => ({
                    ...x,
                    visible: x?.visible !== false,
                  }))
                : [],
              languages: Array.isArray(doc.languages)
                ? doc.languages.map((x: any) => ({
                    ...x,
                    visible: x?.visible !== false,
                  }))
                : [],
              interests: Array.isArray(doc.interests)
                ? doc.interests.map((x: any) => ({
                    ...x,
                    visible: x?.visible !== false,
                  }))
                : [],
              references: Array.isArray(doc.references)
                ? doc.references.map((x: any) => ({
                    ...x,
                    visible: x?.visible !== false,
                  }))
                : [],
              projects: Array.isArray(doc.projects)
                ? doc.projects.map((x: any) => ({
                    ...x,
                    visible: x?.visible !== false,
                  }))
                : [],
              meta: {
                ...meta,
                cvfree: {
                  ...cv,
                  theme: { ...themeDefaults, ...(cv.theme || {}) },
                  sectionVisibility: cv.sectionVisibility || {},
                  customSections: Array.isArray(cv.customSections)
                    ? cv.customSections
                    : [],
                  layout: {
                    ...(cv.layout || {}),
                    showPageHeader: !!(cv.layout || {}).showPageHeader,
                    showPageFooter: !!(cv.layout || {}).showPageFooter,
                    pageHeaderText: (cv.layout || {}).pageHeaderText || "",
                    pageFooterText: (cv.layout || {}).pageFooterText || "",
                    pagination:
                      (cv.layout || {}).pagination === "dashed"
                        ? "dashed"
                        : "gap",
                  },
                },
              },
            }
          }
          merged.resumes = fixed
        }
        return merged
      },
    },
  ),
)

export function useActiveResume(): ResumeDocument | null {
  return useAppStore((s) => (s.activeId ? s.resumes[s.activeId] || null : null))
}

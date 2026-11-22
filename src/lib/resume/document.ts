import enDefault from "@/data/resume.en.json"
import zhDefault from "@/data/resume.zh-CN.json"
import {
  type AppLanguage,
  type CvfreeMeta,
  ensureArrayIds,
  nowIso,
  type Resume,
  type ResumeDocument,
  resumeSchema,
  type TemplateId,
  uid,
} from "./schema"

export function normalizeResume(
  raw: unknown,
  lang: AppLanguage,
): ResumeDocument {
  const parsed = resumeSchema.parse(raw)
  const meta = parsed.meta || {
    canonical: "",
    version: "v1.0.0",
    lastModified: "",
    lang,
  }
  const cv = meta.cvfree
  const id = cv?.id || uid("resume")
  const now = nowIso()
  const cvfree: CvfreeMeta = {
    id,
    title: cv?.title || (lang === "zh-CN" ? "我的简历" : "My Resume"),
    createdAt: cv?.createdAt || now,
    updatedAt: cv?.updatedAt || now,
    source: cv?.source || "default",
    sourceLang: cv?.sourceLang || lang,
    theme: cv?.theme || {
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
    text: cv?.text || {
      fontHeading: "inter",
      fontBody: "inter",
      fontSize: 14,
      lineHeight: 1.5,
      fontWeight: 400,
      headingSize: 24,
      paragraphSpacing: 8,
    },
    layout: {
      ...(cv?.layout || {}),
      columns: cv?.layout?.columns || "single",
      pageWidth: cv?.layout?.pageWidth || 794,
      format: cv?.layout?.format || "A4",
      margin: cv?.layout?.margin ?? 16,
      sectionSpacing: cv?.layout?.sectionSpacing ?? 16,
      columnRatio: cv?.layout?.columnRatio ?? 35,
      dateFormat: cv?.layout?.dateFormat || "MMM YYYY",
      showPageHeader: !!cv?.layout?.showPageHeader,
      showPageFooter: !!cv?.layout?.showPageFooter,
      pageHeaderText: cv?.layout?.pageHeaderText || "",
      pageFooterText: cv?.layout?.pageFooterText || "",
      pagination: cv?.layout?.pagination === "dashed" ? "dashed" : "gap",
    },
    sectionOrder: cv?.sectionOrder?.length
      ? cv.sectionOrder
      : [
          "basics",
          "work",
          "education",
          "projects",
          "skills",
          "certificates",
          "languages",
          "interests",
          "awards",
          "publications",
          "volunteer",
          "references",
          "custom",
        ],
    sectionVisibility: cv?.sectionVisibility || {},
    customSections: cv?.customSections || [],
    initial: cv?.initial,
  } as any
  return {
    ...parsed,
    basics: {
      ...parsed.basics,
      profiles: (parsed.basics.profiles || []).map((p) => ({
        network: p.network || "",
        username: p.username || "",
        url: p.url || "",
      })),
      location: parsed.basics.location || {
        address: "",
        postalCode: "",
        city: "",
        countryCode: "",
        region: "",
      },
    },
    work: ensureArrayIds(parsed.work as any, "work"),
    education: ensureArrayIds(parsed.education as any, "edu"),
    projects: ensureArrayIds(parsed.projects as any, "proj"),
    skills: ensureArrayIds(parsed.skills as any, "skill").map((s: any) => {
      const m: Record<string, string> = {
        入门: "新手",
        初级: "初级",
        熟练: "熟练",
        精通: "资深",
        专家: "专家",
        Novice: "新手",
        Beginner: "初级",
        Skillful: "熟练",
        Experienced: "资深",
        Expert: "专家",
        Elementary: "初级",
        Advanced: "资深",
      }
      return { ...s, level: m[s.level] ?? s.level }
    }),
    certificates: ensureArrayIds(parsed.certificates as any, "cert"),
    languages: ensureArrayIds(parsed.languages as any, "lang").map((l: any) => {
      const m: Record<string, string> = {
        基础: "基础",
        会话: "会话",
        熟练: "熟练",
        流利: "流利",
        母语: "母语",
        读写流利: "流利",
        Basic: "基础",
        Conversational: "会话",
        Proficient: "熟练",
        Fluent: "流利",
        Native: "母语",
      }
      return { ...l, fluency: m[l.fluency] ?? l.fluency }
    }),
    interests: ensureArrayIds(parsed.interests as any, "int"),
    references: ensureArrayIds(parsed.references as any, "ref"),
    awards: ensureArrayIds(parsed.awards as any, "award"),
    publications: ensureArrayIds(parsed.publications as any, "pub"),
    volunteer: ensureArrayIds(parsed.volunteer as any, "vol"),
    meta: { ...meta, lang, cvfree },
  } as ResumeDocument
}

export function getDefaultResume(lang: AppLanguage): ResumeDocument {
  const raw = lang === "zh-CN" ? zhDefault : enDefault
  const doc = normalizeResume(raw, lang)
  doc.meta.cvfree.source = "default"
  doc.meta.cvfree.sourceLang = lang
  doc.meta.cvfree.title = lang === "zh-CN" ? "默认简历" : "Default Resume"
  return doc
}

export function createBlankResume(
  lang: AppLanguage,
  template: string = "classic",
): ResumeDocument {
  const now = nowIso()
  const base: Resume = {
    $schema:
      "https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json",
    basics: {
      name: "",
      label: "",
      image: "",
      email: "",
      phone: "",
      url: "",
      summary: "",
      location: {
        address: "",
        postalCode: "",
        city: "",
        countryCode: "",
        region: "",
      },
      profiles: [
        { network: "GitHub", username: "", url: "" },
        { network: "LinkedIn", username: "", url: "" },
      ],
    },
    work: [],
    volunteer: [],
    education: [],
    awards: [],
    certificates: [],
    publications: [],
    skills: [],
    languages: [],
    interests: [],
    references: [],
    projects: [],
    meta: { canonical: "", version: "v1.0.0", lastModified: now, lang },
  }
  const doc = normalizeResume(base, lang)
  doc.meta.cvfree.source = "blank"
  doc.meta.cvfree.title = lang === "zh-CN" ? "未命名简历" : "Untitled Resume"
  doc.meta.cvfree.theme.template = template
  doc.meta.cvfree.initial = deepCloneResume({
    ...doc,
    meta: { ...doc.meta, cvfree: { ...doc.meta.cvfree, initial: undefined } },
  })
  return doc
}

export function cloneAsUserResume(
  source: ResumeDocument,
  lang: AppLanguage,
  title?: string,
): ResumeDocument {
  const now = nowIso()
  const copy = deepCloneResume(source) as ResumeDocument
  copy.meta.cvfree.id = uid("resume")
  copy.meta.cvfree.createdAt = now
  copy.meta.cvfree.updatedAt = now
  copy.meta.cvfree.source =
    source.meta.cvfree.source === "default" ? "copy" : "copy"
  copy.meta.cvfree.sourceLang = lang
  copy.meta.lang = lang
  copy.meta.cvfree.title =
    title ||
    (lang === "zh-CN"
      ? `${source.meta.cvfree.title}（副本）`
      : `${source.meta.cvfree.title} (Copy)`)
  copy.work = ensureArrayIds(copy.work, "work")
  copy.education = ensureArrayIds(copy.education, "edu")
  copy.projects = ensureArrayIds(copy.projects, "proj")
  copy.skills = ensureArrayIds(copy.skills, "skill")
  copy.certificates = ensureArrayIds(copy.certificates, "cert")
  copy.languages = ensureArrayIds(copy.languages, "lang")
  copy.interests = ensureArrayIds(copy.interests, "int")
  copy.references = ensureArrayIds(copy.references, "ref")
  copy.awards = ensureArrayIds(copy.awards, "award")
  copy.publications = ensureArrayIds(copy.publications, "pub")
  copy.volunteer = ensureArrayIds(copy.volunteer, "vol")
  copy.meta.cvfree.customSections = (copy.meta.cvfree.customSections || []).map(
    (s) => ({
      ...s,
      id: s.id || uid("csec"),
      items: (s.items || []).map((it) => ({
        ...it,
        id: it.id || uid("citem"),
      })),
    }),
  )
  copy.meta.cvfree.initial = deepCloneResume({
    ...copy,
    meta: { ...copy.meta, cvfree: { ...copy.meta.cvfree, initial: undefined } },
  })
  return copy
}

export function deepCloneResume<T>(value: T): T {
  if (typeof structuredClone === "function") {
    try {
      return structuredClone(value)
    } catch {
      // fall through to JSON clone for edge cases
    }
  }
  return JSON.parse(JSON.stringify(value))
}

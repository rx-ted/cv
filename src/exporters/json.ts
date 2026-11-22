import type { ResumeDocument } from "@/lib/resume/schema"
import { nowIso, resumeSchema, uid } from "@/lib/resume/schema"

function stripStandardResume(doc: ResumeDocument) {
  const {
    meta,
    basics,
    work,
    volunteer,
    education,
    awards,
    certificates,
    publications,
    skills,
    languages,
    interests,
    references,
    projects,
    $schema,
  } = doc
  // basics
  const outBasics = {
    name: basics?.name ?? "",
    label: basics?.label ?? "",
    image: basics?.image ?? "",
    email: basics?.email ?? "",
    phone: basics?.phone ?? "",
    url: basics?.url ?? "",
    summary: basics?.summary ?? "",
    location: {
      address: basics?.location?.address ?? "",
      postalCode: basics?.location?.postalCode ?? "",
      city: basics?.location?.city ?? "",
      countryCode: basics?.location?.countryCode ?? "",
      region: basics?.location?.region ?? "",
    },
    profiles: (basics?.profiles || []).map((p) => ({
      network: p.network ?? "",
      username: p.username ?? "",
      url: p.url ?? "",
    })),
  }

  const outWork = (work || []).map((w) => ({
    name: w.name ?? "",
    position: w.position ?? "",
    url: w.url ?? "",
    startDate: w.startDate ?? "",
    endDate: w.endDate ?? "",
    summary: w.summary ?? "",
    highlights: Array.isArray(w.highlights) ? w.highlights : [],
  }))

  const outVolunteer = (volunteer || []).map((v) => ({
    organization: v.organization ?? "",
    position: v.position ?? "",
    url: v.url ?? "",
    startDate: v.startDate ?? "",
    endDate: v.endDate ?? "",
    summary: v.summary ?? "",
    highlights: Array.isArray(v.highlights) ? v.highlights : [],
  }))

  const outEducation = (education || []).map((e) => {
    const base: any = {
      institution: e.institution ?? "",
      url: e.url ?? "",
      area: e.area ?? "",
      studyType: e.studyType ?? "",
      startDate: e.startDate ?? "",
      endDate: e.endDate ?? "",
      courses: Array.isArray(e.courses) ? e.courses : [],
    }
    if (e.gpa) base.gpa = e.gpa
    return base
  })

  const outAwards = (awards || []).map((a) => ({
    title: a.title ?? "",
    date: a.date ?? "",
    awarder: a.awarder ?? "",
    summary: a.summary ?? "",
  }))

  const outCertificates = (certificates || []).map((c) => ({
    name: c.name ?? "",
    date: c.date ?? "",
    issuer: c.issuer ?? "",
    url: c.url ?? "",
  }))

  const outPublications = (publications || []).map((p) => ({
    name: p.name ?? "",
    publisher: p.publisher ?? "",
    releaseDate: p.releaseDate ?? "",
    url: p.url ?? "",
    summary: p.summary ?? "",
  }))

  const outSkills = (skills || []).map((s) => ({
    name: s.name ?? "",
    level: s.level ?? "",
    keywords: Array.isArray(s.keywords) ? s.keywords : [],
  }))

  const outLanguages = (languages || []).map((l) => ({
    language: l.language ?? "",
    fluency: l.fluency ?? "",
  }))

  const outInterests = (interests || []).map((i) => ({
    name: i.name ?? "",
    keywords: Array.isArray(i.keywords) ? i.keywords : [],
  }))

  const outReferences = (references || []).map((r) => ({
    name: r.name ?? "",
    reference: r.reference ?? "",
  }))

  const outProjects = (projects || []).map((p) => ({
    name: p.name ?? "",
    description: p.description ?? "",
    highlights: Array.isArray(p.highlights) ? p.highlights : [],
    keywords: Array.isArray(p.keywords) ? p.keywords : [],
    startDate: p.startDate ?? "",
    endDate: p.endDate ?? "",
    url: p.url ?? "",
    roles: Array.isArray(p.roles) ? p.roles : [],
    entity: p.entity ?? "",
    type: p.type ?? "",
  }))

  const outMeta = {
    canonical: meta?.canonical ?? "",
    version: meta?.version ?? "v1.0.0",
    lastModified: nowIso(),
  }

  return {
    $schema:
      $schema ||
      "https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json",
    basics: outBasics,
    work: outWork,
    volunteer: outVolunteer,
    education: outEducation,
    awards: outAwards,
    certificates: outCertificates,
    publications: outPublications,
    skills: outSkills,
    languages: outLanguages,
    interests: outInterests,
    references: outReferences,
    projects: outProjects,
    meta: outMeta,
  }
}

export function exportJsonResume(doc: ResumeDocument) {
  const out = stripStandardResume(doc)
  const blob = new Blob([JSON.stringify(out, null, 2)], {
    type: "application/json;charset=utf-8",
  })
  const a = document.createElement("a")
  a.href = URL.createObjectURL(blob)
  const name = (doc.meta.cvfree.title || "resume").replace(/[\\/:*?"<>|]/g, "_")
  a.download = `${name}.json`
  a.click()
  setTimeout(() => URL.revokeObjectURL(a.href), 1000)
}

export function parseImportedJson(text: string): ResumeDocument {
  const raw = JSON.parse(text)
  const parsed = resumeSchema.parse(raw)
  const lang = parsed.meta?.lang === "en" ? "en" : "zh-CN"
  const now = nowIso()
  const cv = parsed.meta?.cvfree
  const id = uid("resume")
  const doc = {
    ...parsed,
    meta: {
      ...(parsed.meta || {
        canonical: "",
        version: "v1.0.0",
        lastModified: now,
        lang,
      }),
      lang,
      cvfree: {
        id,
        title:
          cv?.title ||
          raw.basics?.name ||
          (lang === "zh-CN" ? "导入的简历" : "Imported Resume"),
        createdAt: now,
        updatedAt: now,
        source: "import" as const,
        sourceLang: lang,
        theme: cv?.theme || {
          template: "classic" as const,
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
          fontHeading: "inter" as const,
          fontBody: "inter" as const,
          fontSize: 14,
          lineHeight: 1.5,
          fontWeight: 400,
          headingSize: 24,
          paragraphSpacing: 8,
        },
        layout: cv?.layout || {
          columns: "single" as const,
          pageWidth: 794,
          format: "A4" as const,
          margin: 16,
          sectionSpacing: 16,
          columnRatio: 35,
          dateFormat: "MMM YYYY" as const,
        },
        sectionOrder: cv?.sectionOrder || [
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
      },
    },
  } as ResumeDocument
  const fix = (arr: any[], p: string) =>
    (arr || []).map((x, i) => ({
      ...x,
      id: x.id || `${p}-${i}-${Math.random().toString(36).slice(2, 6)}`,
    }))
  doc.work = fix(doc.work, "work")
  doc.education = fix(doc.education, "edu")
  doc.projects = fix(doc.projects, "proj")
  doc.skills = fix(doc.skills, "skill")
  doc.certificates = fix(doc.certificates, "cert")
  doc.languages = fix(doc.languages, "lang")
  doc.interests = fix(doc.interests, "int")
  doc.references = fix(doc.references, "ref")
  doc.awards = fix(doc.awards, "award")
  doc.publications = fix(doc.publications, "pub")
  doc.volunteer = fix(doc.volunteer, "vol")
  return doc
}

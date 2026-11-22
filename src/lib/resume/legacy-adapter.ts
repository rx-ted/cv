import { TEMPLATES } from "@/templates/registry"
import type { AppLanguage, ResumeDocument } from "./schema"
import { resolveTemplateId, uid } from "./schema"
import type {
  LinkItem,
  Personal,
  ReferenceItem,
  Resume,
  ResumeSettings,
  Section,
  SkillItem,
  TimelineItem,
} from "./schema-legacy"

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

function toHtml(s: string): string {
  if (!s) return ""
  if (/<\/?[a-z][\s\S]*>/i.test(s)) return s
  return `<p>${esc(s).replace(/\n/g, "<br/>")}</p>`
}

function highlightsHtml(summary: string, highlights: string[]): string {
  const parts: string[] = []
  if (summary?.trim()) parts.push(toHtml(summary))
  const hs = (highlights || []).filter((h) => h && h.trim())
  if (hs.length) {
    parts.push(
      `<ul>${hs.map((h) => `<li>${/<\/?[a-z][\s\S]*>/i.test(h) ? h : esc(h)}</li>`).join("")}</ul>`,
    )
  }
  return parts.join("")
}

function splitName(name: string): { firstName: string; lastName: string } {
  const n = (name || "").trim()
  if (!n) return { firstName: "", lastName: "" }
  if (/\s/.test(n)) {
    const parts = n.split(/\s+/)
    return {
      firstName: parts.slice(0, -1).join(" "),
      lastName: parts[parts.length - 1] || "",
    }
  }
  // CJK or single token: keep whole name as firstName so fullName() renders correctly
  return { firstName: n, lastName: "" }
}

function visibleKey(vis: Record<string, boolean>, key: string) {
  return vis[key] !== false
}

function tlItem(
  id: string,
  title: string,
  subtitle: string,
  city: string,
  start: string,
  end: string,
  desc: string,
): TimelineItem {
  return {
    id: id || uid("ti"),
    title: title || "",
    subtitle: subtitle || "",
    city: city || "",
    startDate: start || "",
    endDate: end || "",
    current: false,
    description: desc || "",
  }
}

export function toLegacyResume(doc: ResumeDocument, lang: AppLanguage): Resume {
  const cv = doc.meta.cvfree
  const b = doc.basics || ({} as any)
  const vis = cv.sectionVisibility || {}
  const { firstName, lastName } = splitName(b.name || "")
  const profiles = b.profiles || []
  const findProfile = (net: string) =>
    profiles.find((p) => (p.network || "").toLowerCase() === net.toLowerCase())
      ?.url || ""
  const linkedin = findProfile("linkedin") || findProfile("领英") || ""
  const website = b.url || findProfile("website") || ""
  const github = findProfile("github")
  const otherProfiles = profiles.filter((p) => {
    const n = (p.network || "").toLowerCase()
    return n && n !== "linkedin" && n !== "领英" && !(n === "github" && false) // keep github in links too? include as link
  })

  const personal: Personal = {
    jobTitle: b.label || "",
    firstName,
    lastName,
    email: b.email || "",
    phone: b.phone || "",
    website,
    linkedin,
    address: b.location?.address || "",
    city: b.location?.city || "",
    postalCode: b.location?.postalCode || "",
    country: b.location?.countryCode || b.location?.region || "",
    nationality: "",
    placeOfBirth: "",
    dateOfBirth: "",
    drivingLicense: "",
    photo: b.image || null,
  }

  const sections: Section[] = []
  const forceSingle = cv.layout?.columns === "single"
  const col = (): "auto" | "main" | "side" => (forceSingle ? "main" : "auto")

  // summary
  if (visibleKey(vis, "basics") && b.summary?.trim()) {
    sections.push({
      id: uid("sec"),
      type: "summary",
      title: "",
      hidden: false,
      column: col(),
      kind: "text",
      html: toHtml(b.summary),
    })
  }

  // work
  const workItems = (doc.work || []).filter((w) => w.visible !== false)
  if (visibleKey(vis, "work") && workItems.length) {
    sections.push({
      id: uid("sec"),
      type: "experience",
      title: "",
      hidden: false,
      column: col(),
      kind: "timeline",
      items: workItems.map((w) =>
        tlItem(
          w.id,
          w.position || "",
          w.name || "",
          w.location || "",
          w.startDate || "",
          w.endDate || "",
          highlightsHtml(w.summary || "", w.highlights || []),
        ),
      ),
    })
  }

  // education
  const eduItems = (doc.education || []).filter((e) => e.visible !== false)
  if (visibleKey(vis, "education") && eduItems.length) {
    sections.push({
      id: uid("sec"),
      type: "education",
      title: "",
      hidden: false,
      column: col(),
      kind: "timeline",
      items: eduItems.map((e) =>
        tlItem(
          e.id,
          [e.studyType, e.area].filter(Boolean).join(" · ") ||
            e.studyType ||
            e.area ||
            "",
          e.institution || "",
          "",
          e.startDate || "",
          e.endDate || "",
          highlightsHtml(
            e.summary || "",
            e.highlights ||
              (e.courses?.length
                ? [
                    `${lang === "zh-CN" ? "课程" : "Courses"}: ${e.courses.join(", ")}`,
                  ]
                : []),
          ),
        ),
      ),
    })
  }

  // projects
  const projItems = (doc.projects || []).filter((p) => p.visible !== false)
  if (visibleKey(vis, "projects") && projItems.length) {
    sections.push({
      id: uid("sec"),
      type: "projects",
      title: "",
      hidden: false,
      column: col(),
      kind: "timeline",
      items: projItems.map((p) => {
        const extra: string[] = []
        if (p.keywords?.length)
          extra.push(
            (lang === "zh-CN" ? "技术栈: " : "Tech: ") + p.keywords.join(", "),
          )
        if (p.url) extra.push(p.url)
        const desc = highlightsHtml(p.description || "", [
          ...(extra.length ? [extra.join(" · ")] : []),
          ...(p.highlights || []).filter(
            (h) => h && !h.startsWith("项目图片") && !h.startsWith("Image:"),
          ),
        ])
        return tlItem(
          p.id,
          p.name || "",
          p.entity || (p.roles || []).join(", ") || "",
          "",
          p.startDate || "",
          p.endDate || "",
          desc,
        )
      }),
    })
  }

  // skills
  const parseSkillLevel = (lv: string) => {
    const s = (lv || "").trim()
    const n = Number(s)
    if (Number.isFinite(n) && n >= 0 && n <= 5) return Math.round(n)
    // new canonical
    if (s === "新手") return 1
    if (s === "初级") return 2
    if (s === "熟练") return 3
    if (s === "资深") return 4
    if (s === "专家") return 5
    // legacy zh
    if (s === "入门") return 1
    if (s === "精通") return 4
    const low = s.toLowerCase()
    if (low === "novice") return 1
    if (low === "beginner" || low === "elementary") return 2
    if (low === "skillful" || low === "intermediate" || low === "proficient")
      return 3
    if (low === "experienced" || low === "advanced" || low === "senior")
      return 4
    if (low === "expert" || low === "master") return 5
    return 0
  }
  const skillItems = (doc.skills || []).filter((s) => s.visible !== false)
  if (visibleKey(vis, "skills") && skillItems.length) {
    sections.push({
      id: uid("sec"),
      type: "skills",
      title: "",
      hidden: false,
      column: col(),
      kind: "skills",
      showLevel: true,
      items: skillItems.map((s): SkillItem => {
        const kws = (s.keywords || []).filter(Boolean)
        const name =
          kws.length && s.name
            ? `${s.name}: ${kws.join(", ")}`
            : s.name || kws.join(", ")
        const level = parseSkillLevel(s.level || "")
        return { id: s.id || uid("sk"), name, level, category: "" }
      }),
    })
  }

  // certificates
  const certItems = (doc.certificates || []).filter((c) => c.visible !== false)
  if (visibleKey(vis, "certificates") && certItems.length) {
    sections.push({
      id: uid("sec"),
      type: "certifications",
      title: "",
      hidden: false,
      column: col(),
      kind: "timeline",
      items: certItems.map((c) =>
        tlItem(
          c.id,
          c.name || "",
          c.issuer || "",
          "",
          c.date || "",
          "",
          c.url ? `<p><a href="${esc(c.url)}">${esc(c.url)}</a></p>` : "",
        ),
      ),
    })
  }

  // languages
  const langItems = (doc.languages || []).filter((l) => l.visible !== false)
  if (visibleKey(vis, "languages") && langItems.length) {
    sections.push({
      id: uid("sec"),
      type: "languages",
      title: "",
      hidden: false,
      column: col(),
      kind: "skills",
      showLevel: true,
      items: langItems.map((l): SkillItem => {
        const flu = (l.fluency || "").toLowerCase()
        let level = 0
        if (/native|母语/.test(flu)) level = 5
        else if (/fluent|流利/.test(flu)) level = 4
        else if (/proficient|熟练|advanced/.test(flu)) level = 3
        else if (/conversational|intermediate|中级|会话/.test(flu)) level = 2
        else if (/basic|beginner|初级|基础|elementary/.test(flu)) level = 1
        return {
          id: l.id || uid("sk"),
          name: l.language || "",
          level,
          category: "",
        }
      }),
    })
  }

  // interests
  const intItems = (doc.interests || []).filter((i) => i.visible !== false)
  if (visibleKey(vis, "interests") && intItems.length) {
    const text = intItems
      .map((i) => [i.name, ...(i.keywords || [])].filter(Boolean).join(", "))
      .filter(Boolean)
      .join(" · ")
    sections.push({
      id: uid("sec"),
      type: "hobbies",
      title: "",
      hidden: false,
      column: col(),
      kind: "text",
      html: `<p>${esc(text)}</p>`,
    })
  }

  // awards
  const awardItems = (doc.awards || []).filter((a) => a.visible !== false)
  if (visibleKey(vis, "awards") && awardItems.length) {
    sections.push({
      id: uid("sec"),
      type: "awards",
      title: "",
      hidden: false,
      column: col(),
      kind: "timeline",
      items: awardItems.map((a) =>
        tlItem(
          a.id,
          a.title || "",
          a.awarder || "",
          "",
          a.date || "",
          "",
          toHtml(a.summary || ""),
        ),
      ),
    })
  }

  // publications
  const pubItems = (doc.publications || []).filter((p) => p.visible !== false)
  if (visibleKey(vis, "publications") && pubItems.length) {
    sections.push({
      id: uid("sec"),
      type: "publications",
      title: "",
      hidden: false,
      column: col(),
      kind: "timeline",
      items: pubItems.map((p) =>
        tlItem(
          p.id,
          p.name || "",
          p.publisher || "",
          "",
          p.releaseDate || "",
          "",
          [
            toHtml(p.summary || ""),
            p.url ? `<p><a href="${esc(p.url)}">${esc(p.url)}</a></p>` : "",
          ]
            .filter(Boolean)
            .join(""),
        ),
      ),
    })
  }

  // volunteer
  const volItems = (doc.volunteer || []).filter((v) => v.visible !== false)
  if (visibleKey(vis, "volunteer") && volItems.length) {
    sections.push({
      id: uid("sec"),
      type: "volunteering",
      title: "",
      hidden: false,
      column: col(),
      kind: "timeline",
      items: volItems.map((v) =>
        tlItem(
          v.id,
          v.position || "",
          v.organization || "",
          "",
          v.startDate || "",
          v.endDate || "",
          highlightsHtml(v.summary || "", v.highlights || []),
        ),
      ),
    })
  }

  // references (new schema stores a free-text reference blurb)
  const refItems = (doc.references || []).filter((r) => r.visible !== false)
  if (visibleKey(vis, "references") && refItems.length) {
    sections.push({
      id: uid("sec"),
      type: "customTimeline",
      title: lang === "zh-CN" ? "推荐人" : "References",
      hidden: false,
      column: col(),
      kind: "timeline",
      items: refItems.map((r) =>
        tlItem(r.id, r.name || "", "", "", "", "", toHtml(r.reference || "")),
      ),
    })
  }

  // links section from profiles not already shown in header contact line
  const extraLinks = profiles
    .filter((p) => {
      const n = (p.network || "").toLowerCase()
      const u = (p.url || "").trim()
      if (!u) return false
      if (n === "linkedin" || n === "领英") return false
      if (u === website) return false
      return true
    })
    .map((p) => ({ id: uid("lnk"), label: p.network || "", url: p.url || "" }))
  if (extraLinks.length) {
    sections.push({
      id: uid("sec"),
      type: "links",
      title: "",
      hidden: false,
      column: col(),
      kind: "links",
      items: extraLinks,
    })
  }

  // custom sections
  for (const cs of cv.customSections || []) {
    if (cs.visible === false) continue
    const items = (cs.items || []).map((it) =>
      tlItem(
        it.id,
        it.title || "",
        it.subtitle || "",
        "",
        it.date || "",
        "",
        [
          toHtml(it.description || ""),
          it.url ? `<p><a href="${esc(it.url)}">${esc(it.url)}</a></p>` : "",
        ]
          .filter(Boolean)
          .join(""),
      ),
    )
    sections.push({
      id: cs.id || uid("sec"),
      type: "customTimeline",
      title: cs.title || "",
      hidden: false,
      column: col(),
      kind: "timeline",
      items,
    })
  }

  const templateId = resolveTemplateId(cv.theme?.template || "classic")
  const tpl = TEMPLATES.find((t) => t.id === templateId) || TEMPLATES[0]
  const d = tpl.defaults

  const skillsLayout = (d.skillsLayout as any) || "columns"
  const settings: ResumeSettings = {
    template: templateId,
    color: cv.theme?.color || "#1f4e79",
    fonts: {
      heading:
        (cv.text?.fontHeading as any) || (d.fonts?.heading as any) || "inter",
      body: (cv.text?.fontBody as any) || (d.fonts?.body as any) || "inter",
    },
    lineHeight: cv.text?.lineHeight ?? 1.35,
    fontSize: {
      name: cv.text?.headingSize ?? 24,
      heading: Math.max(8, Math.min(16, (cv.text?.fontSize ?? 9.5) + 1)),
      body: cv.text?.fontSize ?? 9.5,
      section: Math.max(8, Math.min(20, (cv.text?.fontSize ?? 9.5) + 2.5)),
    },
    fontWeight: {
      name: 700,
      heading: Math.min(800, Math.max(300, cv.text?.fontWeight ?? 600)),
      section: Math.min(800, Math.max(300, cv.text?.fontWeight ?? 600)),
    },
    page: {
      format: (cv.layout?.format as any) || "A4",
      marginX: cv.layout?.margin ?? 16,
      marginY: cv.layout?.margin ?? 14,
    },
    spacing: {
      section: cv.layout?.sectionSpacing ?? 12,
      title: 5,
      block: cv.text?.paragraphSpacing ?? 7,
      inside: 2,
    },
    dateFormat: (cv.layout?.dateFormat as any) || "MMM YYYY",
    headerAlign: (d.headerAlign as any) || "left",
    dateAlign: (d.dateAlign as any) || "right",
    skillsLayout,
    skillLevelStyle: skillsLayout === "inline" ? "text" : "dots",
    skillsColumns: 2,
    skillsDivider: "•",
    educationFirst: "degree",
    uppercaseTitles: d.uppercaseTitles ?? false,
    contactIcons: true,
    photo: { show: true, shape: "circle", size: 28 },
    headerText: "",
    footerText: "",
    pageNumbering: "none",
  }

  const legacyLocale: "zh-CN" | "en" = lang === "zh-CN" ? "zh-CN" : "en"
  const legacy: any = {
    id: cv.id || doc.meta?.cvfree?.id || uid("legacy"),
    title: cv.title || "Resume",
    locale: legacyLocale,
    createdAt: cv.createdAt || new Date().toISOString(),
    updatedAt: cv.updatedAt || new Date().toISOString(),
    personal,
    sections,
    settings,
    shareToken: null,
  }
  legacy.__cvfree = {
    background: cv.theme?.background || "#ffffff",
    textColor: cv.theme?.textColor || "#1f2937",
    accentColor: cv.theme?.accentColor || cv.theme?.color || "#0d9488",
    secondaryText: cv.theme?.secondaryText || "#6b7280",
    border: cv.theme?.border || "#e5e7eb",
    mutedBackground: cv.theme?.mutedBackground || "#f3f4f6",
    link: cv.theme?.link || "#1d4ed8",
  }
  return legacy as Resume
}

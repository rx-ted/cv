import { z } from "zod"

/**
 * JSON Resume (jsonresume/resume-schema v1.0.0) superset.
 *
 * - Base structure follows JSON Resume v1.0.0 (basics, work, volunteer, education, awards,
 *   certificates, publications, skills, languages, interests, references, projects, meta).
 * - App extensions (non-standard) are added throughout, e.g. stable `id` and `visible` on
 *   list items, extra fields in some sections (e.g. work.location, education.gpa/highlights/
 *   summary/url), custom sections under `meta.cvfree`, and `meta.cvfree` / `meta.lang`.
 * - `meta.cvfree` holds all app-specific UI/theme/layout/state (not part of JSON Resume).
 */

export const APP_LANGUAGES = ["zh-CN", "en"] as const
export type AppLanguage = (typeof APP_LANGUAGES)[number]

export const LEGACY_TEMPLATE_IDS = [
  "lisbon",
  "oxford",
  "plain",
  "meridian",
  "ledger",
  "swift",
  "vector",
  "timeline",
  "bold",
  "atlas",
  "nordic",
  "summit",
  "horizon",
  "duo",
] as const

export const TEMPLATE_IDS = [
  "classic",
  "modern",
  "minimal",
  "professional",
  "creative",
  ...LEGACY_TEMPLATE_IDS,
] as const
export type TemplateId = (typeof TEMPLATE_IDS)[number]

export const LEGACY_TEMPLATE_MAP: Record<
  string,
  (typeof LEGACY_TEMPLATE_IDS)[number]
> = {
  classic: "lisbon",
  modern: "meridian",
  minimal: "plain",
  professional: "oxford",
  creative: "bold",
}

export function resolveTemplateId(
  id: string,
): (typeof LEGACY_TEMPLATE_IDS)[number] {
  return (LEGACY_TEMPLATE_MAP[id] ||
    id ||
    "lisbon") as (typeof LEGACY_TEMPLATE_IDS)[number]
}

export const FONT_IDS = [
  "inter",
  "roboto",
  "lato",
  "open-sans",
  "source-sans-3",
  "ibm-plex-sans",
  "work-sans",
  "nunito",
  "montserrat",
  "raleway",
  "noto-sans-sc",
  "noto-serif-sc",
  "lxgw-wenkai",
  "merriweather",
  "source-serif-4",
  "lora",
  "pt-serif",
  "eb-garamond",
] as const
export type FontId = (typeof FONT_IDS)[number]

export const DATE_FORMATS = [
  "MMM YYYY",
  "MMMM YYYY",
  "MM/YYYY",
  "YYYY",
] as const
export type DateFormat = (typeof DATE_FORMATS)[number]

const str = z.string().catch("")
const bool = z.boolean().catch(false)
const num = (min: number, max: number, fallback: number) =>
  z.number().min(min).max(max).catch(fallback)

export const profileSchema = z.object({
  network: str,
  username: str,
  url: str,
})
export type Profile = z.infer<typeof profileSchema>

export const locationSchema = z.object({
  address: str,
  postalCode: str,
  city: str,
  countryCode: str,
  region: str,
})
export type Location = z.infer<typeof locationSchema>

export const basicsSchema = z.object({
  name: str,
  label: str,
  image: str,
  email: str,
  phone: str,
  url: str,
  summary: str,
  location: locationSchema.catch({
    address: "",
    postalCode: "",
    city: "",
    countryCode: "",
    region: "",
  }),
  profiles: z.array(profileSchema).catch([]),
})
export type Basics = z.infer<typeof basicsSchema>

export const workSchema = z.object({
  id: str, // app extension
  name: str,
  position: str,
  url: str,
  startDate: str,
  endDate: str,
  summary: str,
  highlights: z.array(z.string().catch("")).catch([]),
  location: str, // app extension (not in JSON Resume v1.0.0)
  visible: z.boolean().default(true).catch(true), // app extension
})
export type Work = z.infer<typeof workSchema>

export const educationSchema = z.object({
  id: str, // app extension
  institution: str,
  url: str, // app extension (commonly used in practice)
  area: str,
  studyType: str,
  startDate: str,
  endDate: str,
  gpa: str,
  courses: z.array(z.string().catch("")).catch([]),
  highlights: z.array(z.string().catch("")).catch([]), // app extension
  summary: str, // app extension
  visible: z.boolean().default(true).catch(true), // app extension
})
export type Education = z.infer<typeof educationSchema>

export const projectSchema = z.object({
  id: str,
  name: str,
  description: str,
  highlights: z.array(z.string().catch("")).catch([]),
  keywords: z.array(z.string().catch("")).catch([]),
  startDate: str,
  endDate: str,
  url: str,
  roles: z.array(z.string().catch("")).catch([]),
  entity: str,
  type: str,
  visible: z.boolean().default(true).catch(true),
})
export type Project = z.infer<typeof projectSchema>

export const skillSchema = z.object({
  id: str,
  name: str,
  level: str,
  keywords: z.array(z.string().catch("")).catch([]),
  visible: z.boolean().default(true).catch(true),
})
export type Skill = z.infer<typeof skillSchema>

export const certificateSchema = z.object({
  id: str,
  name: str,
  date: str,
  issuer: str,
  url: str,
  visible: z.boolean().default(true).catch(true),
})
export type Certificate = z.infer<typeof certificateSchema>

export const languageSkillSchema = z.object({
  id: str,
  language: str,
  fluency: str,
  visible: z.boolean().default(true).catch(true),
})
export type LanguageSkill = z.infer<typeof languageSkillSchema>

export const interestSchema = z.object({
  id: str,
  name: str,
  keywords: z.array(z.string().catch("")).catch([]),
  visible: z.boolean().default(true).catch(true),
})
export type Interest = z.infer<typeof interestSchema>

export const referenceSchema = z.object({
  id: str,
  name: str,
  reference: str,
  visible: z.boolean().default(true).catch(true),
})
export type Reference = z.infer<typeof referenceSchema>

export const awardSchema = z.object({
  id: str,
  title: str,
  date: str,
  awarder: str,
  summary: str,
  visible: z.boolean().default(true).catch(true),
})
export type Award = z.infer<typeof awardSchema>

export const publicationSchema = z.object({
  id: str,
  name: str,
  publisher: str,
  releaseDate: str,
  url: str,
  summary: str,
  visible: z.boolean().default(true).catch(true),
})
export type Publication = z.infer<typeof publicationSchema>

export const volunteerSchema = z.object({
  id: str,
  organization: str,
  position: str,
  url: str,
  startDate: str,
  endDate: str,
  summary: str,
  highlights: z.array(z.string().catch("")).catch([]),
  visible: z.boolean().default(true).catch(true),
})
export type Volunteer = z.infer<typeof volunteerSchema>

export const customItemSchema = z.object({
  id: str,
  title: str,
  subtitle: str,
  date: str,
  description: str,
  url: str,
})
export type CustomItem = z.infer<typeof customItemSchema>

export const customSectionSchema = z.object({
  id: str,
  title: str,
  visible: z.boolean().default(true).catch(true),
  items: z.array(customItemSchema).catch([]),
})
export type CustomSection = z.infer<typeof customSectionSchema>

export const themeSchema = z.object({
  template: z.string().catch("classic"),
  color: z.string().catch("#2563eb"),
  background: z.string().catch("#ffffff"),
  textColor: z.string().catch("#1f2937"),
  accentColor: z.string().catch("#0d9488"),
  secondaryText: z.string().catch("#6b7280"),
  border: z.string().catch("#e5e7eb"),
  mutedBackground: z.string().catch("#f3f4f6"),
  link: z.string().catch("#2563eb"),
})
export type ThemeConfig = z.infer<typeof themeSchema>

export const textConfigSchema = z.object({
  fontHeading: z.enum(FONT_IDS).catch("inter"),
  fontBody: z.enum(FONT_IDS).catch("inter"),
  fontSize: num(12, 18, 14),
  lineHeight: num(1.2, 2, 1.5),
  fontWeight: num(300, 700, 400),
  headingSize: num(16, 36, 24),
  paragraphSpacing: num(4, 24, 8),
})
export type TextConfig = z.infer<typeof textConfigSchema>

export const layoutConfigSchema = z.object({
  columns: z.enum(["single", "double"]).catch("single"),
  pageWidth: num(700, 1100, 794), // px at ~96dpi, A4 ~794
  format: z.enum(["A4", "Letter"]).catch("A4"),
  margin: num(8, 40, 16), // mm
  sectionSpacing: num(8, 40, 16),
  columnRatio: num(30, 70, 35), // left column %
  dateFormat: z.enum(DATE_FORMATS).catch("MMM YYYY"),
  showPageHeader: z.boolean().default(false).catch(false),
  showPageFooter: z.boolean().default(false).catch(false),
  pageHeaderText: str,
  pageFooterText: str,
  pagination: z.enum(["gap", "dashed"]).catch("gap"),
})
export type LayoutConfig = z.infer<typeof layoutConfigSchema>

export const cvfreeMetaSchema = z.object({
  id: str,
  title: z.string().catch("未命名简历"),
  createdAt: str,
  updatedAt: str,
  source: z
    .enum(["default", "blank", "template", "copy", "import"])
    .catch("blank"),
  sourceLang: z.enum(APP_LANGUAGES).optional(),
  theme: themeSchema.catch({
    template: "classic",
    color: "#2563eb",
    background: "#ffffff",
    textColor: "#1f2937",
    accentColor: "#0d9488",
    secondaryText: "#6b7280",
    border: "#e5e7eb",
    mutedBackground: "#f3f4f6",
    link: "#1d4ed8",
  }),
  text: textConfigSchema.catch({
    fontHeading: "inter",
    fontBody: "inter",
    fontSize: 14,
    lineHeight: 1.5,
    fontWeight: 400,
    headingSize: 24,
    paragraphSpacing: 8,
  }),
  layout: layoutConfigSchema.catch({
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
  }),
  sectionOrder: z
    .array(z.string())
    .catch([
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
    ]),
  sectionVisibility: z.record(z.string(), z.boolean()).catch({}),
  customSections: z.array(customSectionSchema).catch([]),
  initial: z.any().optional(),
})
export type CvfreeMeta = z.infer<typeof cvfreeMetaSchema>

export const metaSchema = z
  .object({
    canonical: str.catch(""),
    version: str.catch("v1.0.0"),
    lastModified: str.catch(""),
    lang: z.enum(APP_LANGUAGES).catch("zh-CN"),
    cvfree: cvfreeMetaSchema.optional(),
  })
  .catch({
    canonical: "",
    version: "v1.0.0",
    lastModified: "",
    lang: "zh-CN" as AppLanguage,
  })

export const resumeSchema = z.object({
  $schema: str.optional(),
  basics: basicsSchema.catch({
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
    profiles: [],
  }),
  work: z.array(workSchema).catch([]),
  volunteer: z.array(volunteerSchema).catch([]),
  education: z.array(educationSchema).catch([]),
  awards: z.array(awardSchema).catch([]),
  certificates: z.array(certificateSchema).catch([]),
  publications: z.array(publicationSchema).catch([]),
  skills: z.array(skillSchema).catch([]),
  languages: z.array(languageSkillSchema).catch([]),
  interests: z.array(interestSchema).catch([]),
  references: z.array(referenceSchema).catch([]),
  projects: z.array(projectSchema).catch([]),
  meta: metaSchema,
})
export type Resume = z.infer<typeof resumeSchema>

export type ResumeDocument = Resume & {
  meta: z.infer<typeof metaSchema> & { cvfree: CvfreeMeta }
}

export function ensureArrayIds<T extends { id?: string }>(
  arr: T[] | undefined,
  prefix: string,
): (T & { id: string })[] {
  return (arr || []).map((item, i) => ({
    ...item,
    id: item.id || `${prefix}-${i}-${Math.random().toString(36).slice(2, 8)}`,
  })) as (T & { id: string })[]
}

export function nowIso() {
  return new Date().toISOString()
}

export function uid(prefix = "id") {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`
}

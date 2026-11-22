import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} from "docx"
import type { AppLanguage, ResumeDocument } from "@/lib/resume/schema"

function dl(blob: Blob, name: string) {
  const a = document.createElement("a")
  a.href = URL.createObjectURL(blob)
  a.download = name
  a.click()
  setTimeout(() => URL.revokeObjectURL(a.href), 1000)
}

function textParas(text: string, opts: { bullet?: boolean } = {}) {
  const lines = (text || "")
    .replace(/<[^>]+>/g, "")
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean)
  return lines.map(
    (l) =>
      new Paragraph({
        text: l,
        bullet: opts.bullet ? { level: 0 } : undefined,
        spacing: { after: 120 },
      }),
  )
}

export async function exportDocx(doc: ResumeDocument, lang: AppLanguage) {
  const b = doc.basics
  const children: Paragraph[] = []
  children.push(
    new Paragraph({
      text: b.name || (lang === "zh-CN" ? "姓名" : "Name"),
      heading: HeadingLevel.TITLE,
      spacing: { after: 120 },
    }),
  )
  const contact = [
    b.label,
    b.email,
    b.phone,
    [b.location?.city, b.location?.region, b.location?.countryCode]
      .filter(Boolean)
      .join(" "),
    b.url,
  ]
    .filter(Boolean)
    .join(" | ")
  if (contact)
    children.push(new Paragraph({ text: contact, spacing: { after: 200 } }))
  if (b.summary) {
    children.push(
      new Paragraph({
        text: lang === "zh-CN" ? "个人简介" : "Summary",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 80 },
      }),
    )
    children.push(...textParas(b.summary))
  }
  if (doc.work?.length) {
    children.push(
      new Paragraph({
        text: lang === "zh-CN" ? "工作经历" : "Experience",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 80 },
      }),
    )
    for (const w of doc.work) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: [w.position, w.name].filter(Boolean).join(" - "),
              bold: true,
            }),
          ],
          spacing: { after: 40 },
        }),
      )
      const date = [
        w.startDate,
        w.endDate ||
          (w.endDate === "" ? (lang === "zh-CN" ? "至今" : "Present") : ""),
      ]
        .filter(Boolean)
        .join(" – ")
      if (date)
        children.push(new Paragraph({ text: date, spacing: { after: 40 } }))
      if (w.summary) children.push(...textParas(w.summary))
      for (const h of w.highlights || [])
        if (h) children.push(new Paragraph({ text: h, bullet: { level: 0 } }))
    }
  }
  if (doc.education?.length) {
    children.push(
      new Paragraph({
        text: lang === "zh-CN" ? "教育经历" : "Education",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 80 },
      }),
    )
    for (const e of doc.education) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: [e.institution, e.studyType, e.area]
                .filter(Boolean)
                .join(" - "),
              bold: true,
            }),
          ],
          spacing: { after: 40 },
        }),
      )
      const date = [e.startDate, e.endDate].filter(Boolean).join(" – ")
      if (date)
        children.push(new Paragraph({ text: date, spacing: { after: 40 } }))
      for (const h of e.highlights || [])
        if (h) children.push(new Paragraph({ text: h, bullet: { level: 0 } }))
    }
  }
  if (doc.projects?.length) {
    children.push(
      new Paragraph({
        text: lang === "zh-CN" ? "项目经历" : "Projects",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 80 },
      }),
    )
    for (const p of doc.projects) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: p.name || "", bold: true })],
          spacing: { after: 40 },
        }),
      )
      if (p.description) children.push(...textParas(p.description))
      if (p.keywords?.length)
        children.push(
          new Paragraph({
            text:
              (lang === "zh-CN" ? "技术栈：" : "Tech: ") +
              p.keywords.join(", "),
            spacing: { after: 40 },
          }),
        )
      if (p.url)
        children.push(new Paragraph({ text: p.url, spacing: { after: 40 } }))
    }
  }
  if (doc.skills?.length) {
    children.push(
      new Paragraph({
        text: lang === "zh-CN" ? "技能" : "Skills",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 80 },
      }),
    )
    for (const s of doc.skills) {
      const line = [s.name, (s.keywords || []).join(", "), s.level]
        .filter(Boolean)
        .join("：")
      children.push(new Paragraph({ text: line, bullet: { level: 0 } }))
    }
  }
  if (doc.certificates?.length) {
    children.push(
      new Paragraph({
        text: lang === "zh-CN" ? "证书" : "Certificates",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 80 },
      }),
    )
    for (const c of doc.certificates) {
      children.push(
        new Paragraph({
          text: [c.name, c.issuer, c.date].filter(Boolean).join(" - "),
          bullet: { level: 0 },
        }),
      )
    }
  }
  for (const cs of doc.meta.cvfree.customSections || []) {
    if (cs.visible === false) continue
    children.push(
      new Paragraph({
        text: cs.title || (lang === "zh-CN" ? "自定义模块" : "Custom Section"),
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 80 },
      }),
    )
    for (const it of cs.items || []) {
      if (it.title)
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: [it.title, it.subtitle].filter(Boolean).join(" - "),
                bold: true,
              }),
            ],
          }),
        )
      if (it.date) children.push(new Paragraph({ text: it.date }))
      if (it.description) children.push(...textParas(it.description))
    }
  }

  const d = new Document({ sections: [{ properties: {}, children }] })
  const blob = await Packer.toBlob(d)
  const name =
    (doc.meta.cvfree.title || "resume").replace(/[\\/:*?"<>|]/g, "_") + ".docx"
  dl(blob, name)
}

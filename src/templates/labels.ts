import type { AppLanguage } from "@/lib/resume/schema"

const ZH_NAMES: Record<string, string> = {
  lisbon: "里斯本",
  oxford: "牛津",
  plain: "简洁",
  meridian: "子午线",
  ledger: "账目",
  swift: "迅捷",
  vector: "矢量",
  timeline: "时间轴",
  bold: "醒目",
  atlas: "图集",
  nordic: "北欧",
  summit: "峰会",
  horizon: "地平线",
  duo: "双栏",
}

const ZH_DESCS: Record<string, string> = {
  lisbon: "经典单栏，彩色分隔线，适合各类申请。",
  oxford: "传统衬线布局，居中页眉与边框标题。",
  plain: "无装饰样式，对 ATS 解析非常友好。",
  meridian: "彩色姓名、右侧照片与强调条标题。",
  ledger: "左侧标题栏、右侧内容的分栏标签布局。",
  swift: "醒目彩色姓名与紧凑联系方式网格。",
  vector: "大写彩色标题与高亮技能标签。",
  timeline: "左侧日期栏配合纵向时间线。",
  bold: "厚重姓名块与填充式标题标签，辨识度高。",
  atlas: "深色侧栏含照片与信息，结构清晰。",
  nordic: "浅色侧栏与大号姓名排版。",
  summit: "居中页眉与照片，两栏细分隔线布局。",
  horizon: "全宽彩色页眉横幅，右侧信息栏。",
  duo: "双色双栏布局，侧栏底色区分。",
}

export function getTemplateLabel(
  lang: AppLanguage,
  id: string,
  fallback: string,
) {
  if (lang !== "zh-CN") return fallback
  return ZH_NAMES[id] || fallback
}

export function getTemplateDescription(
  lang: AppLanguage,
  id: string,
  fallback: string,
) {
  if (lang !== "zh-CN") return fallback
  return ZH_DESCS[id] || fallback
}

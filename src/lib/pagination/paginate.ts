import type {
  PaginatedPage,
  PaginationOptions,
  PaginationResult,
} from "./types"

const DEFAULT_KEEP_TOGETHER = [
  ".cv-item",
  ".cv-contact-item",
  ".cv-skill-item",
  ".cv-language-item",
  ".cv-reference-item",
  "li",
]

const DEFAULT_KEEP_WITH_NEXT = [
  ".cv-section-title",
  ".cv-item-title",
  ".cv-item-heading",
  "h1",
  "h2",
  "h3",
  "h4",
]

const DEFAULT_SPLITTABLE = [
  ".cv-section",
  ".cv-section-body",
  ".cv-main",
  ".cv-side",
  ".cv-contact-stack",
  ".cv-item",
  ".cv-item-body",
  ".cv-item-main",
  ".cv-description",
  ".cv-summary",
  ".cv-text",
  ".cv-rich",
  ".cv-richtext",
  ".cv-markdown",
  "ul",
  "ol",
]

type Block = {
  el: HTMLElement
  top: number
  bottom: number
  height: number
  keepTogether: boolean
  keepWithNext: boolean
  splittable: boolean
}

function px(n: number) {
  return Number.isFinite(n) ? n : 0
}

function visible(el: HTMLElement) {
  const style = window.getComputedStyle(el)
  if (style.display === "none") return false
  if (el.getAttribute("aria-hidden") === "true") return false
  const rect = el.getBoundingClientRect()
  return rect.height > 0 || rect.width > 0
}

function matchesAny(el: HTMLElement, selectors: string[]) {
  return selectors.some((s) => {
    try {
      return el.matches(s)
    } catch {
      return false
    }
  })
}

function makeBlock(
  el: HTMLElement,
  containerTop: number,
  opts: Required<
    Pick<
      PaginationOptions,
      "keepTogetherSelectors" | "keepWithNextSelectors" | "splittableSelectors"
    >
  >,
): Block {
  const r = el.getBoundingClientRect()
  const top = px(r.top - containerTop)
  const bottom = px(r.bottom - containerTop)
  return {
    el,
    top,
    bottom,
    height: Math.max(0, bottom - top),
    keepTogether: matchesAny(el, opts.keepTogetherSelectors),
    keepWithNext: matchesAny(el, opts.keepWithNextSelectors),
    splittable: matchesAny(el, opts.splittableSelectors),
  }
}

function directChildren(el: HTMLElement) {
  return Array.from(el.children).filter(
    (n): n is HTMLElement => n instanceof HTMLElement && visible(n),
  )
}

function isManualBreakBefore(el: HTMLElement) {
  const v = el.getAttribute("data-page-break")
  return v === "before" || v === "always"
}

function isManualBreakAfter(el: HTMLElement) {
  const v = el.getAttribute("data-page-break")
  return v === "after" || v === "always"
}

function collectLineCandidates(el: HTMLElement, containerTop: number) {
  const out: number[] = []
  const textNodes: Text[] = []
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
  let node: Node | null = walker.nextNode()
  while (node) {
    if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
      textNodes.push(node as Text)
    }
    node = walker.nextNode()
  }
  if (textNodes.length === 0) return out

  const range = document.createRange()
  try {
    range.setStartBefore(textNodes[0])
    range.setEndAfter(textNodes[textNodes.length - 1])
    const rects = Array.from(range.getClientRects()).filter(
      (r) => r.height > 0 && r.width > 0,
    )
    // Widow/orphan control: avoid leaving a single line on either side.
    const minLinesOnEachSide = rects.length >= 4 ? 2 : 1
    for (let i = 0; i < rects.length; i++) {
      const isLast = i === rects.length - 1
      if (isLast) continue
      const linesBefore = i + 1
      const linesAfter = rects.length - linesBefore
      if (linesBefore < minLinesOnEachSide || linesAfter < minLinesOnEachSide) {
        continue
      }
      out.push(px(rects[i].bottom - containerTop))
    }
  } catch {
    // Ignore range errors on unusual DOM structures.
  } finally {
    range.detach?.()
  }
  return out
}

function shouldCollectLineCandidates(el: HTMLElement, block: Block) {
  if (block.height <= 0) return false
  const tag = el.tagName.toLowerCase()
  if (["p", "li", "h1", "h2", "h3", "h4", "h5", "h6"].includes(tag)) return true
  if (
    el.matches(".cv-item-title,.cv-item-sub,.cv-item-date,.cv-summary,.cv-text")
  ) {
    return true
  }
  // Leaf-ish text containers: no element children, but has text.
  if (el.childElementCount === 0 && el.textContent?.trim()) return true
  return false
}

function createPageRoot(contentWidth: number, contentHeight: number) {
  const root = document.createElement("div")
  root.style.width = `${contentWidth}px`
  root.style.height = `${contentHeight}px`
  root.style.overflow = "hidden"
  root.style.position = "relative"
  return root
}

function createContentSlice(
  source: HTMLElement,
  contentWidth: number,
  offsetY: number,
) {
  const wrapper = document.createElement("div")
  wrapper.style.width = `${contentWidth}px`
  wrapper.style.position = "relative"
  wrapper.style.transform = `translateY(${-offsetY}px)`
  wrapper.style.willChange = "transform"
  const clone = source.cloneNode(true) as HTMLElement
  clone.style.margin = "0"
  clone.style.width = "100%"
  clone.style.maxWidth = "100%"
  wrapper.appendChild(clone)
  return wrapper
}

function normalizeBreakpoints(
  breaks: number[],
  contentHeight: number,
  totalHeight: number,
) {
  const out: number[] = []
  const eps = 0.5
  const maxBreak = Math.max(0, totalHeight - 1)
  for (const b of breaks) {
    const clamped = Math.min(maxBreak, Math.max(0, b))
    const last = out[out.length - 1]
    if (last == null || clamped - last > eps) out.push(clamped)
  }
  // Ensure progress; if an oversized unbreakable segment exists, force page step.
  const forced: number[] = []
  let prev = 0
  for (const b of out) {
    let next = b
    if (next - prev < 1) next = prev + contentHeight
    while (next - prev > contentHeight + eps) {
      prev = prev + contentHeight
      forced.push(prev)
    }
    if (next > prev + eps) {
      forced.push(next)
      prev = next
    }
  }
  while (totalHeight - prev > contentHeight + eps) {
    prev = prev + contentHeight
    forced.push(prev)
  }
  return forced
}

function collectBreakCandidates(
  source: HTMLElement,
  containerTop: number,
  contentHeight: number,
  opts: Required<
    Pick<
      PaginationOptions,
      "keepTogetherSelectors" | "keepWithNextSelectors" | "splittableSelectors"
    >
  >,
) {
  const candidates = new Set<number>([0])

  const walk = (el: HTMLElement) => {
    const kids = directChildren(el)
    for (let i = 0; i < kids.length; i++) {
      const child = kids[i]
      const block = makeBlock(child, containerTop, opts)
      const next = kids[i + 1]
      const nextBlock = next ? makeBlock(next, containerTop, opts) : null

      // Prefer breaking before block boundaries.
      candidates.add(block.top)
      candidates.add(block.bottom)

      if (isManualBreakBefore(child)) {
        candidates.add(block.top)
      }
      if (isManualBreakAfter(child)) {
        candidates.add(block.bottom)
      }

      if (block.keepWithNext && nextBlock && !isManualBreakAfter(child)) {
        // Don't break between this element and next; remove boundary at next top.
        candidates.delete(nextBlock.top)
      }

      const keepWhole =
        block.keepTogether &&
        block.height <= contentHeight &&
        !isManualBreakBefore(child)

      // Collect line-level candidates for text-like blocks to avoid mid-line cuts.
      if (!keepWhole && shouldCollectLineCandidates(child, block)) {
        for (const lineBottom of collectLineCandidates(child, containerTop)) {
          if (lineBottom > block.top + 1 && lineBottom < block.bottom - 1) {
            candidates.add(lineBottom)
          }
        }
      }

      // If block fits on a page, avoid internal breaks by not descending into atomic blocks.
      if (keepWhole) {
        continue
      }

      // Descend into containers to find internal break candidates. Keep-whole
      // blocks are already skipped above.
      if (child.childElementCount > 0) {
        walk(child)
      }
    }
  }

  walk(source)

  const emergency = new Set<number>()

  // Global line pass: ensure line-level candidates exist even when container
  // traversal misses some structures.
  const all = source.querySelectorAll<HTMLElement>("*")
  for (const el of all) {
    if (!visible(el)) continue
    let insideKeepWhole = false
    let parent: HTMLElement | null = el.parentElement
    while (parent && parent !== source) {
      if (
        matchesAny(parent, opts.keepTogetherSelectors) &&
        px(parent.getBoundingClientRect().height) <= contentHeight
      ) {
        insideKeepWhole = true
        break
      }
      parent = parent.parentElement
    }

    const r = el.getBoundingClientRect()
    const block: Block = {
      el,
      top: px(r.top - containerTop),
      bottom: px(r.bottom - containerTop),
      height: Math.max(0, px(r.bottom - r.top)),
      keepTogether: matchesAny(el, opts.keepTogetherSelectors),
      keepWithNext: false,
      splittable: false,
    }
    if (!shouldCollectLineCandidates(el, block)) continue
    if (block.keepTogether && block.height <= contentHeight) continue
    for (const lineBottom of collectLineCandidates(el, containerTop)) {
      if (lineBottom > block.top + 1 && lineBottom < block.bottom - 1) {
        if (insideKeepWhole) emergency.add(lineBottom)
        else candidates.add(lineBottom)
      }
    }
  }

  const toList = (set: Set<number>) =>
    Array.from(set)
      .filter((n) => Number.isFinite(n) && n >= 0)
      .sort((a, b) => a - b)

  return { candidates: toList(candidates), emergency: toList(emergency) }
}

function pickBreaks(
  candidates: number[],
  contentHeight: number,
  totalHeight: number,
  emergency: number[] = [],
) {
  const breaks: number[] = []
  const eps = 1
  const safety = 2
  let cursor = 0

  const find = (limit: number) => {
    for (let i = candidates.length - 1; i >= 0; i--) {
      const c = candidates[i]
      if (c <= limit && c > cursor + eps) return c
    }
    for (let i = emergency.length - 1; i >= 0; i--) {
      const c = emergency[i]
      if (c <= limit && c > cursor + eps) return c
    }
    return -1
  }

  while (totalHeight - cursor > contentHeight + eps) {
    const limit = cursor + contentHeight
    let pick = find(limit - safety)
    if (pick <= cursor) pick = find(limit + eps)
    if (pick <= cursor) pick = limit
    breaks.push(pick)
    cursor = pick
  }

  return normalizeBreakpoints(breaks, contentHeight, totalHeight)
}

function getColumnOffsets(source: HTMLElement) {
  const cols = source.querySelector<HTMLElement>(".cv-cols")
  if (!cols) return null
  const main = cols.querySelector<HTMLElement>(":scope > .cv-main")
  const side = cols.querySelector<HTMLElement>(":scope > .cv-side")
  if (!main || !side) return null
  return { cols, main, side }
}

function collectColumnBreaks(
  col: HTMLElement,
  sourceTop: number,
  contentHeight: number,
  opts: Required<
    Pick<
      PaginationOptions,
      "keepTogetherSelectors" | "keepWithNextSelectors" | "splittableSelectors"
    >
  >,
) {
  const colRect = col.getBoundingClientRect()
  const colTop = px(colRect.top - sourceTop)
  const colBottom = px(colRect.bottom - sourceTop)
  const total = Math.max(0, colBottom - colTop)

  const { candidates, emergency } = collectBreakCandidates(
    col,
    colRect.top,
    contentHeight,
    opts,
  )
  const relCandidates = candidates.filter((c) => c >= 0 && c <= total + 1)
  const relEmergency = emergency.filter((c) => c >= 0 && c <= total + 1)
  if (relCandidates[0] !== 0) relCandidates.unshift(0)
  const breaks = pickBreaks(relCandidates, contentHeight, total, relEmergency)
  return { colTop, total, breaks }
}

function createTwoColumnSlice(
  source: HTMLElement,
  contentWidth: number,
  contentHeight: number,
  mainOffset: number,
  sideOffset: number,
) {
  const root = createPageRoot(contentWidth, contentHeight)
  const wrapper = document.createElement("div")
  wrapper.style.width = `${contentWidth}px`
  wrapper.style.height = `${contentHeight}px`
  wrapper.style.position = "relative"
  wrapper.style.overflow = "hidden"

  const clone = source.cloneNode(true) as HTMLElement
  clone.style.margin = "0"
  clone.style.width = "100%"
  clone.style.maxWidth = "100%"
  clone.style.height = `${contentHeight}px`
  clone.style.overflow = "hidden"
  clone.style.position = "relative"

  const cols = clone.querySelector<HTMLElement>(".cv-cols")
  if (cols) {
    cols.style.height = `${contentHeight}px`
    cols.style.overflow = "hidden"
    cols.style.position = "relative"
    cols.style.alignItems = "start"

    const main = cols.querySelector<HTMLElement>(":scope > .cv-main")
    const side = cols.querySelector<HTMLElement>(":scope > .cv-side")
    if (main) {
      main.style.transform = `translateY(${-mainOffset}px)`
      main.style.willChange = "transform"
    }
    if (side) {
      side.style.transform = `translateY(${-sideOffset}px)`
      side.style.willChange = "transform"
    }
  }

  wrapper.appendChild(clone)
  root.appendChild(wrapper)
  return root
}

export function paginateSource(
  source: HTMLElement,
  options: PaginationOptions,
): PaginationResult {
  const keepTogetherSelectors =
    options.keepTogetherSelectors ?? DEFAULT_KEEP_TOGETHER
  const keepWithNextSelectors =
    options.keepWithNextSelectors ?? DEFAULT_KEEP_WITH_NEXT
  const splittableSelectors = options.splittableSelectors ?? DEFAULT_SPLITTABLE

  const contentWidth = Math.max(
    0,
    options.page.width - options.margins.left - options.margins.right,
  )
  const contentHeight = Math.max(
    0,
    options.page.height - options.margins.top - options.margins.bottom,
  )

  if (contentWidth <= 0 || contentHeight <= 0) {
    return { pages: [], pageCount: 0 }
  }

  const sourceRect = source.getBoundingClientRect()
  const containerTop = sourceRect.top
  const children = directChildren(source)
  const lastChildBottom = children.reduce((max, child) => {
    const r = child.getBoundingClientRect()
    return Math.max(max, px(r.bottom - containerTop))
  }, 0)
  const totalHeight = Math.max(
    source.scrollHeight,
    Math.ceil(sourceRect.height),
    Math.ceil(lastChildBottom),
  )
  const opts = {
    keepTogetherSelectors,
    keepWithNextSelectors,
    splittableSelectors,
  }

  const columns = getColumnOffsets(source)
  if (columns) {
    const colsRect = columns.cols.getBoundingClientRect()
    const colTop = px(colsRect.top - containerTop)

    // Only use independent column pagination when columns start near the top of
    // the content area. Templates with headers above columns need a more complex
    // composition strategy; fall back to single-flow slicing for correctness.
    if (colTop < 8) {
      const mainInfo = collectColumnBreaks(
        columns.main,
        containerTop,
        contentHeight,
        opts,
      )
      const sideInfo = collectColumnBreaks(
        columns.side,
        containerTop,
        contentHeight,
        opts,
      )

      const mainStarts = [0, ...mainInfo.breaks]
      const sideStarts = [0, ...sideInfo.breaks]
      const pageCount = Math.max(mainStarts.length, sideStarts.length)
      const pages: PaginatedPage[] = []

      for (let i = 0; i < pageCount; i++) {
        const mainOffset =
          i < mainStarts.length ? mainStarts[i] : mainInfo.total
        const sideOffset =
          i < sideStarts.length ? sideStarts[i] : sideInfo.total
        const root = createTwoColumnSlice(
          source,
          contentWidth,
          contentHeight,
          mainOffset,
          sideOffset,
        )
        pages.push({ index: i, fragments: [{ html: root.outerHTML }] })
      }

      return { pages, pageCount }
    }
  }

  const { candidates, emergency } = collectBreakCandidates(
    source,
    containerTop,
    contentHeight,
    opts,
  )
  const breaks = pickBreaks(candidates, contentHeight, totalHeight, emergency)

  const pageStarts = [0, ...breaks]
  const pages: PaginatedPage[] = pageStarts.map((start, index) => {
    const nextStart = pageStarts[index + 1]
    const sliceHeight =
      nextStart != null
        ? Math.max(0, nextStart - start)
        : Math.max(0, Math.min(contentHeight, totalHeight - start))
    const root = createPageRoot(contentWidth, sliceHeight)
    const slice = createContentSlice(source, contentWidth, start)
    root.appendChild(slice)
    return {
      index,
      fragments: [{ html: root.outerHTML }],
    }
  })

  return { pages, pageCount: pages.length }
}

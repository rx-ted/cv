export type PageSize = {
  /** Page width in px. */
  width: number
  /** Page height in px. */
  height: number
}

export type PageMargins = {
  top: number
  right: number
  bottom: number
  left: number
}

export type PaginationOptions = {
  page: PageSize
  margins: PageMargins
  /** Gap between pages in preview, px. */
  gap?: number
  /** CSS selectors treated as atomic blocks that should not be split unless necessary. */
  keepTogetherSelectors?: string[]
  /** CSS selectors that should stay with the next sibling/block. */
  keepWithNextSelectors?: string[]
  /** Selectors whose direct children can be moved across pages. */
  splittableSelectors?: string[]
}

export type PageFragment = {
  /** Cloned HTML for this page slice. */
  html: string
}

export type PaginatedPage = {
  index: number
  fragments: PageFragment[]
}

export type PaginationResult = {
  pages: PaginatedPage[]
  pageCount: number
}

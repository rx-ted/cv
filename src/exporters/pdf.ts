import type { AppLanguage } from "@/lib/resume/schema"

export function exportPdf(_lang: AppLanguage) {
  // Wait for dropdown/menu close and scroll-lock cleanup before print capture.
  requestAnimationFrame(() => {
    setTimeout(() => {
      window.print()
    }, 200)
  })
}

"use client"

import { ResumeInput } from "@/components/ui/resume-input"
import { ResumeTextarea } from "@/components/ui/resume-textarea"

export function Field({
  label,
  value,
  onChange,
  textarea = false,
  rows = 3,
  placeholder,
  className,
  helperText,
  error,
  appearance = "outlined",
}: {
  label: string
  value: string
  onChange: (v: string) => void
  textarea?: boolean
  rows?: number
  placeholder?: string
  className?: string
  helperText?: string
  error?: string | boolean
  appearance?: "outlined" | "filled" | "borderless"
}) {
  if (textarea) {
    return (
      <ResumeTextarea
        label={label}
        value={value || ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        helperText={helperText}
        error={error}
        appearance={appearance}
        containerClassName={className}
      />
    )
  }
  return (
    <ResumeInput
      label={label}
      value={value || ""}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      helperText={helperText}
      error={error}
      appearance={appearance}
      containerClassName={className}
    />
  )
}

"use client"

import * as React from "react"
import { cn } from "cn"
import { Label } from "@/components/ui/label"

type ResumeFieldAppearance = "outlined" | "filled" | "borderless"

const appearanceClasses: Record<ResumeFieldAppearance, string> = {
  outlined:
    "border border-input bg-background dark:bg-input/30 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
  filled:
    "border border-transparent bg-muted/60 dark:bg-input/50 focus-visible:bg-background focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
  borderless:
    "border border-transparent bg-transparent rounded-none px-0 shadow-none focus-visible:ring-0 focus-visible:border-b-ring border-b border-b-transparent focus-visible:border-b",
}

export type ResumeTextareaProps = React.ComponentProps<"textarea"> & {
  label?: string
  helperText?: string
  error?: string | boolean
  appearance?: ResumeFieldAppearance
  containerClassName?: string
}

export function ResumeTextarea({
  label,
  helperText,
  error,
  appearance = "outlined",
  containerClassName,
  className,
  id: idProp,
  disabled,
  rows = 3,
  ...props
}: ResumeTextareaProps) {
  const generatedId = React.useId()
  const id = idProp || generatedId
  const errorMessage = typeof error === "string" ? error : undefined
  const hasError = !!error

  return (
    <div className={cn("space-y-1.5", containerClassName)}>
      {label ? (
        <Label htmlFor={id} className={cn("text-xs text-foreground/80", disabled && "opacity-50")}>
          {label}
        </Label>
      ) : null}
      <textarea
        id={id}
        disabled={disabled}
        rows={rows}
        aria-invalid={hasError || undefined}
        data-slot="resume-textarea"
        className={cn(
          "flex field-sizing-content min-h-16 w-full rounded-lg px-3 py-2 text-sm text-foreground transition-colors outline-none placeholder:text-muted-foreground",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          appearanceClasses[appearance],
          hasError && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
          className
        )}
        {...props}
      />
      {errorMessage ? (
        <p className="text-xs text-destructive">{errorMessage}</p>
      ) : helperText ? (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      ) : null}
    </div>
  )
}

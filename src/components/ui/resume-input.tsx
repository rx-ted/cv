"use client"

import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "cn"
import { Label } from "@/components/ui/label"

type ResumeFieldAppearance = "outlined" | "filled" | "borderless"
type ResumeFieldSize = "sm" | "md"

const appearanceClasses: Record<ResumeFieldAppearance, string> = {
  outlined:
    "border border-input bg-background dark:bg-input/30 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
  filled:
    "border border-transparent bg-muted/60 dark:bg-input/50 focus-visible:bg-background focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
  borderless:
    "border border-transparent bg-transparent rounded-none px-0 shadow-none focus-visible:ring-0 focus-visible:border-b-ring border-b border-b-transparent focus-visible:border-b",
}

const sizeClasses: Record<ResumeFieldSize, string> = {
  sm: "h-8 px-2.5 text-sm rounded-md",
  md: "h-9 px-3 text-sm rounded-lg",
}

export type ResumeInputProps = Omit<React.ComponentProps<"input">, "size"> & {
  label?: string
  helperText?: string
  error?: string | boolean
  appearance?: ResumeFieldAppearance
  inputSize?: ResumeFieldSize
  containerClassName?: string
}

export function ResumeInput({
  label,
  helperText,
  error,
  appearance = "outlined",
  inputSize = "md",
  containerClassName,
  className,
  id: idProp,
  disabled,
  ...props
}: ResumeInputProps) {
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
      <InputPrimitive
        id={id}
        disabled={disabled}
        aria-invalid={hasError || undefined}
        data-slot="resume-input"
        className={cn(
          "w-full min-w-0 text-foreground transition-colors outline-none placeholder:text-muted-foreground",
          "file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          sizeClasses[inputSize],
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

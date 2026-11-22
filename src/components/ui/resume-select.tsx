"use client"

import * as React from "react"
import { Select as SelectPrimitive } from "@base-ui/react/select"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"
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

export type ResumeSelectOption = {
  value: string
  label: React.ReactNode
  disabled?: boolean
}

export type ResumeSelectProps = {
  label?: string
  helperText?: string
  error?: string | boolean
  appearance?: ResumeFieldAppearance
  inputSize?: ResumeFieldSize
  placeholder?: string
  options: ResumeSelectOption[]
  value?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  containerClassName?: string
  className?: string
  id?: string
}

export function ResumeSelect({
  label,
  helperText,
  error,
  appearance = "outlined",
  inputSize = "md",
  placeholder,
  options,
  value,
  onValueChange,
  disabled,
  containerClassName,
  className,
  id: idProp,
}: ResumeSelectProps) {
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
      <SelectPrimitive.Root value={value} onValueChange={(v) => onValueChange?.(v ?? "")} disabled={disabled}>
        <SelectPrimitive.Trigger
          id={id}
          aria-invalid={hasError || undefined}
          data-slot="resume-select-trigger"
          className={cn(
            "flex w-full items-center justify-between gap-2 text-foreground transition-colors outline-none select-none",
            "data-placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
            "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
            sizeClasses[inputSize],
            appearanceClasses[appearance],
            hasError && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
            className
          )}
        >
          <SelectPrimitive.Value
            placeholder={placeholder}
            className="flex flex-1 text-left line-clamp-1"
          >
            {options.find((o) => o.value === value)?.label ?? placeholder ?? ""}
          </SelectPrimitive.Value>
          <SelectPrimitive.Icon render={<ChevronDownIcon className="size-4 text-muted-foreground" />} />
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Positioner side="bottom" sideOffset={4} align="start" alignItemWithTrigger={false} className="isolate z-50">
            <SelectPrimitive.Popup
              data-slot="resume-select-content"
              className="relative isolate z-50 max-h-(--available-height) min-w-(--anchor-width) origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
            >
              <SelectPrimitive.ScrollUpArrow className="top-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4">
                <ChevronUpIcon />
              </SelectPrimitive.ScrollUpArrow>
              <SelectPrimitive.List className="p-1">
                {options.map((opt) => (
                  <SelectPrimitive.Item
                    key={opt.value}
                    value={opt.value}
                    disabled={opt.disabled}
                    className="relative flex w-full cursor-default items-center gap-2 rounded-md py-1.5 pr-8 pl-2 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50"
                  >
                    <SelectPrimitive.ItemText className="flex-1">{opt.label}</SelectPrimitive.ItemText>
                    <SelectPrimitive.ItemIndicator render={<span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center" />}>
                      <CheckIcon className="pointer-events-none size-4" />
                    </SelectPrimitive.ItemIndicator>
                  </SelectPrimitive.Item>
                ))}
              </SelectPrimitive.List>
              <SelectPrimitive.ScrollDownArrow className="bottom-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4">
                <ChevronDownIcon />
              </SelectPrimitive.ScrollDownArrow>
            </SelectPrimitive.Popup>
          </SelectPrimitive.Positioner>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
      {errorMessage ? (
        <p className="text-xs text-destructive">{errorMessage}</p>
      ) : helperText ? (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      ) : null}
    </div>
  )
}

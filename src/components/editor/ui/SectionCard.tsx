"use client"

import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  Plus,
  Trash2,
} from "lucide-react"
import { type ReactNode, useRef, useState } from "react"
import { Button } from "@/components/ui/button"

export function SectionCard({
  id,
  title,
  visible,
  canToggle = true,
  onToggle,
  onAdd,
  addLabel,
  children,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  actions,
  count,
  hiddenLabel,
  dragHandle,
  onMoveUp,
  onMoveDown,
  canMoveUp = false,
  canMoveDown = false,
  onDeleteModule,
  moveUpLabel = "Move up",
  moveDownLabel = "Move down",
  deleteModuleLabel = "Delete module",
  showLabel = "Show",
  hideLabelAction = "Hide",
}: {
  id?: string
  title: string
  visible: boolean
  canToggle?: boolean
  onToggle?: () => void
  onAdd?: () => void
  addLabel?: string
  children: ReactNode
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  actions?: ReactNode
  count?: number
  hiddenLabel?: string
  dragHandle?: ReactNode
  onMoveUp?: () => void
  onMoveDown?: () => void
  canMoveUp?: boolean
  canMoveDown?: boolean
  onDeleteModule?: () => void
  moveUpLabel?: string
  moveDownLabel?: string
  deleteModuleLabel?: string
  showLabel?: string
  hideLabelAction?: string
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
  const rootRef = useRef<HTMLDivElement>(null)
  const open = controlledOpen ?? uncontrolledOpen
  const setOpen = (next: boolean) => {
    if (onOpenChange) onOpenChange(next)
    else setUncontrolledOpen(next)
    if (next) {
      requestAnimationFrame(() =>
        rootRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        }),
      )
    }
  }

  return (
    <div
      ref={rootRef}
      id={id}
      className="border rounded-lg bg-card scroll-mt-3"
    >
      <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/40 gap-2">
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          {dragHandle}
          <button
            type="button"
            className="flex items-center gap-1.5 min-w-0 text-left flex-1"
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
            )}
            <span className="font-medium text-sm truncate">{title}</span>
            {typeof count === "number" && (
              <span className="text-xs text-muted-foreground shrink-0">
                ({count})
              </span>
            )}
            {!visible && canToggle && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground shrink-0">
                {hiddenLabel || "Hidden"}
              </span>
            )}
          </button>
        </div>
        <div className="flex items-center gap-0.5 shrink-0">
          {actions}
          {onMoveUp && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={onMoveUp}
              disabled={!canMoveUp}
              title={moveUpLabel}
            >
              <ArrowUp className="w-4 h-4" />
            </Button>
          )}
          {onMoveDown && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={onMoveDown}
              disabled={!canMoveDown}
              title={moveDownLabel}
            >
              <ArrowDown className="w-4 h-4" />
            </Button>
          )}
          {canToggle && onToggle && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={onToggle}
              title={visible ? hideLabelAction : showLabel}
            >
              {visible ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4 text-muted-foreground" />
              )}
            </Button>
          )}
          {onDeleteModule && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-red-600"
              onClick={onDeleteModule}
              title={deleteModuleLabel}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
          {onAdd && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={onAdd}
              title={addLabel || "Add"}
            >
              <Plus className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
      {open && (
        <div
          className={`p-3 space-y-3 ${!visible && canToggle ? "opacity-60" : ""}`}
        >
          {children}
        </div>
      )}
    </div>
  )
}

"use client"

import { GripVertical, Trash2 } from "lucide-react"
import type { ReactNode } from "react"
import { SortableItem, SortableItemHandle } from "@/components/reui/sortable"

export function ItemCard({
  id,
  onDelete,
  children,
}: {
  id: string
  onDelete: () => void
  children: ReactNode
}) {
  return (
    <SortableItem value={id} className="border rounded-md p-3 bg-card">
      <div className="flex gap-2 items-start">
        <SortableItemHandle className="mt-1.5 text-muted-foreground hover:text-foreground shrink-0 cursor-grab active:cursor-grabbing">
          <GripVertical className="w-4 h-4" />
        </SortableItemHandle>
        <div className="flex-1 space-y-2 min-w-0 pr-6 relative">
          <button
            type="button"
            onClick={onDelete}
            className="absolute top-0 right-0 text-muted-foreground hover:text-red-600"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          {children}
        </div>
      </div>
    </SortableItem>
  )
}

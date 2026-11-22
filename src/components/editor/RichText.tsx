"use client"

import TextAlign from "@tiptap/extension-text-align"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  List,
  ListOrdered,
  Redo,
  Undo,
} from "lucide-react"
import { useEffect } from "react"

function ToolBtn({
  on,
  active,
  children,
  title,
}: {
  on: () => void
  active: boolean
  children: React.ReactNode
  title: string
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={on}
      className={`p-1 rounded ${active ? "bg-accent" : "hover:bg-accent/60"}`}
    >
      {children}
    </button>
  )
}

export function RichText({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (html: string) => void
  placeholder?: string
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: false }),
      TextAlign.configure({ types: ["paragraph"] }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[90px] p-2 focus:outline-none text-sm",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange(html === "<p></p>" ? "" : html)
    },
  })

  useEffect(() => {
    if (!editor) return
    const current = editor.getHTML()
    const next = value || ""
    if (current !== next && !(current === "<p></p>" && next === "")) {
      editor.commands.setContent(next, { emitUpdate: false })
    }
  }, [value, editor])

  if (!editor)
    return (
      <div className="border rounded min-h-[90px] p-2 text-sm text-muted-foreground">
        {placeholder}
      </div>
    )

  return (
    <div className="border rounded-md bg-card">
      <div className="flex flex-wrap gap-1 p-1 border-b bg-muted/40">
        <ToolBtn
          title="Bold"
          on={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
        >
          <Bold className="w-4 h-4" />
        </ToolBtn>
        <ToolBtn
          title="Italic"
          on={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
        >
          <Italic className="w-4 h-4" />
        </ToolBtn>
        <ToolBtn
          title="Bullet"
          on={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
        >
          <List className="w-4 h-4" />
        </ToolBtn>
        <ToolBtn
          title="Ordered"
          on={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
        >
          <ListOrdered className="w-4 h-4" />
        </ToolBtn>
        <ToolBtn
          title="Left"
          on={() => editor.chain().focus().setTextAlign("left").run()}
          active={editor.isActive({ textAlign: "left" })}
        >
          <AlignLeft className="w-4 h-4" />
        </ToolBtn>
        <ToolBtn
          title="Center"
          on={() => editor.chain().focus().setTextAlign("center").run()}
          active={editor.isActive({ textAlign: "center" })}
        >
          <AlignCenter className="w-4 h-4" />
        </ToolBtn>
        <ToolBtn
          title="Right"
          on={() => editor.chain().focus().setTextAlign("right").run()}
          active={editor.isActive({ textAlign: "right" })}
        >
          <AlignRight className="w-4 h-4" />
        </ToolBtn>
        <ToolBtn
          title="Undo"
          on={() => editor.chain().focus().undo().run()}
          active={false}
        >
          <Undo className="w-4 h-4" />
        </ToolBtn>
        <ToolBtn
          title="Redo"
          on={() => editor.chain().focus().redo().run()}
          active={false}
        >
          <Redo className="w-4 h-4" />
        </ToolBtn>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}

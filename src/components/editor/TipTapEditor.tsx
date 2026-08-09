"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { useCallback } from "react";

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export function TipTapEditor({ content, onChange }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] p-4",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const addImage = useCallback(() => {
    const url = window.prompt("URL Image:");
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes("link").href;
    const url = window.prompt("URL:", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="bg-bg border-b border-border p-2 flex flex-wrap gap-1 items-center sticky top-0 z-10">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2 rounded hover:bg-surface ${editor.isActive("bold") ? "bg-surface text-primary" : "text-text-secondary"}`}>
          <span className="material-icons-outlined text-sm">format_bold</span>
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-2 rounded hover:bg-surface ${editor.isActive("italic") ? "bg-surface text-primary" : "text-text-secondary"}`}>
          <span className="material-icons-outlined text-sm">format_italic</span>
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={`p-2 rounded hover:bg-surface ${editor.isActive("underline") ? "bg-surface text-primary" : "text-text-secondary"}`}>
          <span className="material-icons-outlined text-sm">format_underlined</span>
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={`p-2 rounded hover:bg-surface ${editor.isActive("strike") ? "bg-surface text-primary" : "text-text-secondary"}`}>
          <span className="material-icons-outlined text-sm">format_strikethrough</span>
        </button>
        <div className="w-px h-6 bg-border mx-1"></div>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-2 rounded hover:bg-surface ${editor.isActive("heading", { level: 2 }) ? "bg-surface text-primary font-bold" : "text-text-secondary"}`}>
          H2
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`p-2 rounded hover:bg-surface ${editor.isActive("heading", { level: 3 }) ? "bg-surface text-primary font-bold" : "text-text-secondary"}`}>
          H3
        </button>
        <div className="w-px h-6 bg-border mx-1"></div>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign("left").run()} className={`p-2 rounded hover:bg-surface ${editor.isActive({ textAlign: "left" }) ? "bg-surface text-primary" : "text-text-secondary"}`}>
          <span className="material-icons-outlined text-sm">format_align_left</span>
        </button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign("center").run()} className={`p-2 rounded hover:bg-surface ${editor.isActive({ textAlign: "center" }) ? "bg-surface text-primary" : "text-text-secondary"}`}>
          <span className="material-icons-outlined text-sm">format_align_center</span>
        </button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign("right").run()} className={`p-2 rounded hover:bg-surface ${editor.isActive({ textAlign: "right" }) ? "bg-surface text-primary" : "text-text-secondary"}`}>
          <span className="material-icons-outlined text-sm">format_align_right</span>
        </button>
        <div className="w-px h-6 bg-border mx-1"></div>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-2 rounded hover:bg-surface ${editor.isActive("bulletList") ? "bg-surface text-primary" : "text-text-secondary"}`}>
          <span className="material-icons-outlined text-sm">format_list_bulleted</span>
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-2 rounded hover:bg-surface ${editor.isActive("orderedList") ? "bg-surface text-primary" : "text-text-secondary"}`}>
          <span className="material-icons-outlined text-sm">format_list_numbered</span>
        </button>
        <div className="w-px h-6 bg-border mx-1"></div>
        <button type="button" onClick={setLink} className={`p-2 rounded hover:bg-surface ${editor.isActive("link") ? "bg-surface text-primary" : "text-text-secondary"}`}>
          <span className="material-icons-outlined text-sm">link</span>
        </button>
        <button type="button" onClick={addImage} className="p-2 rounded hover:bg-surface text-text-secondary">
          <span className="material-icons-outlined text-sm">image</span>
        </button>
      </div>

      <EditorContent editor={editor} className="prose-wrapper min-h-[400px] cursor-text p-4" onClick={() => editor.commands.focus()} />
    </div>
  );
}

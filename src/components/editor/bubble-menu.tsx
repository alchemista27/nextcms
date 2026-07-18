import { Editor } from "@tiptap/react";
import { BubbleMenu as TiptapBubbleMenu } from "@tiptap/react/menus";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import LinkIcon from "@mui/icons-material/Link";
import { useCallback } from "react";
import { clsx } from "clsx";

interface BubbleMenuProps {
  editor: Editor | null;
}

export function BubbleMenu({ editor }: BubbleMenuProps) {
  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <TiptapBubbleMenu
      editor={editor}
      tippyOptions={{ duration: 100 }}
      className="flex items-center space-x-1 bg-gray-900 shadow-lg border border-gray-700 rounded-lg p-1"
    >
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={clsx(
          "p-1.5 rounded transition-colors text-white hover:bg-gray-700",
          editor.isActive("bold") && "bg-gray-700 text-[#00704A]"
        )}
      >
        <FormatBoldIcon fontSize="small" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={clsx(
          "p-1.5 rounded transition-colors text-white hover:bg-gray-700",
          editor.isActive("italic") && "bg-gray-700 text-[#00704A]"
        )}
      >
        <FormatItalicIcon fontSize="small" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={clsx(
          "p-1.5 rounded transition-colors text-white hover:bg-gray-700",
          editor.isActive("underline") && "bg-gray-700 text-[#00704A]"
        )}
      >
        <FormatUnderlinedIcon fontSize="small" />
      </button>
      <div className="w-px h-5 bg-gray-700 mx-1" />
      <button
        onClick={setLink}
        className={clsx(
          "p-1.5 rounded transition-colors text-white hover:bg-gray-700",
          editor.isActive("link") && "bg-gray-700 text-[#00704A]"
        )}
      >
        <LinkIcon fontSize="small" />
      </button>
    </TiptapBubbleMenu>
  );
}

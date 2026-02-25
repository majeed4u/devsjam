import { useState } from "react";
import { Editor, useEditorState } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcn,
  Strikethrough,
  Code,
  SquareCode,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link2,
  Image as ImgIcon,
  Heading1,
  Heading2,
  Heading3,
} from "lucide-react";
import { Toggle } from "@/components/ui/toggle";

export const EditorMenubar = ({ editor }: { editor: Editor | null }) => {
  // ✅ useEditorState must be called unconditionally
  const editorState = useEditorState({
    editor,
    selector: ({ editor }) => ({
      bold: editor?.isActive("bold") ?? false,
      italic: editor?.isActive("italic") ?? false,
      underline: editor?.isActive("underline") ?? false,
      strike: editor?.isActive("strike") ?? false,
      code: editor?.isActive("code") ?? false,
      codeBlock: editor?.isActive("codeBlock") ?? false,
      highlight: editor?.isActive("highlight") ?? false,

      h1: editor?.isActive("heading", { level: 1 }) ?? false,
      h2: editor?.isActive("heading", { level: 2 }) ?? false,
      h3: editor?.isActive("heading", { level: 3 }) ?? false,

      left: editor?.isActive({ textAlign: "left" }) ?? false,
      center: editor?.isActive({ textAlign: "center" }) ?? false,
      right: editor?.isActive({ textAlign: "right" }) ?? false,
      justify: editor?.isActive({ textAlign: "justify" }) ?? false,

      bulletList: editor?.isActive("bulletList") ?? false,
      orderedList: editor?.isActive("orderedList") ?? false,
      blockquote: editor?.isActive("blockquote") ?? false,
      link: editor?.isActive("link") ?? false,
      image: false, // image doesn’t have active state
      undo: false,
      redo: false,
    }),
  });

  const [file, setFile] = useState<string>("");
  if (!editor || !editorState) return null;

  const addImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      if (input.files && input.files[0]) {
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          editor.chain().focus().setImage({ src: base64 }).run();
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const setLink = () => {
    const url = window.prompt("Enter link URL");
    if (url)
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
  };

  const buttonLinks = [
    {
      key: "bold",
      icon: Bold,
      action: () => editor.chain().focus().toggleBold().run(),
      title: "Bold",
    },
    {
      key: "italic",
      icon: Italic,
      action: () => editor.chain().focus().toggleItalic().run(),
      title: "Italic",
    },
    {
      key: "underline",
      icon: UnderlineIcn,
      action: () => editor.chain().focus().toggleUnderline().run(),
      title: "Underline",
    },
    {
      key: "strike",
      icon: Strikethrough,
      action: () => editor.chain().focus().toggleStrike().run(),
      title: "Strikethrough",
    },
    {
      key: "code",
      icon: Code,
      action: () => editor.chain().focus().toggleCode().run(),
      title: "Inline Code",
    },
    {
      key: "codeBlock",
      icon: SquareCode,
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      title: "Code Block",
    },
    {
      key: "highlight",
      icon: Highlighter,
      action: () => editor.chain().focus().toggleHighlight().run(),
      title: "Highlight",
    },

    {
      key: "h1",
      icon: Heading1,
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      title: "Heading 1",
    },
    {
      key: "h2",
      icon: Heading2,
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      title: "Heading 2",
    },
    {
      key: "h3",
      icon: Heading3,
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      title: "Heading 3",
    },

    {
      key: "left",
      icon: AlignLeft,
      action: () => editor.chain().focus().setTextAlign("left").run(),
      title: "Align Left",
    },
    {
      key: "center",
      icon: AlignCenter,
      action: () => editor.chain().focus().setTextAlign("center").run(),
      title: "Align Center",
    },
    {
      key: "right",
      icon: AlignRight,
      action: () => editor.chain().focus().setTextAlign("right").run(),
      title: "Align Right",
    },
    {
      key: "justify",
      icon: AlignJustify,
      action: () => editor.chain().focus().setTextAlign("justify").run(),
      title: "Align Justify",
    },

    {
      key: "bulletList",
      icon: List,
      action: () => editor.chain().focus().toggleBulletList().run(),
      title: "Bullet List",
    },
    {
      key: "orderedList",
      icon: ListOrdered,
      action: () => editor.chain().focus().toggleOrderedList().run(),
      title: "Ordered List",
    },
    {
      key: "blockquote",
      icon: Quote,
      action: () => editor.chain().focus().toggleBlockquote().run(),
      title: "Blockquote",
    },

    {
      key: "undo",
      icon: Undo,
      action: () => editor.chain().focus().undo().run(),
      title: "Undo",
    },
    {
      key: "redo",
      icon: Redo,
      action: () => editor.chain().focus().redo().run(),
      title: "Redo",
    },

    { key: "link", icon: Link2, action: setLink, title: "Add Link" },
    { key: "image", icon: ImgIcon, action: addImage, title: "Add Image" },
  ];

  return (
    <div className="flex flex-wrap gap-1 border rounded-t-md p-1">
      <div className="flex gap-x-1 gap-y-2 flex-wrap items-center">
        {buttonLinks.map(({ key, icon: Icon, action, title }) => (
          <Toggle
            key={key}
            onPressedChange={action}
            pressed={editorState[key as keyof typeof editorState]}
            title={title}
          >
            <Icon size={16} />
          </Toggle>
        ))}
      </div>
    </div>
  );
};

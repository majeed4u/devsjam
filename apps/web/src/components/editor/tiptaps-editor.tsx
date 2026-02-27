import Blockquote from "@tiptap/extension-blockquote";
import Color from "@tiptap/extension-color";
import HighLight from "@tiptap/extension-highlight";
import ImageEditor from "@tiptap/extension-image";
import LinkEditor from "@tiptap/extension-link";
import { BulletList, ListItem, OrderedList } from "@tiptap/extension-list";
import { TaskItem } from "@tiptap/extension-task-item";
import { TaskList } from "@tiptap/extension-task-list";
import TextStyle from "@tiptap/extension-text";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { CharacterCount } from "@tiptap/extensions";
import {
  type DocumentType,
  EditorContent,
  useEditor,
  useEditorState,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { EditorMenubar } from "./editor-menubar";

interface TipTapsEditorProps {
  content?: string | DocumentType;
  onChange?: (content: string) => void;
  limit?: number;
}
export const TipTapsEditor = ({
  content,
  onChange,
  limit = 1000,
}: TipTapsEditorProps) => {
  const prevContentRef = useRef<string | DocumentType | undefined>(content);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      CharacterCount.configure({
        limit,
      }),
      Blockquote.configure({
        HTMLAttributes: {
          class: "border-l-4 pl-4 italic text-gray-600",
        },
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: "list-disc ml-6",
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: "list-decimal ml-6",
        },
      }),
      ListItem.configure({
        HTMLAttributes: {
          class: "ml-2",
        },
      }),

      Underline,
      LinkEditor.configure({
        openOnClick: false,
        HTMLAttributes: {
          class:
            "text-blue-600 underline hover:text-blue-800 visited:text-purple-600",
        },
      }),
      ImageEditor.configure({
        HTMLAttributes: {
          class: "rounded-md",
        },
      }),
      HighLight.configure({
        multicolor: false,
      }),
      TextStyle,
      Color,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (editor.isEmpty) {
        onChange?.("");
      } else {
        onChange?.(html);
      }
    },
    content: content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "min-h-56 prose prose-invert focus:outline-none  px-2 py-1 rounded-sm text-white",
      },
    },
  });
  const editorState = useEditorState({
    editor,
    selector: (context) => ({
      charactersCount: context.editor?.storage.characterCount.characters(),
      html: context.editor?.getHTML(),
    }),
  });

  // Reset editor content when form resets or content changes
  useEffect(() => {
    if (!editor) return;

    const isEmpty =
      !content ||
      content === "" ||
      (typeof content === "string" && content.trim() === "");
    const wasEmpty =
      !prevContentRef.current ||
      prevContentRef.current === "" ||
      (typeof prevContentRef.current === "string" &&
        prevContentRef.current.trim() === "");

    // Reset if content became empty (form reset scenario)
    if (isEmpty && !wasEmpty) {
      editor.commands.setContent("");
    }
    // Update content if it changed to a non-empty value
    else if (!isEmpty && content !== prevContentRef.current) {
      editor.commands.setContent(content, false);
    }

    prevContentRef.current = content;
  }, [content, editor]);

  const charactersCount = editorState?.charactersCount ?? 0;

  if (!editor) return null;

  return (
    <div className="h-full">
      <div className="space-y-1 rounded-md py-2">
        <EditorMenubar editor={editor} />
        <EditorContent className="rounded-b-md border" editor={editor} />
        <div
          className={`character-count ${charactersCount === limit ? "character-count--warning" : ""}`}
        >
          <div className="flex items-center gap-x-1">
            <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">
              {charactersCount}
            </Badge>
            /
            <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">
              {limit}
            </Badge>
            <span className="text-primary text-sm"> characters</span>
          </div>
        </div>
      </div>
    </div>
  );
};

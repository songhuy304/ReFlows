import { EditorContent } from "@tiptap/react";
import { useRichTextEditorContext } from "./rte-context";
import type { RichTextEditorContentProps } from "./types";
import { cn } from "@/lib/utils";

export function Content({ children, className }: RichTextEditorContentProps) {
  const { editor } = useRichTextEditorContext();

  return (
    <div className="relative">
      <EditorContent
        editor={editor}
        className={cn("rte-content w-full bg-transparent dark:bg-input/30", className)}
      />
      {children}
    </div>
  );
}

"use client";

import { useState, useCallback } from "react";
import { Node, nodeInputRule } from "@tiptap/core";
import { ReactNodeViewRenderer, useEditorState, type NodeViewProps } from "@tiptap/react";
import { useRichTextEditorContext } from "../rte-context";
import { RichTextEditorControl } from "../controls/rte-control";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { ResizableNodeView } from "../extensions/resizable-node-view";
import { Input } from "@/components/ui/input";

function getYouTubeId(url: string): string | null {
  const clean = url.trim();
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
    /(?:m\.youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = clean.match(pattern);
    if (match) return match[1] ?? null;
  }
  return /^[a-zA-Z0-9_-]{11}$/.test(clean) ? clean : null;
}

function YouTubeNodeView(props: NodeViewProps) {
  const { node } = props;
  const videoId = getYouTubeId(node.attrs.src) || node.attrs.src;

  return (
    <ResizableNodeView
      {...props}
      lockAspect
      aspectRatio={16 / 9}
      minWidth={320}
      maxWidth={1200}
    >
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="YouTube video"
        className="rte-embed-iframe"
      />
    </ResizableNodeView>
  );
}

export const YouTubeEmbed = Node.create({
  name: "youtube",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: (el: HTMLElement) => el.getAttribute("data-src"),
        renderHTML: (attrs: Record<string, unknown>) => ({
          "data-src": attrs.src,
        }),
      },
      width: {
        default: 560,
        parseHTML: (el: HTMLElement) =>
          el.getAttribute("data-width") ? Number(el.getAttribute("data-width")) : 560,
        renderHTML: (attrs: Record<string, unknown>) => ({
          "data-width": attrs.width,
        }),
      },
      height: {
        default: 315,
        parseHTML: (el: HTMLElement) =>
          el.getAttribute("data-height") ? Number(el.getAttribute("data-height")) : 315,
        renderHTML: (attrs: Record<string, unknown>) => ({
          "data-height": attrs.height,
        }),
      },
      align: {
        default: "center",
        parseHTML: (el: HTMLElement) => el.getAttribute("data-align") || "center",
        renderHTML: (attrs: Record<string, unknown>) => ({
          "data-align": attrs.align,
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="youtube"]' }];
  },

  renderHTML({ node }: { node: { attrs: Record<string, unknown> } }) {
    return [
      "div",
      {
        "data-type": "youtube",
        "data-src": node.attrs.src,
        "data-width": node.attrs.width,
        "data-height": node.attrs.height,
        "data-align": node.attrs.align,
      },
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(YouTubeNodeView) as any;
  },

  addCommands() {
    return {
      setYouTubeEmbed:
        (src: string) =>
        ({ commands }: { commands: any }) => {
          return commands.insertContent({
            type: "youtube",
            attrs: { src },
          });
        },
    } as any;
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: /https?:\/\/(?:www\.|m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|shorts\/|live\/|v\/)?([a-zA-Z0-9_-]{11})/,
        type: this.type,
        getAttributes: (match: RegExpMatchArray) => ({ src: match[0] }),
      }),
    ];
  },
});

export function YouTubeEmbedControl({ className }: { className?: string }) {
  const { editor } = useRichTextEditorContext();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");

  const { active } = useEditorState({
    editor: editor ?? null,
    selector: (ctx) => ({
      active:
        ctx.editor && !ctx.editor.isDestroyed ? ctx.editor.isActive("youtube") : false,
    }),
  }) ?? { active: false };

  const handleInsert = useCallback(() => {
    if (url && editor) {
      (editor as any).chain().focus().setYouTubeEmbed(url).run();
      setUrl("");
    }
  }, [url, editor]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <RichTextEditorControl
          active={active}
          className={className}
          title="Embed YouTube video"
          aria-label="Embed YouTube video"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="rte-editor-icon"
          >
            <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6a3 3 0 0 0-2.1 2.1C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8z" />
            <path d="M9.5 15.5V8.5l6.2 3.5z" />
          </svg>
        </RichTextEditorControl>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Embed YouTube video</DialogTitle>
          <DialogDescription>Paste a YouTube video URL or ID.</DialogDescription>
        </DialogHeader>
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://youtube.com/watch?v=..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && url) {
              handleInsert();
              setOpen(false);
            }
          }}
        />
        <DialogFooter>
          <DialogClose>Cancel</DialogClose>
          <DialogClose
            disabled={!url}
            className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            onClick={handleInsert}
          >
            Insert
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

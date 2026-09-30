"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Node, nodeInputRule } from "@tiptap/core";
import { ReactNodeViewRenderer, useEditorState, type NodeViewProps } from "@tiptap/react";
import { useRichTextEditorContext } from "../rte-context";
import { RichTextEditorControl } from "../controls/rte-control";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ResizableNodeView } from "../extensions/resizable-node-view";
import { Input } from "@/components/ui/input";

const WIDGET_SCRIPT_URL = "https://platform.twitter.com/widgets.js";

function TwitterNodeView(props: NodeViewProps) {
  const { node } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const tweetId = node.attrs.tweetId;
  const w = node.attrs.width as number | undefined;
  const h = node.attrs.height as number | undefined;

  const renderTweet = useCallback(() => {
    if (!containerRef.current || !tweetId) return;
    containerRef.current.innerHTML = "";
    setLoading(true);
    const twttr = (window as any).twttr;
    if (twttr?.widgets) {
      twttr.widgets.createTweet(tweetId, containerRef.current).then(() => {
        setLoading(false);
      });
    }
  }, [tweetId]);

  useEffect(() => {
    if (!containerRef.current || !tweetId) return;

    if ((window as any).twttr?.widgets) {
      renderTweet();
    } else {
      const script = document.createElement("script");
      script.src = WIDGET_SCRIPT_URL;
      script.async = true;
      script.onload = renderTweet;
      document.body.appendChild(script);
    }
  }, [tweetId, w, h, renderTweet]);

  return (
    <ResizableNodeView {...props} lockAspect={false} minWidth={300} maxWidth={1200}>
      {loading && <div className="rte-embed-loading">Loading tweet...</div>}
      <div ref={containerRef} />
    </ResizableNodeView>
  );
}

export const TwitterEmbed = Node.create({
  name: "twitter",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      tweetId: {
        default: null,
        parseHTML: (el: HTMLElement) => el.getAttribute("data-tweet-id"),
        renderHTML: (attrs: Record<string, unknown>) => ({
          "data-tweet-id": attrs.tweetId,
        }),
      },
      width: {
        default: 550,
        parseHTML: (el: HTMLElement) =>
          el.getAttribute("data-width") ? Number(el.getAttribute("data-width")) : 550,
        renderHTML: (attrs: Record<string, unknown>) => ({
          "data-width": attrs.width,
        }),
      },
      height: {
        default: 400,
        parseHTML: (el: HTMLElement) =>
          el.getAttribute("data-height") ? Number(el.getAttribute("data-height")) : 400,
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
    return [{ tag: 'div[data-type="twitter"]' }];
  },

  renderHTML({ node }: { node: { attrs: Record<string, unknown> } }) {
    return [
      "div",
      {
        "data-type": "twitter",
        "data-tweet-id": node.attrs.tweetId,
        "data-width": node.attrs.width,
        "data-height": node.attrs.height,
        "data-align": node.attrs.align,
      },
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TwitterNodeView) as any;
  },

  addCommands() {
    return {
      setTwitterEmbed:
        (tweetId: string) =>
        ({ commands }: { commands: any }) => {
          return commands.insertContent({
            type: "twitter",
            attrs: { tweetId },
          });
        },
    } as any;
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: /https?:\/\/(?:www\.)?(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/,
        type: this.type,
        getAttributes: (match: RegExpMatchArray) => ({ tweetId: match[1] }),
      }),
    ];
  },
});

function extractTweetId(input: string): string | null {
  const clean = input.trim();
  const match = clean.match(
    /(?:twitter\.com|x\.com)\/(?:\w+\/status\/|i\/web\/status\/)(\d+)/
  );
  return match ? (match[1] ?? null) : /^\d+$/.test(clean) ? clean : null;
}

export function TwitterEmbedControl({ className }: { className?: string }) {
  const { editor } = useRichTextEditorContext();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");

  const { active } = useEditorState({
    editor: editor ?? null,
    selector: (ctx) => ({
      active:
        ctx.editor && !ctx.editor.isDestroyed ? ctx.editor.isActive("twitter") : false,
    }),
  }) ?? { active: false };

  const handleInsert = useCallback(() => {
    if (url && editor) {
      const tweetId = extractTweetId(url);
      if (tweetId) {
        (editor as any).chain().focus().setTwitterEmbed(tweetId).run();
        setUrl("");
      }
    }
  }, [url, editor]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <RichTextEditorControl
          active={active}
          className={className}
          title="Embed Tweet"
          aria-label="Embed Tweet"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="rte-editor-icon"
          >
            <path d="M18.2 3.2h3.3l-7.2 8.2 8.5 11.2h-6.6l-5.2-6.8-6 6.8H2.7l7.7-8.8L2.3 3.2h6.8l4.7 6.2 5.4-6.2zm-1.2 17.3h1.8L7 4.8H5.1l11.9 15.7z" />
          </svg>
        </RichTextEditorControl>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Embed Tweet</DialogTitle>
          <DialogDescription>Paste a tweet URL or ID.</DialogDescription>
        </DialogHeader>
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://x.com/user/status/..."
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

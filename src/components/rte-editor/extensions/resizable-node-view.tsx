"use client";

import { useCallback, useRef, useEffect } from "react";
import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react";

interface ResizableNodeViewProps extends NodeViewProps {
  children: React.ReactNode;
  lockAspect?: boolean;
  aspectRatio?: number;
  minWidth?: number;
  maxWidth?: number;
}

export function ResizableNodeView({
  node,
  selected,
  updateAttributes,
  view,
  children,
  lockAspect = false,
  aspectRatio = 16 / 9,
  minWidth = 300,
  maxWidth = 1200,
}: ResizableNodeViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const resizingRef = useRef<{
    direction: "right" | "bottom" | "corner";
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
    editorWidth: number;
  } | null>(null);

  const width = node.attrs.width as number | undefined;
  const height = node.attrs.height as number | undefined;
  const align = (node.attrs.align as string) || "center";

  const getEditorWidth = useCallback(() => {
    return view?.dom?.parentElement?.offsetWidth ?? 0;
  }, [view]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, direction: "right" | "bottom" | "corner") => {
      e.preventDefault();
      e.stopPropagation();

      const editorWidth = getEditorWidth();
      const startWidth = containerRef.current?.offsetWidth ?? width ?? Math.min(560, editorWidth);
      const startHeight = containerRef.current?.offsetHeight ?? height ?? 315;

      resizingRef.current = {
        direction,
        startX: e.clientX,
        startY: e.clientY,
        startWidth,
        startHeight,
        editorWidth,
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor =
        direction === "right"
          ? "ew-resize"
          : direction === "bottom"
            ? "ns-resize"
            : "nwse-resize";
      document.body.style.userSelect = "none";
    },
    [width, height, getEditorWidth],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const resize = resizingRef.current;
      if (!resize) return;

      const effectiveMax = Math.min(maxWidth, resize.editorWidth);

      let newWidth = resize.startWidth;
      let newHeight = resize.startHeight;

      if (resize.direction === "right" || resize.direction === "corner") {
        newWidth = Math.max(
          minWidth,
          Math.min(effectiveMax, resize.startWidth + (e.clientX - resize.startX)),
        );
      }

      if (resize.direction === "bottom" || resize.direction === "corner") {
        newHeight = Math.max(
          Math.round(minWidth / aspectRatio),
          Math.min(
            Math.round(effectiveMax / aspectRatio),
            resize.startHeight + (e.clientY - resize.startY),
          ),
        );
      }

      if (lockAspect) {
        if (resize.direction === "right" || resize.direction === "corner") {
          newHeight = Math.round(newWidth / aspectRatio);
        } else {
          newWidth = Math.round(newHeight * aspectRatio);
        }
      }

      if (containerRef.current) {
        containerRef.current.style.width = `${newWidth}px`;
        containerRef.current.style.height = `${newHeight}px`;
      }
    },
    [lockAspect, aspectRatio, minWidth, maxWidth],
  );

  const handleMouseUp = useCallback(() => {
    const resize = resizingRef.current;
    if (!resize) return;

    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";

    if (containerRef.current) {
      const w = containerRef.current.offsetWidth;
      const h = containerRef.current.offsetHeight;
      updateAttributes({ width: w, height: h });
    }

    resizingRef.current = null;
  }, [handleMouseMove, updateAttributes]);

  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [handleMouseMove]);

  return (
    <NodeViewWrapper
      className="rte-embed-wrapper"
      data-selected={selected || undefined}
      data-align={align}
    >
      <div
        ref={containerRef}
        className="rte-embed"
        contentEditable={false}
        style={{
          width: width ? `${width}px` : "100%",
          height: height ? `${height}px` : "auto",
          minWidth: `${minWidth}px`,
        }}
      >
        {children}
        {selected && (
          <>
            <div
              className="rte-resize-handle rte-resize-handle--right"
              onMouseDown={(e) => handleMouseDown(e, "right")}
            />
            <div
              className="rte-resize-handle rte-resize-handle--bottom"
              onMouseDown={(e) => handleMouseDown(e, "bottom")}
            />
            <div
              className="rte-resize-handle rte-resize-handle--corner"
              onMouseDown={(e) => handleMouseDown(e, "corner")}
            />
          </>
        )}
      </div>
    </NodeViewWrapper>
  );
}

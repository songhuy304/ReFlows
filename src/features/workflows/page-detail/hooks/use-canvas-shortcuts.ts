"use client";

import { useEffect, useRef } from "react";
import { AUTO_LAYOUT_ACTION, CANVAS_MODES, type CanvasMode } from "../constants/canvas-modes";
import { SHAPES, type ShapeType } from "../constants/shapes";

interface CanvasShortcutHandlers {
  onModeChange: (mode: CanvasMode) => void;
  onAddShape: (shape: ShapeType) => void;
  onAutoLayout: () => void;
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  );
}

export function useCanvasShortcuts(handlers: CanvasShortcutHandlers): void {
  const handlersRef = useRef(handlers);

  useEffect(() => {
    handlersRef.current = handlers;
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.repeat) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (isTypingTarget(event.target)) return;

      const key = event.key.toUpperCase();

      const mode = CANVAS_MODES.find((item) => item.shortcut === key);
      if (mode) {
        event.preventDefault();
        handlersRef.current.onModeChange(mode.mode);
        return;
      }

      if (key === AUTO_LAYOUT_ACTION.shortcut) {
        event.preventDefault();
        handlersRef.current.onAutoLayout();
        return;
      }

      const shape = SHAPES.find((item) => item.shortcut === key);
      if (shape) {
        event.preventDefault();
        handlersRef.current.onAddShape(shape.type);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
}

"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";

interface EditableLabelProps {
  value: string;
  onCommit: (value: string) => void;
  onCancel: () => void;
  allowEmpty?: boolean;
  placeholder?: string;
  className?: string;
}

function EditableLabel({
  value,
  onCommit,
  onCancel,
  allowEmpty = false,
  placeholder,
  className,
}: EditableLabelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const commit = () => {
    const next = draft.trim();
    if (next || allowEmpty) {
      onCommit(next);
    } else {
      onCancel();
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") commit();
    if (event.key === "Escape") onCancel();
  };

  return (
    <input
      ref={inputRef}
      aria-label="Label"
      value={draft}
      placeholder={placeholder}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={commit}
      onKeyDown={handleKeyDown}
      className={cn(
        "nodrag w-fit bg-transparent text-center text-sm outline-none",
        className
      )}
    />
  );
}

export { EditableLabel };

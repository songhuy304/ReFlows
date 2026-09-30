"use client";

import * as React from "react";
import { useStore } from "@tanstack/react-form";

import { FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  useFieldContext,
  FormField,
  FormFieldError,
  FormFieldSet,
  createFormField,
} from "@/components/ui/form-context";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";

interface TagsFieldProps {
  label?: React.ReactNode;
  description?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

export function TagsField({
  label,
  description,
  required,
  placeholder = "Type and press Enter...",
  className,
}: TagsFieldProps) {
  const field = useFieldContext();

  const values = (useStore(field.store, (s) => s.value) as string[]) ?? [];
  const isTouched = useStore(field.store, (s) => s.meta.isTouched);
  const isValid = useStore(field.store, (s) => s.meta.isValid);
  const hasError = isTouched && !isValid;

  const [tagInput, setTagInput] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !values.includes(tag)) {
      field.handleChange([...values, tag]);
      setTagInput("");
    }
  };

  const removeTag = (idx: number) => {
    field.handleChange(values.filter((_, i) => i !== idx));
  };

  return (
    <FormFieldSet>
      <FormField>
        {label && (
          <FieldLabel htmlFor={field.name}>
            {label}
            {required && <span className="text-red-500">*</span>}
          </FieldLabel>
        )}

        <div
          className={cn(
            "flex flex-wrap items-center gap-1.5 rounded-md border bg-transparent px-3 py-1.5 dark:bg-input/30 h-9",
            "focus-within:ring-1 focus-within:ring-ring",
            hasError
              ? "border-destructive focus-within:ring-destructive"
              : "border-input",
            className
          )}
          onClick={() => inputRef.current?.focus()}
        >
          {values.map((tag, idx) => (
            <Badge key={tag} variant="secondary" className="h-5 gap-1 text-[11px]">
              {tag}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(idx);
                }}
                className="hover:text-destructive ml-0.5"
              >
                <Icons.close className="h-3 w-3" />
              </button>
            </Badge>
          ))}

          <input
            ref={inputRef}
            id={field.name}
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              } else if (e.key === "Backspace" && tagInput === "" && values.length > 0) {
                removeTag(values.length - 1);
              }
            }}
            onBlur={field.handleBlur}
            aria-invalid={hasError}
            placeholder={values.length === 0 ? placeholder : ""}
            className="min-w-20 flex-1 border-none bg-transparent p-0 text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        {description && <FieldDescription>{description}</FieldDescription>}
      </FormField>

      <FormFieldError />
    </FormFieldSet>
  );
}

export const FormTagsField = createFormField(TagsField);

"use client";

import * as React from "react";
import { useStore } from "@tanstack/react-form";
import { TagInput, type Tag } from "emblor";

import { FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  useFieldContext,
  FormField,
  FormFieldError,
  FormFieldSet,
  createFormField,
} from "@/components/ui/form-context";
import { cn } from "@/lib/utils";

interface TagInputFieldProps {
  label?: React.ReactNode;
  description?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

export function TagInputField({
  label,
  description,
  required,
  placeholder,
  className,
}: TagInputFieldProps) {
  const field = useFieldContext();

  const value = useStore(field.store, (s) => s.value) as Tag[];
  const isTouched = useStore(field.store, (s) => s.meta.isTouched);
  const isValid = useStore(field.store, (s) => s.meta.isValid);

  const [activeTagIndex, setActiveTagIndex] = React.useState<number | null>(null);
  const hasError = isTouched && !isValid;
  return (
    <FormFieldSet>
      <FormField>
        {label && (
          <FieldLabel htmlFor={field.name}>
            {label}
            {required && <span className="text-red-500">*</span>}
          </FieldLabel>
        )}

        <TagInput
          id={field.name}
          styleClasses={{
            input: "border-none shadow-none p-0",
            inlineTagsContainer: cn(
              "border rounded-md bg-transparent dark:bg-input/30 px-3",
              hasError
                ? "border-destructive focus-within:ring-1 focus-within:ring-destructive"
                : "border-input"
            ),
            tag: {
              body: "h-5 text-[10px] bg-muted",
            },
          }}
          size={"sm"}
          animation={"fadeIn"}
          tags={value ?? []}
          placeholder={placeholder}
          className={cn(className)}
          activeTagIndex={activeTagIndex}
          setActiveTagIndex={setActiveTagIndex}
          setTags={(tags) => field.handleChange(tags)}
          onBlur={field.handleBlur}
          aria-invalid={isTouched && !isValid}
        />

        {description && <FieldDescription>{description}</FieldDescription>}
      </FormField>

      <FormFieldError />
    </FormFieldSet>
  );
}

export const FormTagInputField = createFormField(TagInputField);

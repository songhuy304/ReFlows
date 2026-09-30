"use client";

import { useStore } from "@tanstack/react-form";

import { FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  createFormField,
  FormField,
  FormFieldError,
  FormFieldSet,
  useFieldContext,
} from "@/components/ui/form-context";
import { TextEditor } from "@/components/rte-editor/text-editor";

interface TextEditorFieldProps {
  label?: React.ReactNode;
  description?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

export function TextEditorField({
  label,
  description,
  required,
  placeholder = "Start typing...",
  disabled,
}: TextEditorFieldProps) {
  const field = useFieldContext();

  const value = useStore(field.store, (s) => s.value as string | undefined);
  const isTouched = useStore(field.store, (s) => s.meta.isTouched);
  const isValid = useStore(field.store, (s) => s.meta.isValid);

  return (
    <FormFieldSet>
      <FormField>
        {label && (
          <FieldLabel htmlFor={field.name}>
            {label}
            {required && <span className="text-red-500"> *</span>}
          </FieldLabel>
        )}

        <TextEditor
          value={value ?? ""}
          placeholder={placeholder}
          disabled={disabled}
          onChange={field.handleChange}
        />

        {description && <FieldDescription>{description}</FieldDescription>}
      </FormField>

      {isTouched && !isValid && <FormFieldError />}
    </FormFieldSet>
  );
}

export const FormTextEditorField = createFormField(TextEditorField);

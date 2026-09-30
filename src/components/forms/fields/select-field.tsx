"use client";

import { useStore } from "@tanstack/react-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  useFieldContext,
  FormFieldSet,
  FormField,
  FormFieldError,
  createFormField,
} from "@/components/ui/form-context";
import { cn } from "@/lib/utils";

export type Option = { value: string; label: React.ReactNode };

interface SelectFieldProps {
  label?: React.ReactNode;
  description?: string;
  required?: boolean;
  options: Option[];
  placeholder?: string;
  className?: string;
}

export function SelectField({
  label,
  description,
  required,
  options,
  placeholder = "Select an option",
  className,
}: SelectFieldProps) {
  const field = useFieldContext();
  const isTouched = useStore(field.store, (s) => s.meta.isTouched);
  const isValid = useStore(field.store, (s) => s.meta.isValid);
  const value = useStore(field.store, (s) => s.value) as string;

  return (
    <FormFieldSet className={cn("min-w-48", className)}>
      <FormField>
        {label && (
          <FieldLabel htmlFor={field.name}>
            {label}
            {required && <span className="text-red-500"> *</span>}
          </FieldLabel>
        )}
        <Select
          value={value ?? ""}
          onValueChange={field.handleChange}
          onOpenChange={(open) => {
            if (!open) field.handleBlur();
          }}
        >
          <SelectTrigger id={field.name} aria-invalid={isTouched && !isValid}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {description && <FieldDescription>{description}</FieldDescription>}
      </FormField>
      <FormFieldError />
    </FormFieldSet>
  );
}

export const FormSelectField = createFormField(SelectField);

"use client";

import { useStore } from "@tanstack/react-form";
import { Input, InputCustomProps } from "@/components/ui/input";
import { FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  useFieldContext,
  FormFieldSet,
  FormField,
  FormFieldError,
  createFormField,
} from "@/components/ui/form-context";
import { Spinner } from "@/components/ui/spinner";
import { InputPassword } from "@/components/ui/input-password";

interface TextFieldProps
  extends
    InputCustomProps,
    Omit<React.ComponentProps<"input">, "value" | "onChange" | "onBlur"> {
  label?: React.ReactNode;
  description?: string;
  required?: boolean;
  type?: "text" | "email" | "password" | "tel" | "url" | "number";
}

export function TextField({
  label,
  description,
  required,
  type = "text",
  className,
  leftIcon,
  rightIcon,
  ...inputProps
}: TextFieldProps) {
  const field = useFieldContext();
  const isTouched = useStore(field.store, (s) => s.meta.isTouched);
  const isValid = useStore(field.store, (s) => s.meta.isValid);
  const isValidating = useStore(field.store, (s) => s.meta.isValidating);
  const value = useStore(field.store, (s) => s.value) as string | number;

  const isPassword = type === "password";
  const Component = isPassword ? InputPassword : Input;

  return (
    <FormFieldSet>
      <FormField>
        {label && (
          <FieldLabel htmlFor={field.name}>
            {label}
            {required && <span className="text-red-500"> *</span>}
          </FieldLabel>
        )}
        <div className="relative">
          <Component
            id={field.name}
            type={type}
            value={value ?? ""}
            onBlur={field.handleBlur}
            onChange={(e) => {
              if (type === "number") {
                const v = e.target.value;
                field.handleChange(v === "" ? "" : parseFloat(v));
              } else {
                field.handleChange(e.target.value);
              }
            }}
            aria-invalid={isTouched && !isValid}
            className={className}
            leftIcon={leftIcon}
            rightIcon={rightIcon}
            {...inputProps}
          />
          {isValidating && (
            <div className="absolute top-1/2 right-3 -translate-y-1/2">
              <Spinner className="h-4 w-4" />
            </div>
          )}
        </div>
        {description && <FieldDescription>{description}</FieldDescription>}
      </FormField>
      <FormFieldError />
    </FormFieldSet>
  );
}

export const FormTextField = createFormField(TextField);

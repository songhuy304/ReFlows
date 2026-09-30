"use client";

import { useStore } from "@tanstack/react-form";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  FormField,
  FormFieldError,
  FormFieldSet,
  useFieldContext,
  createFormField,
} from "@/components/ui/form-context";

interface DateRangePickerFieldProps {
  label?: React.ReactNode;
  description?: string;
  required?: boolean;
  placeholder?: string;
}

export function DateRangePickerField({
  label,
  description,
  required,
  placeholder = "Pick a date range",
}: DateRangePickerFieldProps) {
  const field = useFieldContext();

  const value = useStore(field.store, (s) => s.value) as DateRange | undefined;

  const isTouched = useStore(field.store, (s) => s.meta.isTouched);
  const isValid = useStore(field.store, (s) => s.meta.isValid);

  return (
    <FormFieldSet className="min-w-72">
      <FormField>
        {label && (
          <FieldLabel htmlFor={field.name}>
            {label}
            {required && <span className="text-red-500">*</span>}
          </FieldLabel>
        )}

        <Popover>
          <PopoverTrigger asChild>
            <Button
              id={field.name}
              type="button"
              variant="outline"
              aria-invalid={isTouched && !isValid}
              className={cn(
                "w-full justify-start text-left font-normal",
                !value?.from && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />

              {value?.from ? (
                value.to ? (
                  <>
                    {format(value.from, "dd/MM/yyyy")} - {format(value.to, "dd/MM/yyyy")}
                  </>
                ) : (
                  format(value.from, "dd/MM/yyyy")
                )
              ) : (
                placeholder
              )}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={value}
              onSelect={(range) => field.handleChange(range)}
              numberOfMonths={2}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {description && <FieldDescription>{description}</FieldDescription>}

        <FormFieldError />
      </FormField>
    </FormFieldSet>
  );
}

export const FormDateRangePickerField = createFormField(DateRangePickerField);

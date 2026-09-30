"use client";

import * as React from "react";
import { useStore } from "@tanstack/react-form";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { cn } from "@/lib/utils";
import { FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  createFormField,
  FormField,
  FormFieldError,
  FormFieldSet,
  useFieldContext,
} from "@/components/ui/form-context";
import { Icons } from "@/components/icons";

export type Option = {
  value: string;
  label: React.ReactNode;
  searchValue?: string;
};

interface ComboboxFieldProps {
  label?: React.ReactNode;
  description?: string;
  required?: boolean;
  options: Option[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  multiple?: boolean;
}

export function ComboboxField({
  label,
  description,
  required,
  options,
  placeholder = "Select an option",
  searchPlaceholder = "Search...",
  emptyText = "No data found.",
  multiple = false,
}: ComboboxFieldProps) {
  const field = useFieldContext();

  const value = useStore(field.store, (s) => s.value) as string | string[] | undefined;

  const isTouched = useStore(field.store, (s) => s.meta.isTouched);
  const isValid = useStore(field.store, (s) => s.meta.isValid);

  const [open, setOpen] = React.useState(false);

  const values = React.useMemo(() => {
    if (Array.isArray(value)) return value;
    if (value) return [value];
    return [];
  }, [value]);

  const selected = React.useMemo(
    () => options.filter((item) => values.includes(item.value)),
    [options, values]
  );

  const handleSelect = (selectedValue: string) => {
    if (!multiple) {
      field.handleChange(selectedValue);
      setOpen(false);
      return;
    }

    if (values.includes(selectedValue)) {
      field.handleChange(values.filter((v) => v !== selectedValue));
    } else {
      field.handleChange([...values, selectedValue]);
    }
  };

  const renderValue = () => {
    if (selected.length === 0) {
      return <span className="text-muted-foreground">{placeholder}</span>;
    }

    if (!multiple) {
      return selected[0].label;
    }

    return (
      <div className="flex min-w-0 gap-1 overflow-hidden">
        {selected.map((item) => (
          <span
            key={item.value}
            className="bg-muted shrink-0 rounded-md px-2 py-0.5 text-xs"
          >
            {item.label}
          </span>
        ))}
      </div>
    );
  };

  return (
    <FormFieldSet className="min-w-48">
      <FormField>
        {label && (
          <FieldLabel htmlFor={field.name}>
            {label}
            {required && <span className="text-red-500">*</span>}
          </FieldLabel>
        )}

        <Popover
          open={open}
          onOpenChange={(nextOpen) => {
            setOpen(nextOpen);

            if (!nextOpen) {
              field.handleBlur();
            }
          }}
        >
          <div className="relative">
            <PopoverTrigger asChild>
              <Button
                id={field.name}
                type="button"
                variant="outline"
                role="combobox"
                aria-expanded={open}
                aria-invalid={isTouched && !isValid}
                className="w-full pr-10 justify-between font-normal border aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive!"
              >
                <div className="flex min-w-0 flex-1 items-center">
                  <span className="max-w-50 truncate">{renderValue()}</span>
                </div>
              </Button>
            </PopoverTrigger>
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              onClick={() => field.handleChange(multiple ? [] : undefined)}
            >
              {selected.length > 0 ? (
                <Icons.circleX className="size-4 shrink-0 opacity-50" />
              ) : (
                <Icons.chevronDown className="size-4 shrink-0 opacity-50" />
              )}
            </button>
          </div>

          <PopoverContent align="start" className="w-[--radix-popover-trigger-width] p-0">
            <Command>
              <CommandInput placeholder={searchPlaceholder} />

              <CommandList>
                <CommandEmpty>{emptyText}</CommandEmpty>

                <CommandGroup>
                  {options.map((option) => {
                    const checked = values.includes(option.value);

                    return (
                      <CommandItem
                        key={option.value}
                        value={option.searchValue ?? option.value}
                        onSelect={() => handleSelect(option.value)}
                      >
                        <Icons.check
                          className={cn(
                            "mr-2 h-4 w-4",
                            checked ? "opacity-100" : "opacity-0"
                          )}
                        />

                        {option.label}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {description && <FieldDescription>{description}</FieldDescription>}
      </FormField>

      <FormFieldError />
    </FormFieldSet>
  );
}

export const FormComboboxField = createFormField(ComboboxField);

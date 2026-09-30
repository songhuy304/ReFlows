import { ComponentProps } from "react";
import {
  FormCheckboxField,
  FormComboboxField,
  FormDatePickerField,
  FormDateRangePickerField,
  FormSelectField,
  FormTextField,
} from "../fields";

type CheckboxProps = ComponentProps<typeof FormCheckboxField>;
type TextFieldProps = ComponentProps<typeof FormTextField>;
type SelectFieldProps = ComponentProps<typeof FormSelectField>;
type MultiSelectFieldProps = ComponentProps<typeof FormComboboxField>;
type DatePickerFieldProps = ComponentProps<typeof FormDatePickerField>;
type DateRangePickerFieldProps = ComponentProps<typeof FormDateRangePickerField>;

export interface FieldPropsMap {
  text: TextFieldProps;
  multiSelect: MultiSelectFieldProps;
  select: SelectFieldProps;
  date: DatePickerFieldProps;
  dateRange: DateRangePickerFieldProps;
  checkbox: CheckboxProps;
}

export type FilterFieldType = keyof FieldPropsMap;

export type FilterFieldConfig<T extends Record<string, any> = any> = {
  [K in FilterFieldType]: {
    type: K;
    name: keyof T & string;
  } & FieldPropsMap[K];
}[FilterFieldType];

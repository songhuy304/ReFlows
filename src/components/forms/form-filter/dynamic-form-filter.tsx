import { Button } from "@/components/ui/button";
import { useAppForm, useFormFields } from "@/components/ui/tanstack-form";
import { FilterFieldConfig } from "./form-filter.type";
import { Icons } from "@/components/icons";
import { FormComboboxField, FormDateRangePickerField } from "../fields";
import { useTranslations } from "next-intl";

const triggerSubmitDebounceMs = 600;

interface FormFilterProps<T extends Record<string, any>> {
  fields: FilterFieldConfig[];
  defaultValues?: Partial<T>;
  onSubmit: (values: T) => void;
  onReset?: () => void;
  className?: string;
  layout?: "horizontal" | "vertical";
}
const FormFilter = <T extends Record<string, any>>(props: FormFilterProps<T>) => {
  const t = useTranslations();
  const {
    fields,
    defaultValues,
    onSubmit,
    onReset,
    className,
    layout = "horizontal",
  } = props;
  const form = useAppForm({
    defaultValues,
    onSubmit: ({ value }) => {
      onSubmit(value as T);
    },
  });

  const { FormTextField, FormSelectField, FormDatePickerField, FormCheckboxField } =
    useFormFields<T>();

  const renderField = (field: FilterFieldConfig<T>) => {
    switch (field.type) {
      case "text": {
        const { name, type, ...rest } = field;
        return (
          <FormTextField
            listeners={{
              onChangeDebounceMs: triggerSubmitDebounceMs,
              onChange: triggerSubmit,
            }}
            key={name}
            name={name}
            {...rest}
          />
        );
      }

      case "select": {
        const { name, type, ...rest } = field;
        return (
          <FormSelectField
            listeners={{
              onChange: triggerSubmit,
              onBlurDebounceMs: triggerSubmitDebounceMs,
            }}
            key={name}
            name={name}
            {...rest}
          />
        );
      }

      case "multiSelect": {
        const { name, type, ...rest } = field;
        return (
          <FormComboboxField
            listeners={{
              onChange: triggerSubmit,
              onChangeDebounceMs: triggerSubmitDebounceMs,
            }}
            key={name}
            name={name}
            {...rest}
          />
        );
      }

      case "date": {
        const { name, type, ...rest } = field;
        return (
          <FormDatePickerField
            listeners={{
              onChange: triggerSubmit,
            }}
            key={name}
            name={name}
            {...rest}
          />
        );
      }

      case "dateRange": {
        const { name, type, ...rest } = field;
        return (
          <FormDateRangePickerField
            listeners={{
              onChangeDebounceMs: triggerSubmitDebounceMs,
              onChange: triggerSubmit,
            }}
            key={name}
            name={name}
            {...rest}
          />
        );
      }

      case "checkbox": {
        const { name, type, ...rest } = field;
        return (
          <FormCheckboxField
            listeners={{
              onChange: triggerSubmit,
            }}
            key={name}
            name={name}
            {...rest}
          />
        );
      }

      default: {
        const _exhaustive: never = field;
        return null;
      }
    }
  };

  const handleReset = () => {
    // const values = form.state.values;
    onReset?.();
    form.reset();
  };

  const triggerSubmit = () => {
    form.handleSubmit();
  };

  return (
    <form.AppForm>
      <form.Form className={className}>
        <div className="flex flex-wrap items-end gap-4">
          {fields.map(renderField)}

          {/* <div className="ml-auto flex gap-2"> */}
          {/* <Button type="submit">Apply</Button> */}

          <Button
            type="button"
            variant="outline"
            className="border-dashed"
            onClick={handleReset}
          >
            <Icons.arrowBack />
            {t("Common.reset")}
          </Button>
          {/* </div> */}
        </div>
      </form.Form>
    </form.AppForm>
  );
};

export { FormFilter };

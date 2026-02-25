import CreatableSelect from "react-select/creatable";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Controller, type UseFormReturn } from "react-hook-form";
import { useState, useEffect } from "react";

type SelectOption = {
  readonly label: string;
  readonly value: string;
};

interface FormCreatableSelectProps {
  form: UseFormReturn<any>;
  label?: string;
  options: SelectOption[];
  name: string;
  isMulti?: boolean;
  isLoading?: boolean;
  onCreate?: (inputValue: string) => Promise<SelectOption>;
  placeholder?: string;
}

export const FormCreatableSelect = ({
  options: initialOptions,
  name,
  form,
  label,
  isMulti = false,
  isLoading: externalLoading,
  onCreate,
  placeholder,
}: FormCreatableSelectProps) => {
  const [options, setOptions] = useState<SelectOption[]>(initialOptions);
  const [value, setValue] = useState<SelectOption | SelectOption[] | null>(
    isMulti ? [] : null,
  );
  const [isLoading, setIsLoading] = useState(false);

  // sync options when query data loads
  useEffect(() => {
    setOptions(initialOptions);
  }, [initialOptions]);

  // reset local value when form resets
  useEffect(() => {
    const subscription = form.watch((formValues) => {
      const fieldValue = formValues[name];
      const isEmpty =
        fieldValue === undefined ||
        fieldValue === null ||
        fieldValue === "" ||
        (Array.isArray(fieldValue) && fieldValue.length === 0);
      if (isEmpty) {
        setValue(isMulti ? [] : null);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, name, isMulti]);

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => {
        const handleCreate = async (inputValue: string) => {
          setIsLoading(true);
          try {
            const newOption = onCreate
              ? await onCreate(inputValue)
              : { label: inputValue, value: inputValue };

            setOptions((prev) => [...prev, newOption]);

            if (isMulti) {
              const updated = [...(value as SelectOption[]), newOption];
              setValue(updated);
              field.onChange(updated.map((o) => o.value));
            } else {
              setValue(newOption);
              field.onChange(newOption.value);
            }
          } catch (error) {
            console.error("Failed to create option:", error);
          } finally {
            setIsLoading(false);
          }
        };

        return (
          <Field data-invalid={fieldState.invalid}>
            <FieldContent>
              <FieldLabel htmlFor={`form-rhf-select-${name}`}>
                {label}
              </FieldLabel>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </FieldContent>
            <CreatableSelect
              inputId={`form-rhf-select-${name}`}
              isMulti={isMulti}
              isClearable
              isDisabled={isLoading}
              isLoading={isLoading || externalLoading}
              options={options}
              placeholder={placeholder}
              value={value}
              onChange={(selected) => {
                if (isMulti) {
                  const arr = (selected as SelectOption[]) ?? [];
                  setValue(arr);
                  field.onChange(arr.map((o) => o.value));
                } else {
                  const single = selected as SelectOption | null;
                  setValue(single);
                  field.onChange(single?.value ?? null);
                }
              }}
              onCreateOption={handleCreate}
              unstyled
              classNames={{
                control: ({ isFocused }) =>
                  `border rounded-md px-3 py-1.5 text-sm cursor-pointer transition-colors bg-background text-foreground ${isFocused ? "border-ring ring-1 ring-ring" : "border-input"}`,
                menu: () =>
                  "mt-1 border border-input rounded-md shadow-md bg-background text-foreground z-50",
                menuList: () => "p-1",
                option: ({ isFocused, isSelected }) =>
                  `px-3 py-2 text-sm rounded-sm cursor-pointer transition-colors ${isSelected ? "bg-primary text-primary-foreground" : ""} ${isFocused && !isSelected ? "bg-accent text-accent-foreground" : ""}`,
                placeholder: () => "text-muted-foreground text-sm",
                input: () => "text-foreground text-sm",
                singleValue: () => "text-foreground text-sm",
                multiValue: () =>
                  "bg-accent text-accent-foreground rounded-md px-1 text-sm flex items-center gap-1 mr-1",
                multiValueLabel: () => "text-accent-foreground text-sm",
                multiValueRemove: () =>
                  "text-muted-foreground hover:text-foreground rounded-sm ml-1",
                clearIndicator: () =>
                  "text-muted-foreground hover:text-foreground cursor-pointer px-1",
                dropdownIndicator: () =>
                  "text-muted-foreground hover:text-foreground cursor-pointer px-1",
                indicatorSeparator: () => "bg-border mx-1",
                noOptionsMessage: () =>
                  "text-muted-foreground text-sm py-2 text-center",
                loadingMessage: () =>
                  "text-muted-foreground text-sm py-2 text-center",
              }}
            />
          </Field>
        );
      }}
    />
  );
};

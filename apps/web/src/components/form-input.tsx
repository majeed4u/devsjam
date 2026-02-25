import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Controller, type UseFormReturn } from "react-hook-form";
interface ModuleFormInputProps {
  form: UseFormReturn<any>;
  label: string;
  name: string;
  type?: string;
}

export const FormInput = ({
  form,
  label,
  name,
  type,
}: ModuleFormInputProps) => {
  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={`form-rhf-demo-${name}`}>{label}</FieldLabel>
          <Input
            {...field}
            id={`form-rhf-demo-${name}`}
            aria-invalid={fieldState.invalid}
            placeholder={label}
            autoComplete="off"
            type={type}
            value={field.value ?? ""}
            onChange={(e) => {
              const value = e.target.value;
              if (type === "number") {
                field.onChange(value === "" ? undefined : Number(value));
              } else {
                field.onChange(value);
              }
            }}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

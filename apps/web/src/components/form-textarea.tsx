import { Controller, type UseFormReturn } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

interface CourseFormInputProps {
	form: UseFormReturn<any>;
	label: string;
	name: string;
}

export const FormTextarea = ({ form, label, name }: CourseFormInputProps) => {
	return (
		<Controller
			name={name}
			control={form.control}
			render={({ field, fieldState }) => (
				<Field data-invalid={fieldState.invalid}>
					<FieldLabel htmlFor={`form-rhf-demo-${name}`}>{label}</FieldLabel>
					<Textarea
						{...field}
						id={`form-rhf-demo-${name}`}
						aria-invalid={fieldState.invalid}
						placeholder={label}
						autoComplete="off"
					/>
					{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
				</Field>
			)}
		/>
	);
};

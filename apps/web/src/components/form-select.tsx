import { Controller, type UseFormReturn } from "react-hook-form";
import {
	Field,
	FieldContent,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

type FormSelectProps = {
	label: string;
	value: string;
};
interface ModuleFormSelectProps {
	form: UseFormReturn<any>;
	label?: string;
	items: FormSelectProps[];
	name: string;
}

export const FormSelect = ({
	items,
	name,
	form,
	label,
}: ModuleFormSelectProps) => {
	return (
		<Controller
			name={name}
			control={form.control}
			render={({ field, fieldState }) => (
				<Field data-invalid={fieldState.invalid}>
					<FieldContent>
						<FieldLabel htmlFor={`form-rhf-select-${name}`}>{label}</FieldLabel>
						{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
					</FieldContent>
					<Select
						name={field.name}
						value={field.value}
						onValueChange={field.onChange}
					>
						<SelectTrigger
							id={`form-rhf-select-${name}`}
							aria-invalid={fieldState.invalid}
							className="min-w-[120px]"
						>
							<SelectValue>
								{field.value
									? items.find((item) => item.value === field.value)?.label
									: "Select an option"}
							</SelectValue>
						</SelectTrigger>
						<SelectContent>
							{items.map((item) => (
								<SelectItem key={item.value} value={item.value}>
									{item.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</Field>
			)}
		/>
	);
};

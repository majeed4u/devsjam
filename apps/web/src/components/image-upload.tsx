"use client";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle, CheckCircle, Upload, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Controller, type UseFormReturn } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { orpc } from "@/utils/orpc";

interface ImageUploadProps {
	form: UseFormReturn<any>;
	label: string;
	name: string;
}

type UploadState = "idle" | "reading" | "uploading" | "done" | "error";

export const ImageUpload = ({ form, label, name }: ImageUploadProps) => {
	const [state, setState] = useState<UploadState>("idle");
	const [progress, setProgress] = useState(0);
	const [preview, setPreview] = useState<string | null>(null);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const { mutateAsync } = useMutation(orpc.upload.upload.mutationOptions());

	// reset when form resets
	useEffect(() => {
		if (form.formState.isSubmitSuccessful) {
			handleRemove();
		}
	}, [form.formState.isSubmitSuccessful]);

	const handleUpload = useCallback(
		async (file: File) => {
			setErrorMsg(null);
			setState("reading");
			setProgress(0);

			const localPreview = URL.createObjectURL(file);
			setPreview(localPreview);

			const readInterval = setInterval(() => {
				setProgress((p) => {
					if (p >= 40) {
						clearInterval(readInterval);
						return 40;
					}
					return p + 5;
				});
			}, 40);

			try {
				const base64 = await new Promise<string>((resolve, reject) => {
					const reader = new FileReader();
					reader.onload = () =>
						resolve((reader.result as string).split(",")[1]);
					reader.onerror = reject;
					reader.readAsDataURL(file);
				});

				clearInterval(readInterval);
				setProgress(40);
				setState("uploading");

				const uploadInterval = setInterval(() => {
					setProgress((p) => {
						if (p >= 90) {
							clearInterval(uploadInterval);
							return 90;
						}
						return p + 4;
					});
				}, 60);

				const { files } = await mutateAsync({
					files: [
						{ fileName: file.name, contentType: file.type, data: base64 },
					],
				});

				clearInterval(uploadInterval);
				setProgress(100);
				setState("done");

				form.setValue(name, files[0].url, { shouldValidate: true });
				URL.revokeObjectURL(localPreview);
				setPreview(files[0].url);
			} catch (e: any) {
				setState("error");
				setProgress(0);
				setPreview(null);
				setErrorMsg(e?.message ?? "Upload failed. Please try again.");
				URL.revokeObjectURL(localPreview);
			}
		},
		[mutateAsync, form, name],
	);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) handleUpload(file);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
		const file = e.dataTransfer.files?.[0];
		if (file) handleUpload(file);
	};

	const handleRemove = () => {
		setState("idle");
		setProgress(0);
		setPreview(null);
		setErrorMsg(null);
		form.setValue(name, "", { shouldValidate: true });
		if (inputRef.current) inputRef.current.value = "";
	};

	const isLoading = state === "reading" || state === "uploading";

	return (
		<Controller
			name={name}
			control={form.control}
			render={({ fieldState }) => (
				<Field data-invalid={fieldState.invalid}>
					<FieldLabel>{label}</FieldLabel>

					<div
						onClick={() => !isLoading && inputRef.current?.click()}
						onDragOver={(e) => {
							e.preventDefault();
							setIsDragging(true);
						}}
						onDragLeave={() => setIsDragging(false)}
						onDrop={handleDrop}
						className={[
							"relative flex min-h-40 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-all duration-200",
							isDragging
								? "border-primary bg-primary/5"
								: state === "error"
									? "border-destructive bg-destructive/5"
									: state === "done"
										? "border-primary/50 bg-primary/5"
										: "border-border bg-muted/50 hover:border-primary/50 hover:bg-muted",
							isLoading && "cursor-not-allowed",
						].join(" ")}
					>
						{preview && (
							<img
								src={preview}
								alt="preview"
								className={[
									"absolute inset-0 h-full w-full object-cover transition-opacity duration-300",
									isLoading ? "opacity-40" : "opacity-100",
								].join(" ")}
							/>
						)}

						<div className="relative z-10 flex flex-col items-center gap-2 p-5 text-center">
							{state === "idle" && (
								<>
									<Upload className="h-8 w-8 text-muted-foreground" />
									<p className="text-muted-foreground text-sm">
										<span className="font-semibold text-primary">
											Click to upload
										</span>{" "}
										or drag & drop
									</p>
									<p className="text-muted-foreground/70 text-xs">
										PNG, JPG, WEBP, GIF up to 5MB
									</p>
								</>
							)}

							{isLoading && (
								<div className="flex flex-col items-center gap-3 rounded-xl bg-background/90 px-6 py-4 shadow-sm backdrop-blur-sm">
									<p className="font-medium text-foreground text-sm">
										{state === "reading" ? "Reading file..." : "Uploading..."}
									</p>
									<div className="h-1.5 w-48 overflow-hidden rounded-full bg-muted">
										<div
											className="h-full rounded-full bg-primary transition-all duration-100"
											style={{ width: `${progress}%` }}
										/>
									</div>
									<p className="text-muted-foreground text-xs">{progress}%</p>
								</div>
							)}

							{state === "done" && (
								<div className="flex items-center gap-2 rounded-lg bg-background/90 px-4 py-2 shadow-sm backdrop-blur-sm">
									<CheckCircle className="h-4 w-4 text-primary" />
									<p className="font-semibold text-foreground text-sm">
										Uploaded
									</p>
								</div>
							)}

							{state === "error" && (
								<div className="flex flex-col items-center gap-2">
									<AlertCircle className="h-8 w-8 text-destructive" />
									<p className="text-destructive text-sm">{errorMsg}</p>
									<p className="text-muted-foreground text-xs">
										Click to try again
									</p>
								</div>
							)}
						</div>

						{state === "done" && (
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									handleRemove();
								}}
								className="absolute top-2 right-2 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-foreground/70 text-background transition-colors hover:bg-foreground"
							>
								<X className="h-4 w-4" />
							</button>
						)}
					</div>

					<input
						ref={inputRef}
						type="file"
						accept="image/jpeg,image/png,image/webp,image/gif"
						onChange={handleFileChange}
						disabled={isLoading}
						className="hidden"
					/>

					{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
				</Field>
			)}
		/>
	);
};

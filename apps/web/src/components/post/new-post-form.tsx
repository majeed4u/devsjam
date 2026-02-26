import { zodResolver } from "@hookform/resolvers/zod";
import { ORPCError } from "@orpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { orpc } from "@/utils/orpc";
import { TipTapsEditor } from "../editor/tiptaps-editor";
import { FormCreatableSelect } from "../form-creatable-select";
import { FormInput } from "../form-input";
import { ImageUpload } from "../image-upload";
import { Button } from "../ui/button";
import { Field, FieldError, FieldGroup } from "../ui/field";
import { type PostCreateInput, postCreateSchema } from "./types";
export const NewPostForm = () => {
	const { data: postCategories, isLoading: categoriesLoading } = useQuery(
		orpc.category.gets.queryOptions(),
	);
	const { data: postSeries, isLoading: seriesLoading } = useQuery(
		orpc.series.gets.queryOptions(),
	);

	const createPost = useMutation(orpc.post.create.mutationOptions());

	const createCategory = useMutation(orpc.category.create.mutationOptions());
	const createSeries = useMutation(orpc.series.create.mutationOptions());
	const tagsQuery = useQuery(orpc.tag.gets.queryOptions());

	const form = useForm<PostCreateInput>({
		resolver: zodResolver(postCreateSchema),
		defaultValues: {
			title: "",
			excerpt: "",
			content: "",
			coverImage: "",
			readingTime: 0,
			categoryId: undefined,
			seriesId: undefined,
			tags: [],
			seriesOrder: undefined,
		},
	});

	const categories =
		postCategories?.map((c) => ({ value: c.id, label: c.name })) ?? [];
	const series =
		postSeries?.map((s) => ({ value: s.id, label: s.title })) ?? [];

	const tags =
		tagsQuery.data?.map((t) => ({ value: t.slug, label: t.name })) ?? [];

	async function onSubmit(data: PostCreateInput) {
		try {
			await createPost.mutateAsync(data, {
				onSuccess() {
					toast.success("Post created successfully!");
					form.reset();
				},
				onError(error) {
					toast.error("Failed to create post: " + error.message);
				},
			});
		} catch (error) {
			if (error instanceof ORPCError) {
				toast.error("Failed to create post: " + error.message);
			}
		}
	}

	return (
		<div>
			<form
				id="new-post-form"
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-4 py-8"
			>
				<FieldGroup className="grid grid-cols-1 gap-4 space-y-4 lg:grid-cols-2">
					<FormInput form={form} label="Post Title" name="title" />
					<FormInput form={form} label="Post Excerpt" name="excerpt" />

					<div className="col-span-1 lg:col-span-2">
						<Controller
							name="content"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<TipTapsEditor
										content={field.value || ""}
										onChange={field.onChange}
										limit={10000}
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
					</div>

					<div className="col-span-1 lg:col-span-2">
						<ImageUpload form={form} label="Cover Image" name="coverImage" />
					</div>
					{/* Category */}
					<FormCreatableSelect
						form={form}
						name="categoryId"
						label="Category"
						options={categories}
						isLoading={categoriesLoading}
						onCreate={async (name) => {
							const created = await createCategory.mutateAsync({ name });
							return { label: created.name, value: created.id };
						}}
					/>

					{/* Series */}
					<FormCreatableSelect
						form={form}
						name="seriesId"
						label="Series"
						options={series}
						isLoading={seriesLoading}
						onCreate={async (name) => {
							const created = await createSeries.mutateAsync({ name });
							return { label: created.title, value: created.id };
						}}
					/>

					{/* Tags */}
					<FormCreatableSelect
						form={form}
						name="tags"
						label="Tags"
						isMulti
						options={tags}
						onCreate={async (name) => ({ label: name, value: name })}
					/>
				</FieldGroup>

				<Button
					size="lg"
					className="flex w-full max-w-xs items-center justify-center gap-2 transition-all duration-200 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
					disabled={createPost.isPending}
					type="submit"
				>
					{createPost.isPending ? (
						<>
							<div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
							Creating...
						</>
					) : (
						<>✨ Create Post</>
					)}
				</Button>
			</form>
		</div>
	);
};

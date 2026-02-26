import { zodResolver } from "@hookform/resolvers/zod";
import { ORPCError } from "@orpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Save } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { orpc } from "@/utils/orpc";
import { TipTapsEditor } from "../editor/tiptaps-editor";
import { FormCreatableSelect } from "../form-creatable-select";
import { FormInput } from "../form-input";
import { ImageUpload } from "../image-upload";
import { FormSkeleton } from "../skeletons/form-skeleton";
import { Button } from "../ui/button";
import { Field, FieldError, FieldGroup } from "../ui/field";
import { type PostCreateInput, postCreateSchema } from "./types";
import type { Post } from "@/types/post";

interface EditPostFormProps {
  postId: string;
}

export const EditPostForm = ({ postId }: EditPostFormProps) => {
  const navigate = useNavigate();

  // Fetch post data using oRPC pattern
  const { data: posts, isLoading: postsLoading } = useQuery(
    orpc.post.getPosts.queryOptions(),
  );
  const post = posts?.find((p) => p.id === postId);

  const { data: postCategories, isLoading: categoriesLoading } = useQuery(
    orpc.category.gets.queryOptions(),
  );
  const { data: postSeries, isLoading: seriesLoading } = useQuery(
    orpc.series.gets.queryOptions(),
  );

  const updatePost = useMutation({
    mutationFn: async (data: PostCreateInput) => {
      // TODO: Implement update mutation in backend
      await new Promise((resolve) => setTimeout(resolve, 500));
      return data;
    },
  });

  const createCategory = useMutation(orpc.category.create.mutationOptions());
  const createSeries = useMutation(orpc.series.create.mutationOptions());
  const tagsQuery = useQuery(orpc.tag.gets.queryOptions());

  const form = useForm<PostCreateInput>({
    resolver: zodResolver(postCreateSchema),
    defaultValues: {
      title: post?.title ?? "",
      excerpt: post?.excerpt ?? "",
      content: post?.content ?? "",
      coverImage: post?.coverImage ?? "",
      readingTime: post?.readingTime ?? 0,
      categoryId: post?.categoryId ?? undefined,
      seriesId: post?.seriesId ?? undefined,
      tags: post?.tags?.map((t) => t.slug) ?? [],
      seriesOrder: post?.seriesOrder ?? undefined,
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
      await updatePost.mutateAsync(data, {
        onSuccess() {
          toast.success("Post updated successfully!");
          navigate({ to: "/admin/post/published" });
        },
        onError(error) {
          toast.error("Failed to update post: " + error.message);
        },
      });
    } catch (error) {
      if (error instanceof ORPCError) {
        toast.error("Failed to update post: " + error.message);
      }
    }
  }

  if (postsLoading) {
    return <FormSkeleton />;
  }

  if (!post) {
    return (
      <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-6 text-center">
        <p className="font-medium text-red-600 dark:text-red-400">
          Post not found
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex animate-slide-in-down items-center gap-4">
        <button
          onClick={() => navigate({ to: "/admin/post/published" })}
          className="rounded-lg p-2 transition-colors duration-200 duration-200 hover:scale-110 hover:bg-accent active:scale-95"
          title="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="font-bold text-3xl">Edit Post</h1>
          <p className="mt-1 text-foreground/60">{post.title}</p>
        </div>
      </div>

      <form
        id="edit-post-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="animate-slide-in-up space-y-4 py-8"
        style={{ animationDelay: "0.1s" }}
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

        <div className="flex gap-2 pt-4">
          <Button
            size="lg"
            className="flex items-center gap-2 transition-all duration-200 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={updatePost.isPending}
            type="submit"
          >
            {updatePost.isPending ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate({ to: "/admin/post/published" })}
            disabled={updatePost.isPending}
            className="transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

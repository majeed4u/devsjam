import { useState } from "react";
import { postCreateSchema, type PostCreateInput } from "../post/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ORPCError } from "@orpc/client";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldError, FieldGroup } from "../ui/field";
import { FormInput } from "../form-input";
import { TipTapsEditor } from "../editor/tiptaps-editor";
import { ImageUpload } from "../image-upload";
import { useQuery, useMutation } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";
import { FormCreatableSelect } from "../form-creatable-select";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Eye, Save, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";

export function EnhancedPostForm() {
  const [previewMode, setPreviewMode] = useState<"edit" | "preview">("edit");
  const [isSavingDraft, setIsSavingDraft] = useState(false);

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

  const watchedValues = form.watch();

  async function onSubmit(data: PostCreateInput, isDraft = false) {
    try {
      await createPost.mutateAsync(
        { ...data, status: isDraft ? "DRAFT" : "PUBLISHED" },
        {
          onSuccess() {
            toast.success(
              isDraft
                ? "Draft saved successfully!"
                : "Post published successfully!",
            );
            form.reset();
          },
          onError(error) {
            toast.error(
              `Failed to ${isDraft ? "save draft" : "publish"} post: ` +
                error.message,
            );
          },
        },
      );
    } catch (error) {
      if (error instanceof ORPCError) {
        toast.error(
          `Failed to ${isDraft ? "save draft" : "publish"} post: ` +
            error.message,
        );
      }
    }
  }

  async function handleSaveDraft() {
    const isValid = await form.trigger();
    if (!isValid) {
      toast.error("Please fix the errors before saving as draft");
      return;
    }
    setIsSavingDraft(true);
    await onSubmit(form.getValues(), true);
    setIsSavingDraft(false);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Post</h1>
          <p className="text-muted-foreground">
            Write and publish your blog post
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleSaveDraft}
            disabled={isSavingDraft || createPost.isPending}
          >
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          <Button
            type="submit"
            form="post-form"
            disabled={createPost.isPending}
          >
            <FileText className="mr-2 h-4 w-4" />
            Publish
          </Button>
        </div>
      </div>

      <Tabs
        value={previewMode}
        onValueChange={(v) => setPreviewMode(v as "edit" | "preview")}
      >
        <TabsList>
          <TabsTrigger value="edit">
            <FileText className="mr-2 h-4 w-4" />
            Edit
          </TabsTrigger>
          <TabsTrigger value="preview">
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="edit">
          <form
            id="post-form"
            onSubmit={form.handleSubmit((data) => onSubmit(data, false))}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Post Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FieldGroup className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <FormInput form={form} label="Post Title" name="title" />
                  <FormInput form={form} label="Post Excerpt" name="excerpt" />
                </FieldGroup>

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
                  <ImageUpload
                    form={form}
                    label="Cover Image"
                    name="coverImage"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Organization</CardTitle>
              </CardHeader>
              <CardContent>
                <FieldGroup className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <FormCreatableSelect
                    form={form}
                    name="categoryId"
                    label="Category"
                    options={categories}
                    isLoading={categoriesLoading}
                    onCreate={async (name) => {
                      const created = await createCategory.mutateAsync({
                        name,
                      });
                      return { label: created.name, value: created.id };
                    }}
                  />

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

                  <FormCreatableSelect
                    form={form}
                    name="tags"
                    label="Tags"
                    isMulti
                    options={tags}
                    onCreate={async (name) => ({ label: name, value: name })}
                  />
                </FieldGroup>
              </CardContent>
            </Card>
          </form>
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Post Preview</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              {watchedValues.coverImage && (
                <img
                  src={watchedValues.coverImage}
                  alt="Cover"
                  className="w-full rounded-lg mb-6"
                />
              )}
              <h1 className="text-4xl font-bold mb-4">
                {watchedValues.title || "Untitled Post"}
              </h1>
              {watchedValues.excerpt && (
                <p className="text-xl text-muted-foreground mb-6">
                  {watchedValues.excerpt}
                </p>
              )}
              <Separator className="my-6" />
              <div
                dangerouslySetInnerHTML={{
                  __html: watchedValues.content || "",
                }}
              />
              {watchedValues.tags && watchedValues.tags.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {watchedValues.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

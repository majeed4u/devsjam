import { Button } from "@/components/ui/button";
import { orpc } from "@/utils/orpc";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/admin/post/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  // Step 1: get presigned URLs from your server
  const getPresignedUrls = useMutation(orpc.upload.upload.mutationOptions());

  // Step 2: upload files directly to S3
  const uploadToS3 = async (files: File[], presignedUrls: string[]) => {
    await Promise.all(
      files.map((file, i) =>
        fetch(presignedUrls[i], {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type },
        }),
      ),
    );
  };

  const handleUpload = async () => {
    if (!selectedFiles) return;

    const files = Array.from(selectedFiles);

    // Convert files to base64
    const filesWithData = await Promise.all(
      files.map(async (file) => {
        const buffer = await file.arrayBuffer();
        const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
        return {
          fileName: file.name,
          contentType: file.type,
          data: base64,
        };
      }),
    );

    const { files: result } = await getPresignedUrls.mutateAsync({
      files: filesWithData,
    });

    // No S3 PUT needed — server already uploaded
    console.log("Ready to save to DB:", result);
    // TODO: call post.create({ images: result.map(r => ({ key: r.key, url: r.url })) })
  };

  const isLoading = getPresignedUrls.isPending;

  return (
    <div>
      <h1>Admin Post</h1>
      <input
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={(e) => setSelectedFiles(e.target.files)}
      />
      <Button onClick={handleUpload} disabled={!selectedFiles || isLoading}>
        {isLoading ? "Uploading..." : "Upload"}
      </Button>
    </div>
  );
}

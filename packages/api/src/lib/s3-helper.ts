import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
  S3ServiceException,
} from "@aws-sdk/client-s3";
import { env } from "@devjams/env/server";

const s3 = new S3Client({
  region: env.RUSTFS_REGION,
  credentials: {
    accessKeyId: env.RUSTFS_ACCESS_KEY_ID,
    secretAccessKey: env.RUSTFS_SECRET_ACCESS_KEY,
  },
  endpoint: env.RUSTFS_ENDPOINT_URL,
  forcePathStyle: true,
});

const BUCKET = env.RUSTFS_S3_BUCKET;

const ALLOWED_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export const uploadFile = async ({
  fileName,
  contentType,
  data,
  userId,
}: {
  fileName: string;
  contentType: string;
  data: string; // base64
  userId: string;
}) => {
  if (!ALLOWED_CONTENT_TYPES.includes(contentType)) {
    throw new Error(
      `Unsupported content type: ${contentType}. Allowed: ${ALLOWED_CONTENT_TYPES.join(", ")}`,
    );
  }

  if (!data) {
    throw new Error("File data is empty");
  }

  const key = `uploads/${userId}/${Date.now()}-${fileName}`;
  const buffer = Buffer.from(data, "base64");

  if (buffer.length === 0) {
    throw new Error("File buffer is empty after decoding");
  }

  // ~5MB limit — adjust as needed
  const MAX_SIZE = 5 * 1024 * 1024;
  if (buffer.length > MAX_SIZE) {
    throw new Error(
      `File too large. Max size is 5MB, got ${(buffer.length / 1024 / 1024).toFixed(2)}MB`,
    );
  }

  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      }),
    );
  } catch (e) {
    if (e instanceof S3ServiceException) {
      throw new Error(`S3 upload failed: ${e.message} (code: ${e.name})`);
    }
    throw new Error("Unexpected error during file upload");
  }

  return {
    key,
    url: `${env.SERVER_URL}/media/${encodeURIComponent(key)}`,
  };
};

export const getFile = async (key: string) => {
  if (!key) {
    throw new Error("File key is required");
  }

  console.log("Fetching file from S3:", { key, bucket: BUCKET });

  try {
    const obj = await s3.send(
      new GetObjectCommand({
        Bucket: BUCKET,
        Key: key,
      }),
    );

    if (!obj.Body) {
      throw new Error("File body is empty");
    }

    console.log("Successfully fetched file from S3:", {
      key,
      contentType: obj.ContentType,
    });
    return {
      buffer: await obj.Body.transformToByteArray(),
      contentType: obj.ContentType ?? "application/octet-stream",
    };
  } catch (e) {
    console.error("Error fetching file from S3:", e);
    if (e instanceof S3ServiceException) {
      if (e.name === "NoSuchKey") {
        throw new Error(`File not found: ${key}`);
      }
      if (
        e.name === "InvalidAccessKeyId" ||
        e.name === "SignatureDoesNotMatch"
      ) {
        throw new Error("S3 credentials are invalid or misconfigured");
      }
      throw new Error(`S3 fetch failed: ${e.message} (code: ${e.name})`);
    }
    throw new Error("Unexpected error during file fetch");
  }
};

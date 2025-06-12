import { R2_ACCESS_KEY, R2_ACCOUNT_ID, R2_SECRET_KEY, R2_BUCKET_NAME, R2_PUBLIC_URL } from "$env/static/private";


// src/lib/r2.ts
import {
  S3Client,
  GetObjectCommand,
  DeleteObjectCommand,
  PutObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { Readable } from "stream";
import type { User } from "./server/auth";

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY,
    secretAccessKey: R2_SECRET_KEY,
  },
});

export async function getImage(key: string): Promise<Buffer | null> {
  try {
    const command = new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    });
    const { Body } = await s3.send(command);

    if (Body instanceof Readable) {
      const chunks: Buffer[] = [];
      for await (const chunk of Body) {
        chunks.push(Buffer.from(chunk));
      }
      return Buffer.concat(chunks as any);
    }

    return null;
  } catch (error) {
    console.error("Error fetching image:", error);
    return null;
  }
}

export async function deleteImage(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
  });
  await s3.send(command);
}

export async function uploadImage(file: File, user: User) {
  const buffer = Buffer.from(await file.arrayBuffer());

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: `${Date.now()}_${user.pg.nums}ch${user.pg.proms}_${file.name}`,
    Body: buffer,
    ContentType: file.type,
  });

  await s3.send(command);
}

export async function listImages() {
  const command = new ListObjectsV2Command({
    Bucket: R2_BUCKET_NAME,
  });
  const response = await s3.send(command);

  const files =
    response.Contents?.map((item) => ({
      key: item.Key,
      lastModified: item.LastModified,
      size: item.Size,
      url: `${R2_PUBLIC_URL}/${item.Key}`,
    })) || [];

  return files;
}

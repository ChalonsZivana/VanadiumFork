// src/lib/r2.ts
import {
  S3Client,
  GetObjectCommand,
  DeleteObjectCommand,
  PutObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { Readable } from "stream";
import { env } from "$env/dynamic/private";
import type { User } from "./server/auth";

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY,
    secretAccessKey: env.R2_SECRET_KEY,
  },
});

export async function getImage(key: string): Promise<Buffer | null> {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
    });
    const { Body } = await s3.send(command);

    if (Body instanceof Readable) {
      const chunks: Buffer[] = [];
      for await (const chunk of Body) {
        chunks.push(Buffer.from(chunk));
      }
      return Buffer.concat(chunks);
    }

    return null;
  } catch (error) {
    console.error("Error fetching image:", error);
    return null;
  }
}

export async function deleteImage(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: env.R2_BUCKET_NAME,
    Key: key,
  });
  await s3.send(command);
}

export async function uploadImage(file: File, user: User) {
  const buffer = Buffer.from(await file.arrayBuffer());

  const command = new PutObjectCommand({
    Bucket: env.R2_BUCKET_NAME,
    Key: `${Date.now()}_${user.pg.nums}ch${user.pg.proms}_${file.name}`,
    Body: buffer,
    ContentType: file.type,
  });

  await s3.send(command);
}

export async function listImages() {
  const command = new ListObjectsV2Command({
    Bucket: env.R2_BUCKET_NAME,
  });
  const response = await s3.send(command);

  const files =
    response.Contents?.map((item) => ({
      key: item.Key,
      lastModified: item.LastModified,
      size: item.Size,
      url: `${env.R2_PUBLIC_URL}/${item.Key}`,
    })) || [];

  return files;
}

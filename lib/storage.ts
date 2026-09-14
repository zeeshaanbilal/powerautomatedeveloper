import "server-only";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { mkdir, writeFile, readFile, unlink } from "node:fs/promises";
import { mediaPath } from "./media";
const bucket = process.env.MEDIA_BUCKET || "uploads";
const client = process.env.AWS_ENDPOINT_URL_S3
  ? new S3Client({
      forcePathStyle: true,
      endpoint: process.env.AWS_ENDPOINT_URL_S3,
      region: process.env.AWS_REGION || "us-east-2",
    })
  : null;
export async function putMedia(filename: string, buffer: Buffer) {
  const { root, target } = mediaPath(filename);
  if (client) {
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: filename,
        Body: buffer,
        ContentType: "image/webp",
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );
  } else {
    await mkdir(root, { recursive: true });
    await writeFile(target, buffer, { flag: "wx" });
  }
}
export async function readMedia(filename: string) {
  const { target } = mediaPath(filename);
  if (!client) return readFile(target);
  const response = await client.send(
    new GetObjectCommand({ Bucket: bucket, Key: filename }),
  );
  if (!response.Body) throw Error("Media not found");
  return Buffer.from(await response.Body.transformToByteArray());
}
export async function deleteMedia(filename: string) {
  const { target } = mediaPath(filename);
  if (client)
    await client.send(
      new DeleteObjectCommand({ Bucket: bucket, Key: filename }),
    );
  else await unlink(target);
}

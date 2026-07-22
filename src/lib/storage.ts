/**
 * 存储适配器
 * 优先使用 Cloudinary 云存储，否则使用本地文件系统
 */

import { v2 as cloudinary } from "cloudinary";

// 配置 Cloudinary（使用环境变量）
if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export type UploadResult = {
  url: string;
};

export async function uploadFile(
  file: File,
  folder: string = "uploads"
): Promise<UploadResult> {
  // 使用 Cloudinary（如果已配置）
  if (process.env.CLOUDINARY_CLOUD_NAME) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder,
      resource_type: "image",
    });

    return { url: result.secure_url };
  }

  // 本地开发：使用文件系统
  const { writeFile, mkdir } = await import("fs/promises");
  const { join } = await import("path");
  const { randomUUID } = await import("crypto");

  const ext = file.name.split(".").pop() || "jpg";
  const filename = `${randomUUID()}.${ext}`;
  const uploadDir = join(process.cwd(), "public", folder);
  await mkdir(uploadDir, { recursive: true });

  const bytes = await file.arrayBuffer();
  await writeFile(join(uploadDir, filename), Buffer.from(bytes));

  return { url: `/${folder}/${filename}` };
}

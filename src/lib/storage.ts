/**
 * 存储适配器
 * 本地开发 → 文件系统（public/uploads/）
 * 生产环境 → Vercel Blob
 */

export type UploadResult = {
  url: string;
};

export async function uploadFile(
  file: File,
  folder: string = "uploads"
): Promise<UploadResult> {
  // 生产环境：使用 Vercel Blob
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    const ext = file.name.split(".").pop() || "jpg";
    const blob = await put(`${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`, file, {
      access: "public",
    });
    return { url: blob.url };
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

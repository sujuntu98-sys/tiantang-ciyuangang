import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadFile } from "@/lib/storage";

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  try {
    const userId = parseInt(session.user.id);
    const formData = await request.formData();

    const username = formData.get("username") as string | null;
    const bio = formData.get("bio") as string | null;
    const avatarFile = formData.get("avatar") as File | null;

    const data: Record<string, string> = {};

    // 更新用户名
    if (username && username.trim().length >= 2 && username.trim().length <= 20) {
      // 检查是否与当前用户名相同
      if (username.trim() !== session.user.name) {
        // 检查是否已被占用
        const existing = await prisma.user.findUnique({
          where: { username: username.trim() },
        });
        if (existing && existing.id !== userId) {
          return NextResponse.json({ error: "该用户名已被使用" }, { status: 409 });
        }
        data.username = username.trim();
      }
    }

    // 更新简介
    if (bio !== null && bio.length <= 200) {
      data.bio = bio;
    }

    // 更新头像
    if (avatarFile && avatarFile.size > 0) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(avatarFile.type)) {
        return NextResponse.json({ error: "头像仅支持 JPG、PNG、WebP" }, { status: 400 });
      }
      if (avatarFile.size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: "头像不能超过 10MB" }, { status: 400 });
      }

      const result = await uploadFile(avatarFile, "uploads");
      data.avatar = result.url;
    }

    // 没有任何要修改的内容
    if (Object.keys(data).length === 0) {
      const current = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, username: true, avatar: true, bio: true },
      });
      return NextResponse.json({ user: current });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        username: true,
        avatar: true,
        bio: true,
      },
    });

    return NextResponse.json({ user: updated });
  } catch (error: any) {
    console.error("Settings error:", error);
    const msg = error?.message || error?.code || "更新失败";
    return NextResponse.json(
      { error: `更新失败：${msg}` },
      { status: 500 }
    );
  }
}

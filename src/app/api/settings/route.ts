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

    const bio = formData.get("bio") as string | null;
    const avatarFile = formData.get("avatar") as File | null;

    const data: Record<string, string> = {};

    if (bio !== null && bio.length <= 200) {
      data.bio = bio;
    }

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
  } catch (error) {
    console.error("Settings error:", error);
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}

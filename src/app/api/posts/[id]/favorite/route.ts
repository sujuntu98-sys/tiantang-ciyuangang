import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const postId = parseInt(id);
    const userId = parseInt(session.user.id);

    if (isNaN(postId)) {
      return NextResponse.json({ error: "无效的帖子ID" }, { status: 400 });
    }

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return NextResponse.json({ error: "帖子不存在" }, { status: 404 });
    }

    const existing = await prisma.favorite.findUnique({
      where: { userId_postId: { userId, postId } },
    });

    if (existing) {
      await prisma.favorite.delete({
        where: { userId_postId: { userId, postId } },
      });
      return NextResponse.json({ favorited: false });
    } else {
      await prisma.favorite.create({
        data: { userId, postId },
      });
      return NextResponse.json({ favorited: true });
    }
  } catch (error) {
    console.error("Favorite error:", error);
    return NextResponse.json({ error: "操作失败" }, { status: 500 });
  }
}

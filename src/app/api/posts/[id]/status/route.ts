import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const postId = parseInt(id);

    if (isNaN(postId)) {
      return NextResponse.json({ error: "无效的帖子ID" }, { status: 400 });
    }

    // 默认未登录状态
    let liked = false;
    let favorited = false;

    const session = await auth();
    if (session?.user) {
      const userId = parseInt(session.user.id);

      const [likeRecord, favRecord] = await Promise.all([
        prisma.like.findUnique({
          where: { userId_postId: { userId, postId } },
        }),
        prisma.favorite.findUnique({
          where: { userId_postId: { userId, postId } },
        }),
      ]);

      liked = !!likeRecord;
      favorited = !!favRecord;
    }

    return NextResponse.json({ liked, favorited });
  } catch (error) {
    console.error("Status error:", error);
    return NextResponse.json({ liked: false, favorited: false });
  }
}

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// 获取评论列表
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

    const comments = await prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        user: { select: { id: true, username: true, avatar: true } },
      },
    });

    return NextResponse.json({ comments });
  } catch (error) {
    console.error("List comments error:", error);
    return NextResponse.json({ error: "加载失败" }, { status: 500 });
  }
}

// 发表评论
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

    const body = await request.json();
    const content = z.string().min(1, "评论不能为空").max(500, "评论最多500字").safeParse(body.content);

    if (!content.success) {
      return NextResponse.json({ error: content.error.errors[0].message }, { status: 400 });
    }

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return NextResponse.json({ error: "帖子不存在" }, { status: 404 });
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.data,
        userId,
        postId,
      },
      include: {
        user: { select: { id: true, username: true, avatar: true } },
      },
    });

    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    console.error("Create comment error:", error);
    return NextResponse.json({ error: "评论失败" }, { status: 500 });
  }
}

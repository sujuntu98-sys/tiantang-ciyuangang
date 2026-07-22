import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  try {
    const { username } = await params;
    const followerId = parseInt(session.user.id);

    const target = await prisma.user.findUnique({ where: { username } });
    if (!target) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    // 不能关注自己
    if (target.id === followerId) {
      return NextResponse.json({ error: "不能关注自己" }, { status: 400 });
    }

    const existing = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId: target.id,
        },
      },
    });

    if (existing) {
      await prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId,
            followingId: target.id,
          },
        },
      });
      return NextResponse.json({ following: false });
    } else {
      await prisma.follow.create({
        data: { followerId, followingId: target.id },
      });
      return NextResponse.json({ following: true });
    }
  } catch (error) {
    console.error("Follow error:", error);
    return NextResponse.json({ error: "操作失败" }, { status: 500 });
  }
}

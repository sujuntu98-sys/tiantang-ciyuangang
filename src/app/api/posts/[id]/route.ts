import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { unlink } from "fs/promises";
import { join } from "path";

// 删除帖子（仅作者本人可删除）
export async function DELETE(
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

    // 查找帖子
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return NextResponse.json({ error: "帖子不存在" }, { status: 404 });
    }

    // 检查是否为作者本人
    if (post.userId !== userId) {
      return NextResponse.json({ error: "只能删除自己的帖子" }, { status: 403 });
    }

    // 删除帖子（级联删除标签关联、点赞、收藏、评论）
    await prisma.post.delete({ where: { id: postId } });

    // 本地图片文件才需要删除（Vercel Blob 不需要手动清理）
    if (post.imageUrl && post.imageUrl.startsWith("/uploads/")) {
      try {
        const filePath = join(process.cwd(), "public", post.imageUrl);
        await unlink(filePath);
      } catch {
        // 文件不存在或无法删除，不影响整体流程
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete post error:", error);
    return NextResponse.json({ error: "删除失败，请稍后再试" }, { status: 500 });
  }
}

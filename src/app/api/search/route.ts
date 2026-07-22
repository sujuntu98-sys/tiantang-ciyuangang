import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const tag = searchParams.get("tag") || "";
    const type = searchParams.get("type") || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    // 关键词搜索（标题 + 描述）
    if (q.trim()) {
      where.OR = [
        { title: { contains: q.trim() } },
        { description: { contains: q.trim() } },
      ];
    }

    // 标签筛选
    if (tag.trim()) {
      where.tags = {
        some: {
          tag: { name: { contains: tag.trim() } },
        },
      };
    }

    // 类型筛选
    if (["official", "fanart", "cosplay", "snapshot"].includes(type)) {
      where.type = type;
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { id: true, username: true, avatar: true } },
          tags: { include: { tag: true } },
          _count: { select: { likes: true, favorites: true, comments: true } },
        },
      }),
      prisma.post.count({ where }),
    ]);

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "搜索失败" }, { status: 500 });
  }
}

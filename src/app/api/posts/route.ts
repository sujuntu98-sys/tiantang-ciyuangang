import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createPostSchema = z.object({
  title: z
    .string()
    .min(1, "请输入标题")
    .max(100, "标题最多100个字符"),
  description: z.string().max(500, "描述最多500个字符").optional(),
  imageUrl: z.string().min(1, "请上传图片"),
  type: z.enum(["official", "fanart", "cosplay", "snapshot"], {
    errorMap: () => ({ message: "请选择图片类型" }),
  }),
  tags: z
    .array(z.string().max(20))
    .max(10, "最多添加10个标签")
    .default([]),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = createPostSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { title, description, imageUrl, type, tags } = parsed.data;

    // 创建帖子（带标签）
    const post = await prisma.post.create({
      data: {
        title,
        description: description || "",
        imageUrl,
        type,
        userId: parseInt(session.user.id),
        tags: {
          create: await Promise.all(
            tags.map(async (tagName) => {
              // 查找或创建标签
              const tag = await prisma.tag.upsert({
                where: { name: tagName },
                update: {},
                create: { name: tagName },
              });
              return { tagId: tag.id };
            })
          ),
        },
      },
      include: {
        tags: {
          include: { tag: true },
        },
        user: {
          select: { id: true, username: true, avatar: true },
        },
      },
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error("Create post error:", error);
    return NextResponse.json(
      { error: "发布失败，请稍后再试" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sort = searchParams.get("sort") || "latest";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "12")));
    const skip = (page - 1) * limit;

    const orderBy =
      sort === "hot"
        ? { likes: { _count: "desc" as const } }
        : { createdAt: "desc" as const };

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        skip,
        take: limit,
        orderBy,
        include: {
          user: { select: { id: true, username: true, avatar: true } },
          tags: { include: { tag: true } },
          _count: { select: { likes: true, favorites: true, comments: true } },
        },
      }),
      prisma.post.count(),
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
    console.error("List posts error:", error);
    return NextResponse.json(
      { error: "加载失败，请稍后再试" },
      { status: 500 }
    );
  }
}

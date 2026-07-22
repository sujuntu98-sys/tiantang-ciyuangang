import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PostCard } from "@/components/PostCard";
import { prisma } from "@/lib/prisma";
import { HomeTabs } from "@/components/HomeTabs";

async function getPosts(sort: "latest" | "hot") {
  const orderBy =
    sort === "hot"
      ? { likes: { _count: "desc" as const } }
      : { createdAt: "desc" as const };

  const posts = await prisma.post.findMany({
    take: 12,
    orderBy,
    include: {
      user: { select: { id: true, username: true, avatar: true } },
      tags: { include: { tag: true } },
      _count: { select: { likes: true, favorites: true, comments: true } },
    },
  });

  return posts;
}

export default async function FeedPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  const params = await searchParams;
  const sort = params.sort === "hot" ? "hot" : "latest";
  const posts = await getPosts(sort);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* 页面标题 + Tab */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            发现
          </span>
        </h2>
        <HomeTabs active={sort} />
      </div>

      {posts.length === 0 ? (
        /* 空态 */
        <div className="text-center py-20">
          <div className="inline-block bg-white rounded-2xl shadow-sm border border-gray-100 p-12">
            <p className="text-6xl mb-4">🎨</p>
            <p className="text-xl text-gray-500 mb-4">还没有帖子</p>
            <Link
              href="/post/create"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-400 to-purple-500 text-white rounded-xl text-sm font-medium"
            >
              发布第一帖
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* 帖子网格 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* 加载更多 */}
          {posts.length >= 12 && (
            <div className="text-center mt-10">
              <Link
                href="/search"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-500 rounded-xl border border-gray-200 text-sm hover:border-purple-300 hover:text-purple-500 transition-all duration-200"
              >
                探索更多内容
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}

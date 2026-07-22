import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Calendar, Tag, User } from "lucide-react";
import Link from "next/link";
import { PostActions } from "@/components/PostActions";
import { CommentSection } from "@/components/CommentSection";
import { DeletePostButton } from "@/components/DeletePostButton";

async function getPost(id: string) {
  const postId = parseInt(id);
  if (isNaN(postId)) return null;

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      user: { select: { id: true, username: true, avatar: true } },
      tags: { include: { tag: true } },
      _count: { select: { likes: true, favorites: true, comments: true } },
    },
  });

  return post;
}

const typeLabels: Record<string, string> = {
  official: "原画",
  fanart: "二创",
  cosplay: "Cosplay",
  snapshot: "随手拍",
};

const typeStyles: Record<string, string> = {
  official: "bg-blue-50 text-blue-500 border-blue-200",
  fanart: "bg-pink-50 text-pink-500 border-pink-200",
  cosplay: "bg-purple-50 text-purple-500 border-purple-200",
  snapshot: "bg-green-50 text-green-500 border-green-200",
};

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 返回链接 */}
      <Link
        href="/feed"
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-purple-500 transition-colors mb-6"
      >
        ← 返回发现
      </Link>

      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-purple-100 border border-purple-50 overflow-hidden">
        {/* 图片 */}
        <div className="bg-gray-50 flex items-center justify-center p-4">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="max-h-[600px] object-contain rounded-lg"
          />
        </div>

        {/* 信息区 */}
        <div className="p-6 md:p-8">
          {/* 类型 + 标签 */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium border ${
                typeStyles[post.type] || "bg-gray-50 text-gray-500 border-gray-200"
              }`}
            >
              {typeLabels[post.type] || post.type}
            </span>
            {post.tags.map((pt) => (
              <span
                key={pt.tag.id}
                className="px-3 py-1 bg-purple-50 text-purple-500 rounded-full text-xs border border-purple-100"
              >
                {pt.tag.name}
              </span>
            ))}
          </div>

          {/* 标题 */}
          <h1 className="text-2xl font-bold text-gray-800 mb-3">
            {post.title}
          </h1>

          {/* 描述 */}
          {post.description && (
            <p className="text-gray-500 leading-relaxed mb-6">
              {post.description}
            </p>
          )}

          {/* 作者信息 + 互动按钮 */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
            {/* 作者 */}
            <div className="flex items-center gap-3">
              <Link
                href={`/user/${post.user.username}`}
                className="flex items-center gap-2.5 group"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {post.user.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 group-hover:text-purple-500 transition-colors">
                    {post.user.username}
                  </p>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(post.createdAt).toLocaleDateString("zh-CN")}
                  </p>
                </div>
              </Link>
            </div>

            {/* 点赞 + 收藏按钮（客户端组件） */}
            <div className="flex items-center gap-2">
              <PostActions
                postId={post.id}
                initialLikes={post._count.likes}
                initialFavorites={post._count.favorites}
              />
              <DeletePostButton postId={post.id} authorId={post.user.id} />
            </div>
          </div>
        </div>
      </div>

      {/* 评论区（客户端组件） */}
      <div className="mt-6 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-purple-100 border border-purple-50 p-6 md:p-8">
        <CommentSection postId={post.id} />
      </div>
    </div>
  );
}

import Link from "next/link";
import { Heart, Bookmark, MessageCircle } from "lucide-react";

interface PostCardProps {
  post: {
    id: number;
    title: string;
    imageUrl: string;
    type: string;
    createdAt: string;
    user: { id: number; username: string; avatar: string | null };
    tags: { tag: { id: number; name: string } }[];
    _count: { likes: number; favorites: number; comments: number };
  };
}

const typeConfig: Record<string, { label: string; className: string }> = {
  official: { label: "原画", className: "bg-blue-50 text-blue-500 border-blue-100" },
  fanart: { label: "二创", className: "bg-pink-50 text-pink-500 border-pink-100" },
  cosplay: { label: "Cosplay", className: "bg-purple-50 text-purple-500 border-purple-100" },
  snapshot: { label: "随手拍", className: "bg-green-50 text-green-500 border-green-100" },
};

export function PostCard({ post }: PostCardProps) {
  const typeInfo = typeConfig[post.type] || typeConfig.fanart;

  return (
    <Link href={`/post/${post.id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm shadow-purple-100 border border-purple-50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        {/* 缩略图 */}
        <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* 类型标签 — 左上角 */}
          <span className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-xs font-medium border ${typeInfo.className}`}>
            {typeInfo.label}
          </span>
        </div>

        {/* 信息区 */}
        <div className="p-4">
          {/* 标题 */}
          <h3 className="font-semibold text-gray-800 mb-2 line-clamp-1 group-hover:text-purple-500 transition-colors">
            {post.title}
          </h3>

          {/* 标签 */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {post.tags.slice(0, 3).map((pt) => (
                <span
                  key={pt.tag.id}
                  className="px-2 py-0.5 bg-purple-50 text-purple-400 rounded-full text-xs"
                >
                  {pt.tag.name}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="px-2 py-0.5 text-gray-400 text-xs">
                  +{post.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* 底部：作者 + 互动数据 */}
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-[10px] font-medium">
                {post.user.username.charAt(0).toUpperCase()}
              </div>
              <span>{post.user.username}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-0.5">
                <Heart className="w-3 h-3" />
                {post._count.likes}
              </span>
              <span className="flex items-center gap-0.5">
                <Bookmark className="w-3 h-3" />
                {post._count.favorites}
              </span>
              <span className="flex items-center gap-0.5">
                <MessageCircle className="w-3 h-3" />
                {post._count.comments}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

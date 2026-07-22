"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Heart, Bookmark } from "lucide-react";

interface PostActionsProps {
  postId: number;
  initialLikes: number;
  initialFavorites: number;
}

export function PostActions({
  postId,
  initialLikes,
  initialFavorites,
}: PostActionsProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const [likes, setLikes] = useState(initialLikes);
  const [favorites, setFavorites] = useState(initialFavorites);
  const [liked, setLiked] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  // 检查当前用户的互动状态
  useEffect(() => {
    if (!session?.user) return;
    fetch(`/api/posts/${postId}/status`)
      .then((r) => r.json())
      .then((d) => {
        if (d.liked !== undefined) setLiked(d.liked);
        if (d.favorited !== undefined) setFavorited(d.favorited);
      })
      .catch(() => {});
  }, [postId, session]);

  const handleLike = async () => {
    if (!session?.user) {
      router.push("/auth/login");
      return;
    }
    if (likeLoading) return;
    setLikeLoading(true);

    try {
      const res = await fetch(`/api/posts/${postId}/like`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setLiked(data.liked);
        setLikes((prev) => (data.liked ? prev + 1 : prev - 1));
      }
    } catch { /* ignore */ }
    setLikeLoading(false);
  };

  const handleFavorite = async () => {
    if (!session?.user) {
      router.push("/auth/login");
      return;
    }
    if (favLoading) return;
    setFavLoading(true);

    try {
      const res = await fetch(`/api/posts/${postId}/favorite`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setFavorited(data.favorited);
        setFavorites((prev) => (data.favorited ? prev + 1 : prev - 1));
      }
    } catch { /* ignore */ }
    setFavLoading(false);
  };

  return (
    <div className="flex items-center gap-4">
      {/* 点赞按钮 */}
      <button
        onClick={handleLike}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 btn-hover-scale ${
          liked
            ? "bg-pink-50 text-pink-500 border-2 border-pink-200"
            : "bg-gray-50 text-gray-500 border-2 border-transparent hover:border-pink-200 hover:text-pink-400"
        }`}
      >
        <Heart
          className={`w-5 h-5 transition-all ${liked ? "fill-pink-400" : ""} ${likeLoading ? "animate-pulse" : ""}`}
        />
        <span>{likes}</span>
      </button>

      {/* 收藏按钮 */}
      <button
        onClick={handleFavorite}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 btn-hover-scale ${
          favorited
            ? "bg-yellow-50 text-yellow-500 border-2 border-yellow-200"
            : "bg-gray-50 text-gray-500 border-2 border-transparent hover:border-yellow-200 hover:text-yellow-500"
        }`}
      >
        <Bookmark
          className={`w-5 h-5 transition-all ${favorited ? "fill-yellow-400" : ""} ${favLoading ? "animate-pulse" : ""}`}
        />
        <span>{favorites}</span>
      </button>
    </div>
  );
}

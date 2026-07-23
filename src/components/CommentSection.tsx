"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MessageCircle, Send, AlertCircle } from "lucide-react";
import Link from "next/link";

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  user: { id: number; username: string; avatar: string | null };
}

interface CommentSectionProps {
  postId: number;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/posts/${postId}/comments`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments);
      }
    } catch { /* ignore */ }
    setLoading(false);
  }, [postId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      router.push("/auth/login");
      return;
    }
    if (!content.trim()) return;
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "评论失败");
        setSubmitting(false);
        return;
      }

      const data = await res.json();
      setComments((prev) => [data.comment, ...prev]);
      setContent("");
    } catch {
      setError("网络错误，请稍后再试");
    }
    setSubmitting(false);
  };

  return (
    <div className="mt-6">
      {/* 标题 */}
      <div className="flex items-center gap-2 mb-5">
        <MessageCircle className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-bold text-gray-800">
          评论 ({comments.length})
        </h3>
      </div>

      {/* 发表评论 */}
      <form onSubmit={handleSubmit} className="mb-6">
        {error && (
          <div className="mb-3 p-3 bg-red-50 border border-red-100 rounded-xl text-red-500 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}
        <div className="flex gap-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 input-enhanced px-4 py-3 text-gray-800 text-sm resize-none"
            placeholder={session ? "写下你的评论..." : "登录后即可评论"}
            rows={2}
            maxLength={500}
            disabled={!session}
          />
          <button
            type="submit"
            disabled={submitting || !content.trim() || !session}
            className="self-end px-4 py-3 bg-gradient-to-r from-blue-400 to-purple-500 text-white rounded-xl shadow-md shadow-purple-100 hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* 评论列表 */}
      {loading ? (
        <div className="text-center py-8 text-gray-400 text-sm">加载中...</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-400 text-sm">
          还没有评论，来坐沙发吧~
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-white/60 rounded-xl p-4 border border-purple-50"
            >
              <div className="flex items-center gap-2.5 mb-2">
                <Link
                  href={`/user/${encodeURIComponent(comment.user.username)}`}
                  className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-[10px] font-medium"
                >
                  {comment.user.username.charAt(0).toUpperCase()}
                </Link>
                <Link
                  href={`/user/${encodeURIComponent(comment.user.username)}`}
                  className="text-sm font-medium text-gray-700 hover:text-purple-500 transition-colors"
                >
                  {comment.user.username}
                </Link>
                <span className="text-xs text-gray-400">
                  {new Date(comment.createdAt).toLocaleDateString("zh-CN")}
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

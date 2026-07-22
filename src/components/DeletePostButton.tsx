"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Trash2, AlertCircle } from "lucide-react";

interface DeletePostButtonProps {
  postId: number;
  authorId: number;
}

export function DeletePostButton({ postId, authorId }: DeletePostButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  // 不是作者本人则不显示
  if (!session?.user || parseInt(session.user.id) !== authorId) {
    return null;
  }

  const handleDelete = async () => {
    setDeleting(true);
    setError("");

    try {
      const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/feed");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "删除失败");
        setDeleting(false);
        setShowConfirm(false);
      }
    } catch {
      setError("网络错误，请稍后再试");
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      {/* 删除按钮 */}
      <button
        onClick={() => setShowConfirm(true)}
        className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-400 hover:text-red-400 hover:bg-red-50 rounded-lg transition-colors"
      >
        <Trash2 className="w-4 h-4" />
        <span className="hidden sm:inline">删除</span>
      </button>

      {/* 确认弹窗 */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-6 mx-4 max-w-sm w-full page-enter-fast">
            <div className="flex items-center gap-3 mb-4 text-red-500">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-lg font-bold">确认删除</h3>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              删除后无法恢复，帖子下的所有点赞、收藏和评论也会一并删除。确定要删除吗？
            </p>
            {error && (
              <p className="text-sm text-red-500 mb-4">{error}</p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-500 rounded-xl hover:bg-red-600 disabled:opacity-50 transition-colors"
              >
                {deleting ? "删除中..." : "确认删除"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Camera, Save, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [bio, setBio] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 加载当前资料
  useEffect(() => {
    if (session?.user) {
      // 从 session 获取当前用户信息
      fetch(`/api/users/${session.user.name}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.bio) setBio(data.bio);
        })
        .catch(() => {});
    }
  }, [session]);

  if (!session?.user) return null;

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("仅支持 JPG、PNG、WebP 格式");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("头像不能超过 10MB");
      return;
    }

    setError("");
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("bio", bio);
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const res = await fetch("/api/settings", {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "保存失败");
        setSaving(false);
        return;
      }

      await update();
      setSuccess("资料已更新");
      setAvatarFile(null);
      setAvatarPreview(null);
    } catch {
      setError("网络错误");
    }
    setSaving(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">
          <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            个人设置
          </span>
        </h1>
        <p className="text-gray-400 text-sm">修改你的个人资料</p>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-purple-100 border border-purple-50 p-8 space-y-8">
        {/* 消息提示 */}
        {error && (
          <div className="p-3.5 bg-red-50 border border-red-100 rounded-xl text-red-500 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
          </div>
        )}
        {success && (
          <div className="p-3.5 bg-green-50 border border-green-100 rounded-xl text-green-500 text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> {success}
          </div>
        )}

        {/* 头像 */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-3">
            头像
          </label>
          <div className="flex items-center gap-5">
            <div
              className="w-20 h-20 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-400 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-md overflow-hidden flex-shrink-0 cursor-pointer relative group"
              onClick={() => fileInputRef.current?.click()}
            >
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="头像预览"
                  className="w-full h-full object-cover"
                />
              ) : (
                session.user.name?.charAt(0).toUpperCase() || "U"
              )}
              {/* hover 遮罩 */}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
              >
                更换头像
              </button>
              <p className="text-xs text-gray-400 mt-1.5">
                JPG、PNG、WebP，最大 10MB
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleAvatarSelect}
              className="hidden"
            />
          </div>
        </div>

        {/* 简介 */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            个人简介
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="input-enhanced w-full px-4 py-3 text-gray-800 resize-none"
            placeholder="介绍一下自己，让更多人认识你..."
            maxLength={200}
          />
          <p className="text-xs text-gray-400 mt-1 text-right">
            {bio.length}/200
          </p>
        </div>

        {/* 保存按钮 */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 text-white rounded-xl font-medium shadow-md shadow-purple-200 hover:shadow-lg disabled:opacity-50 transition-all duration-200 btn-hover-scale flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          {saving ? "保存中..." : "保存修改"}
        </button>

        {/* 返回链接 */}
        <div className="text-center">
          <Link
            href={`/user/${session.user.name}`}
            className="text-sm text-gray-400 hover:text-purple-500 transition-colors"
          >
            ← 返回我的主页
          </Link>
        </div>
      </div>
    </div>
  );
}

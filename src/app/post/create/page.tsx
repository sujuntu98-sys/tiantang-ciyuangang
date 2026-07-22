"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Upload,
  Image as ImageIcon,
  X,
  Sparkles,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { TagInput } from "@/components/TagInput";

export default function CreatePostPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"official" | "fanart" | "cosplay" | "snapshot">("fanart");
  const [tags, setTags] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // 选择图片
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("仅支持 JPG、PNG、WebP 格式");
      return;
    }
    if (file.size > 30 * 1024 * 1024) {
      setError("图片不能超过 30MB");
      return;
    }

    setError("");
    setImageFile(file);

    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  // 移除图片
  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // 处理上传和发布
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!imageFile) {
      setError("请选择一张图片");
      return;
    }
    if (!title.trim()) {
      setError("请输入标题");
      return;
    }

    // ---- 第一步：上传图片 ----
    setUploading(true);

    let uploadRes: Response;
    try {
      const formData = new FormData();
      formData.append("file", imageFile);
      uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
    } catch {
      setError("网络连接失败，请检查网络后重试");
      setUploading(false);
      return;
    }

    if (!uploadRes.ok) {
      let msg = "图片上传失败";
      try {
        const data = await uploadRes.json();
        msg = data.error || msg;
      } catch { /* ignore */ }
      setError(msg);
      setUploading(false);
      return;
    }

    let imageUrl: string;
    try {
      const uploadData = await uploadRes.json();
      imageUrl = uploadData.imageUrl;
      if (!imageUrl) {
        setError("上传返回数据异常，请重试");
        setUploading(false);
        return;
      }
    } catch {
      setError("上传响应解析失败，请重试");
      setUploading(false);
      return;
    }

    setUploading(false);

    // ---- 第二步：创建帖子 ----
    setSubmitting(true);

    let postRes: Response;
    try {
      postRes = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          imageUrl,
          type,
          tags,
        }),
      });
    } catch {
      setError("网络连接失败，请检查网络后重试");
      setSubmitting(false);
      return;
    }

    if (!postRes.ok) {
      let msg = "发布失败";
      try {
        const data = await postRes.json();
        msg = data.error || msg;
      } catch { /* ignore */ }
      setError(msg);
      setSubmitting(false);
      return;
    }

    let post: { id: number };
    try {
      const postData = await postRes.json();
      post = postData.post;
      if (!post || !post.id) {
        setError("发布返回数据异常，请重试");
        setSubmitting(false);
        return;
      }
    } catch {
      setError("发布响应解析失败，请重试");
      setSubmitting(false);
      return;
    }

    // ---- 跳转到帖子详情 ----
    router.push("/post/" + post.id);
  };

  if (!session?.user) {
    return null;
  }

  const isLoading = uploading || submitting;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">
          <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            发布帖子
          </span>
        </h1>
        <p className="text-gray-400 text-sm">分享你喜欢的二次元角色图片</p>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-purple-100 border border-purple-50 p-8">
        {error && (
          <div className="mb-6 p-3.5 bg-red-50 border border-red-100 rounded-xl text-red-500 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 图片上传 */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-600 mb-2">
              <ImageIcon className="w-3.5 h-3.5 text-pink-400" />
              上传图片
            </label>

            {imagePreview ? (
              <div className="relative rounded-xl overflow-hidden border-2 border-purple-100">
                <img
                  src={imagePreview}
                  alt="预览"
                  className="w-full max-h-80 object-contain bg-gray-50"
                />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-md hover:bg-red-50 hover:text-red-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-48 border-2 border-dashed border-purple-200 rounded-xl flex flex-col items-center justify-center gap-3 text-gray-400 hover:border-purple-400 hover:text-purple-400 hover:bg-purple-50/50 transition-all duration-200"
              >
                <Upload className="w-10 h-10" />
                <div className="text-sm">
                  <span className="text-purple-400 font-medium">点击上传</span>
                  {" 或拖拽图片到此处"}
                </div>
                <span className="text-xs text-gray-300">
                  支持 JPG、PNG、WebP，最大 30MB
                </span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* 标题 */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              标题
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-enhanced w-full px-4 py-2.5 text-gray-800"
              placeholder="给你的帖子起个标题"
              maxLength={100}
              required
            />
            <p className="text-xs text-gray-400 mt-1 text-right">
              {title.length}/100
            </p>
          </div>

          {/* 描述 */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              描述（可选）
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="input-enhanced w-full px-4 py-2.5 text-gray-800 resize-none"
              placeholder="简单介绍一下这张图..."
              maxLength={500}
            />
            <p className="text-xs text-gray-400 mt-1 text-right">
              {description.length}/500
            </p>
          </div>

          {/* 类型选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-3">
              类型
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "fanart", label: "二创", desc: "同人绘画", color: "pink" },
                { value: "official", label: "原画", desc: "官方画作", color: "blue" },
                { value: "cosplay", label: "Cosplay", desc: "角色扮演", color: "purple" },
                { value: "snapshot", label: "随手拍", desc: "生活瞬间", color: "green" },
              ].map((item) => {
                const isActive = type === item.value;
                const colors: Record<string, { active: string; border: string; bg: string; text: string; shadow: string }> = {
                   pink:    { active: "border-pink-400 bg-pink-50 text-pink-500 shadow-pink-100",    border: "hover:border-pink-200",    bg: "bg-white", text: "text-gray-400", shadow: "" },
                  blue:    { active: "border-blue-400 bg-blue-50 text-blue-500 shadow-blue-100",    border: "hover:border-blue-200",    bg: "bg-white", text: "text-gray-400", shadow: "" },
                  purple:  { active: "border-purple-400 bg-purple-50 text-purple-500 shadow-purple-100", border: "hover:border-purple-200", bg: "bg-white", text: "text-gray-400", shadow: "" },
                  green:   { active: "border-green-400 bg-green-50 text-green-500 shadow-green-100",  border: "hover:border-green-200",  bg: "bg-white", text: "text-gray-400", shadow: "" },
                const c = colors[item.color];
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setType(item.value as typeof type)}
                    className={`py-3 rounded-xl border-2 font-medium text-sm transition-all duration-200 ${
                      isActive
                        ? `${c.active} shadow-sm`
                        : `${c.bg} ${c.text} border-gray-200 ${c.border}`
                    }`}
                  >
                    <div>{item.label}</div>
                    <div className="text-xs opacity-60 mt-0.5">{item.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 标签 */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              标签
            </label>
            <div className="input-enhanced px-4 py-2.5 bg-white">
              <TagInput tags={tags} onChange={setTags} maxTags={10} />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              按回车添加标签，方便其他人找到你的帖子
            </p>
          </div>

          {/* 提交 */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 text-white rounded-xl font-medium text-base shadow-md shadow-purple-200 hover:shadow-lg hover:shadow-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 btn-hover-scale flex items-center justify-center gap-2"
          >
            {uploading
              ? "上传图片中..."
              : submitting
                ? "发布中..."
                : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    发布帖子
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
          </button>
        </form>
      </div>
    </div>
  );
}

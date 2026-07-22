"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, User, Mail, Lock, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("两次输入的密码不一致");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "注册失败");
        setLoading(false);
        return;
      }

      router.push("/auth/login?registered=true");
    } catch {
      setError("网络错误，请稍后再试");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* 标题区 */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-400 rounded-xl flex items-center justify-center mx-auto shadow-md shadow-purple-200 hover:shadow-lg transition-shadow">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold mb-2">
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              加入天堂次元港
            </span>
          </h1>
          <p className="text-gray-400 text-sm">创建账号，开启你的二次元之旅</p>
        </div>

        {/* 表单卡片 */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-purple-100 border border-purple-50 p-8">
          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-100 rounded-xl text-red-500 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 用户名 */}
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-gray-600 mb-2">
                <User className="w-3.5 h-3.5 text-blue-400" />
                用户名
              </label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="input-enhanced w-full px-4 py-2.5 text-gray-800"
                placeholder="给自己起个名字吧"
                required
                minLength={2}
                maxLength={20}
              />
            </div>

            {/* 邮箱 */}
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-gray-600 mb-2">
                <Mail className="w-3.5 h-3.5 text-purple-400" />
                邮箱
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-enhanced w-full px-4 py-2.5 text-gray-800"
                placeholder="example@email.com"
                required
              />
            </div>

            {/* 密码 */}
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-gray-600 mb-2">
                <Lock className="w-3.5 h-3.5 text-pink-400" />
                密码
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input-enhanced w-full px-4 py-2.5 text-gray-800"
                placeholder="至少6个字符"
                required
                minLength={6}
              />
            </div>

            {/* 确认密码 */}
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-gray-600 mb-2">
                <Lock className="w-3.5 h-3.5 text-purple-400" />
                确认密码
              </label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
                className="input-enhanced w-full px-4 py-2.5 text-gray-800"
                placeholder="再输入一次密码"
                required
              />
            </div>

            {/* 提交按钮 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 text-white rounded-xl font-medium text-base shadow-md shadow-purple-200 hover:shadow-lg hover:shadow-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 btn-hover-scale flex items-center justify-center gap-2"
            >
              {loading ? (
                "注册中..."
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  创建账号
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            已有账号？{" "}
            <Link
              href="/auth/login"
              className="text-blue-500 hover:text-purple-500 font-medium transition-colors"
            >
              去登录
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

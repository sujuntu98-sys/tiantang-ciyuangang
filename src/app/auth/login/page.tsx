"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Sparkles, Mail, Lock, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered");
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.error) {
        setError("邮箱或密码错误，请检查后重试");
        setLoading(false);
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError("网络错误，请稍后再试");
      setLoading(false);
    }
  };

  return (
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
            欢迎回来
          </span>
        </h1>
        <p className="text-gray-400 text-sm">登录你的天堂次元港账号</p>
      </div>

      {/* 表单卡片 */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-purple-100 border border-purple-50 p-8">
        {/* 注册成功提示 */}
        {justRegistered && (
          <div className="mb-5 p-3.5 bg-green-50 border border-green-100 rounded-xl text-green-500 text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            注册成功！请登录你的新账号
          </div>
        )}

        {error && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-100 rounded-xl text-red-500 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
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
              placeholder="输入你的密码"
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
              "登录中..."
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                登录
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          还没有账号？{" "}
          <Link
            href="/auth/register"
            className="text-pink-400 hover:text-pink-500 font-medium transition-colors"
          >
            去注册
          </Link>
        </p>
      </div>
    </div>
  );
}

// useSearchParams 需要 Suspense 包裹
export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Suspense
        fallback={
          <div className="text-gray-400 text-sm">加载中...</div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}

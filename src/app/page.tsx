"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Heart, Star, Users } from "lucide-react";

// 浮动星星粒子
function FloatingStars() {
  const [stars, setStars] = useState<{ id: number; x: number; y: number; size: number; delay: number; duration: number }[]>([]);

  useEffect(() => {
    const generated = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 5,
      duration: Math.random() * 4 + 3,
    }));
    setStars(generated);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            opacity: 0,
            animation: `sparkle ${s.duration}s ${s.delay}s infinite`,
            boxShadow: `0 0 ${s.size * 2}px ${s.size}px rgba(255,255,255,0.6)`,
          }}
        />
      ))}
    </div>
  );
}

// 漂浮装饰
function FloatingDecorations() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* 大光晕 */}
      <div className="absolute top-[10%] -left-[10%] w-[40%] h-[40%] bg-gradient-to-br from-pink-300/25 to-purple-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "0s", animationDuration: "8s" }} />
      <div className="absolute bottom-[15%] -right-[5%] w-[35%] h-[35%] bg-gradient-to-tl from-blue-300/25 to-cyan-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s", animationDuration: "10s" }} />
      <div className="absolute top-[40%] right-[20%] w-[25%] h-[25%] bg-gradient-to-bl from-purple-300/20 to-pink-300/15 rounded-full blur-3xl animate-float" style={{ animationDelay: "4s", animationDuration: "7s" }} />

      {/* 装饰圆环 */}
      <div className="absolute top-[15%] right-[10%] w-32 h-32 border-2 border-purple-200/30 rounded-full animate-float" style={{ animationDelay: "1s", animationDuration: "6s" }} />
      <div className="absolute bottom-[20%] left-[8%] w-20 h-20 border-2 border-pink-200/25 rounded-full animate-float" style={{ animationDelay: "3s", animationDuration: "8s" }} />
      <div className="absolute top-[55%] left-[15%] w-16 h-16 border-2 border-blue-200/25 rounded-full animate-float" style={{ animationDelay: "5s", animationDuration: "7s" }} />

      {/* 菱形装饰 */}
      <div className="absolute top-[25%] left-[60%] w-4 h-4 bg-purple-300/20 rotate-45 rounded-sm animate-float" style={{ animationDelay: "2s", animationDuration: "5s" }} />
      <div className="absolute bottom-[35%] right-[15%] w-3 h-3 bg-pink-300/20 rotate-45 rounded-sm animate-float" style={{ animationDelay: "4s", animationDuration: "6s" }} />
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col relative">
      {/* ===== 主视觉区 ===== */}
      <section className="flex-1 flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-[#F8F6FF] via-[#FFF5F8] to-[#F5F8FF]">
        <FloatingStars />
        <FloatingDecorations />

        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto page-enter">
          {/* 顶部小标签 */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur rounded-full border border-purple-100 text-purple-400 text-sm font-medium mb-8 shadow-sm">
            <Sparkles className="w-4 h-4" />
            二次元爱好者的温暖港湾
          </div>

          {/* 主标题 */}
          <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight leading-tight">
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                天堂次元港
              </span>
              {/* 标题下划线装饰 */}
              <svg
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[80%] h-3 opacity-40"
                viewBox="0 0 200 12"
                fill="none"
              >
                <path
                  d="M4 8 Q 50 2, 100 8 T 196 8"
                  stroke="url(#underlineGrad)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                />
                <defs>
                  <linearGradient id="underlineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop stopColor="#818CF8" />
                    <stop offset="0.5" stopColor="#C084FC" />
                    <stop offset="1" stopColor="#F472B6" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-500 mb-3 font-light tracking-wide">
            見つけて · 共有して · 大好きになる
          </p>

          <p className="text-base text-gray-400 mb-12 max-w-xl mx-auto leading-relaxed">
            分享你珍藏的角色美图，发现更多心动瞬间
          </p>

          {/* CTA 按钮 */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/feed"
              className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 text-white rounded-2xl font-semibold text-lg shadow-xl shadow-purple-200/60 hover:shadow-2xl hover:shadow-purple-300/60 transition-all duration-300 overflow-hidden"
            >
              {/* 按钮光泽动效 */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <Sparkles className="w-5 h-5 relative z-10" />
              <span className="relative z-10">开始探索</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/70 backdrop-blur text-gray-600 rounded-2xl font-medium text-lg border-2 border-purple-100 hover:border-purple-300 hover:text-purple-500 hover:bg-white transition-all duration-300"
            >
              加入我们
            </Link>
          </div>

          {/* 底部统计小标签 */}
          <div className="flex items-center justify-center gap-8 mt-16 text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-pink-400 rounded-full" />
              原画 · 二创
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
              Cosplay
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
              随手拍
            </span>
          </div>
        </div>
      </section>

      {/* ===== 特性区 ===== */}
      <section className="relative py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
              ここが
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"> 楽しい </span>
              理由
            </h2>
            <p className="text-gray-400 text-sm">为什么大家喜欢天堂次元港</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: Heart,
                gradient: "from-pink-400 to-rose-400",
                shadow: "shadow-pink-200/50",
                bg: "bg-pink-50",
                title: "分享热爱",
                desc: "上传你最喜欢的二次元角色图片，原画、二创、Cosplay、随手拍，与同好分享你的每一次心动",
              },
              {
                icon: Star,
                gradient: "from-amber-400 to-orange-400",
                shadow: "shadow-orange-200/50",
                bg: "bg-amber-50",
                title: "发现精彩",
                desc: "探索海量精美图片，点赞收藏你喜欢的内容，找到与你品味相投的同好",
              },
              {
                icon: Users,
                gradient: "from-violet-400 to-purple-500",
                shadow: "shadow-purple-200/50",
                bg: "bg-purple-50",
                title: "连接同好",
                desc: "关注你感兴趣的创作者，在评论区畅聊互动，构建属于你的二次元圈子",
              },
            ].map((item, i) => (
              <div
                key={item.title}
                className={`group relative ${item.bg} rounded-3xl p-8 border-2 border-transparent hover:border-purple-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {/* 角标装饰 */}
                <div className="absolute top-4 right-4 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className={`w-full h-full bg-gradient-to-br ${item.gradient} rounded-lg rotate-12 opacity-10`} />
                </div>

                <div className={`w-14 h-14 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mb-5 shadow-lg ${item.shadow} group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {item.desc}
                </p>

                {/* hover 时底部渐变条 */}
                <div className={`absolute bottom-0 left-4 right-4 h-1 bg-gradient-to-r ${item.gradient} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

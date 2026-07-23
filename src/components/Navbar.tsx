"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Home, Search, PlusCircle, User, LogOut, Sparkles } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const user = session?.user;

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-purple-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* 左侧：Logo + 导航 */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            {/* Logo 图标 — 用渐变色方块代替 emoji */}
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-400 rounded-lg flex items-center justify-center shadow-sm shadow-purple-200 transition-transform group-hover:scale-110 duration-200">
              <Sparkles className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-pink-500 bg-clip-text text-transparent">
              天堂次元港
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/feed"
              className="flex items-center gap-1.5 px-3 py-1.5 text-gray-600 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all duration-200"
            >
              <Home className="w-4 h-4" />
              <span>首页</span>
            </Link>
            <Link
              href="/search"
              className="flex items-center gap-1.5 px-3 py-1.5 text-gray-600 hover:text-purple-500 hover:bg-purple-50 rounded-lg transition-all duration-200"
            >
              <Search className="w-4 h-4" />
              <span>探索</span>
            </Link>
          </nav>
        </div>

        {/* 右侧：用户操作 */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link
                href="/post/create"
                className="flex items-center gap-1.5 px-4 py-2 text-sm bg-gradient-to-r from-pink-400 to-pink-500 text-white rounded-xl hover:from-pink-500 hover:to-pink-600 shadow-md shadow-pink-200 transition-all duration-200 btn-hover-scale"
              >
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">发帖</span>
              </Link>

              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-purple-50 transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-sm overflow-hidden">
                    {user.image ? (
                      <img src={user.image} alt={user.name || ""} className="w-full h-full object-cover" />
                    ) : (
                      user.name?.charAt(0).toUpperCase() || "U"
                    )}
                  </div>
                  <span className="hidden sm:inline text-sm text-gray-700 font-medium">
                    {user.name}
                  </span>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg shadow-purple-100 border border-purple-50 py-1 z-50 page-enter-fast">
                    <div className="px-4 py-2.5 border-b border-purple-50">
                      <p className="text-sm font-medium text-gray-800">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                    <Link
                      href={`/user/${user.name}`}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 transition-colors"
                    >
                      <User className="w-4 h-4 text-blue-400" />
                      我的主页
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 transition-colors"
                    >
                      <User className="w-4 h-4 text-purple-400" />
                      设置
                    </Link>
                    <hr className="my-1 border-purple-50" />
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-50 transition-colors w-full"
                    >
                      <LogOut className="w-4 h-4" />
                      退出登录
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="px-4 py-2 text-sm text-gray-600 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all duration-200"
              >
                登录
              </Link>
              <Link
                href="/auth/register"
                className="px-5 py-2 text-sm bg-gradient-to-r from-blue-400 to-purple-500 text-white rounded-xl hover:from-blue-500 hover:to-purple-600 shadow-md shadow-blue-200 transition-all duration-200 btn-hover-scale"
              >
                注册
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

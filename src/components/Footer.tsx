import Link from "next/link";
import { Heart, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative bg-white/60 backdrop-blur border-t border-purple-100 py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* 左侧 */}
          <div className="flex items-center gap-2.5 text-gray-400 text-sm">
            <div className="w-5 h-5 bg-gradient-to-br from-blue-400 to-pink-400 rounded flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent font-medium">
              天堂次元港
            </span>
            <span className="mx-0.5 text-gray-300">—</span>
            <span>二次元爱好者的图片分享社区</span>
          </div>

          {/* 中间 */}
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <Link href="/" className="hover:text-blue-400 transition-colors">
              首页
            </Link>
            <Link href="/search" className="hover:text-purple-400 transition-colors">
              探索
            </Link>
            <Link href="/auth/register" className="hover:text-pink-400 transition-colors">
              加入我们
            </Link>
          </div>

          {/* 右侧 */}
          <div className="flex items-center gap-1.5 text-sm text-gray-400">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
            <span>© 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

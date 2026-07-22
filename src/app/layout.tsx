import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/SessionProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import PageTemplate from "./template";

export const metadata: Metadata = {
  title: "天堂次元港",
  description: "二次元爱好者图片分享社区 — 分享你最喜欢的二次元角色 ✨",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen flex flex-col relative">
        {/* 全局背景装饰 — 模糊光斑 */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute -top-40 -left-20 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -right-20 w-96 h-96 bg-pink-200/25 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 left-1/3 w-72 h-72 bg-blue-200/25 rounded-full blur-3xl" />
        </div>

        <SessionProvider>
          <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <PageTemplate>{children}</PageTemplate>
            </main>
            <Footer />
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}

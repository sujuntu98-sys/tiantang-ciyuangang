"use client";

import Link from "next/link";
import { Clock, TrendingUp } from "lucide-react";

interface HomeTabsProps {
  active: "latest" | "hot";
}

export function HomeTabs({ active }: HomeTabsProps) {
  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
      <Link
        href="/feed"
        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          active === "latest"
            ? "bg-white text-blue-500 shadow-sm"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        <Clock className="w-4 h-4" />
        最新
      </Link>
      <Link
        href="/feed?sort=hot"
        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          active === "hot"
            ? "bg-white text-pink-500 shadow-sm"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        <TrendingUp className="w-4 h-4" />
        热门
      </Link>
    </div>
  );
}

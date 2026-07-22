"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search as SearchIcon, X, TrendingUp } from "lucide-react";
import { PostCard } from "@/components/PostCard";
import { Suspense } from "react";

interface PostData {
  id: number;
  title: string;
  imageUrl: string;
  type: string;
  createdAt: string;
  user: { id: number; username: string; avatar: string | null };
  tags: { tag: { id: number; name: string } }[];
  _count: { likes: number; favorites: number; comments: number };
}

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [type, setType] = useState(searchParams.get("type") || "");
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const doSearch = useCallback(async (searchQuery: string, searchType: string, pageNum: number = 1) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    if (searchType) params.set("type", searchType);
    params.set("page", String(pageNum));
    params.set("limit", "20");

    try {
      const res = await fetch(`/api/search?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setPosts(pageNum === 1 ? data.posts : (prev) => [...prev, ...data.posts]);
        setTotal(data.pagination.total);
        setPage(pageNum);
      }
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => {
    const q = searchParams.get("q") || "";
    const t = searchParams.get("type") || "";
    setQuery(q);
    setType(t);
    doSearch(q, t);
  }, [searchParams, doSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (type) params.set("type", type);
    router.push(`/search?${params.toString()}`);
  };

  const handleClear = () => {
    setQuery("");
    setType("");
    router.push("/search");
  };

  const handleLoadMore = () => {
    doSearch(query, type, page + 1);
  };

  const typeOptions = [
    { value: "", label: "全部" },
    { value: "fanart", label: "二创" },
    { value: "official", label: "原画" },
    { value: "cosplay", label: "Cosplay" },
    { value: "snapshot", label: "随手拍" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* 搜索栏 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-6">
          <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            探索发现
          </span>
        </h1>

        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索帖子标题、描述..."
              className="w-full pl-11 pr-10 py-3 bg-white border-2 border-purple-100 rounded-xl text-gray-800 focus:border-purple-400 focus:outline-none transition-colors"
            />
            {(query || type) && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* 类型筛选 */}
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="px-4 py-3 bg-white border-2 border-purple-100 rounded-xl text-gray-600 text-sm focus:border-purple-400 focus:outline-none"
          >
            {typeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-blue-400 to-purple-500 text-white rounded-xl font-medium shadow-md shadow-purple-100 hover:shadow-lg transition-all duration-200"
          >
            搜索
          </button>
        </form>
      </div>

      {/* 结果 */}
      {loading && posts.length === 0 ? (
        <div className="text-center py-20 text-gray-400">搜索中...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20">
          <SearchIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400">
            {query || type ? "没有找到相关帖子" : "输入关键词开始探索吧"}
          </p>
          {query && (
            <p className="text-sm text-gray-300 mt-2">
              试试换个关键词？
            </p>
          )}
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-400 mb-5">
            找到 {total} 个帖子
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* 加载更多 */}
          {posts.length < total && (
            <div className="text-center mt-10">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-500 rounded-xl border border-gray-200 text-sm hover:border-purple-300 hover:text-purple-500 transition-all duration-200"
              >
                <TrendingUp className="w-4 h-4" />
                {loading ? "加载中..." : "加载更多"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-400">加载中...</div>}>
      <SearchContent />
    </Suspense>
  );
}

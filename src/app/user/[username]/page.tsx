import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Image as ImageIcon, Users, UserPlus } from "lucide-react";
import { PostCard } from "@/components/PostCard";
import { FollowButton } from "@/components/FollowButton";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const session = await auth();

  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      _count: { select: { posts: true, followers: true, following: true } },
      posts: {
        orderBy: { createdAt: "desc" },
        take: 20,
        include: {
          user: { select: { id: true, username: true, avatar: true } },
          tags: { include: { tag: true } },
          _count: { select: { likes: true, favorites: true, comments: true } },
        },
      },
    },
  });

  if (!user) notFound();

  // 检查是否已关注
  let isFollowing = false;
  if (session?.user) {
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: parseInt(session.user.id),
          followingId: user.id,
        },
      },
    });
    isFollowing = !!follow;
  }

  const isOwnProfile = session?.user && parseInt(session.user.id) === user.id;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* 用户信息卡片 */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-purple-100 border border-purple-50 p-6 md:p-8 mb-8">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          {/* 头像 */}
          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-400 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-purple-200 flex-shrink-0">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.username}
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              user.username.charAt(0).toUpperCase()
            )}
          </div>

          {/* 信息 */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-800">
                {user.username}
              </h1>
              {isOwnProfile ? (
                <Link
                  href="/settings"
                  className="px-3 py-1.5 text-xs text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  编辑资料
                </Link>
              ) : (
                <FollowButton
                  username={user.username}
                  initialFollowing={isFollowing}
                />
              )}
            </div>

            {user.bio && (
              <p className="text-gray-500 text-sm mb-4">{user.bio}</p>
            )}

            {/* 统计数据 */}
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <span className="flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4" />
                {user._count.posts} 帖子
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                {user._count.followers} 粉丝
              </span>
              <span className="flex items-center gap-1.5">
                <UserPlus className="w-4 h-4" />
                {user._count.following} 关注
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {new Date(user.createdAt).toLocaleDateString("zh-CN")} 加入
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 帖子列表 */}
      <h2 className="text-xl font-bold text-gray-800 mb-5">
        {isOwnProfile ? "我的帖子" : `${user.username} 的帖子`}
      </h2>

      {user.posts.length === 0 ? (
        <div className="text-center py-16 bg-white/60 rounded-2xl border border-purple-50">
          <p className="text-gray-400 text-sm">
            {isOwnProfile ? "你还没有发布过帖子" : "该用户还没有发布过帖子"}
          </p>
          {isOwnProfile && (
            <Link
              href="/post/create"
              className="inline-block mt-4 px-5 py-2.5 bg-gradient-to-r from-blue-400 to-purple-500 text-white rounded-xl text-sm font-medium"
            >
              发布第一帖
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {user.posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

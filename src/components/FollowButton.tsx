"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { UserPlus, UserCheck } from "lucide-react";

interface FollowButtonProps {
  username: string;
  initialFollowing: boolean;
}

export function FollowButton({ username, initialFollowing }: FollowButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  const handleFollow = async () => {
    if (!session?.user) {
      router.push("/auth/login");
      return;
    }
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/users/${username}/follow`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setFollowing(data.following);
      }
    } catch { /* ignore */ }
    setLoading(false);
  };

  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 btn-hover-scale ${
        following
          ? "bg-purple-50 text-purple-500 border-2 border-purple-200 hover:bg-purple-100"
          : "bg-gradient-to-r from-blue-400 to-purple-500 text-white shadow-md shadow-purple-200 hover:shadow-lg"
      }`}
    >
      {following ? (
        <>
          <UserCheck className="w-4 h-4" />
          已关注
        </>
      ) : (
        <>
          <UserPlus className="w-4 h-4" />
          关注
        </>
      )}
    </button>
  );
}

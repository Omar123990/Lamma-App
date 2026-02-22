import { useContext, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Spinner } from "@heroui/react";
import PostCard from "../components/post/PostCard";
import CreatePost from "../components/post/CreatePost";
import { useQuery } from "@tanstack/react-query";
import { getAllPosts } from "../services/postsAPI";
import { getCurrentUser } from "../services/authAPI";
import { AuthContext } from "../context/AuthContext";
import PostDetailModal from "../components/post/PostDetailModal";
import FollowSuggestions from "../components/home/FollowSuggestions";
import { Sparkles, Users } from "lucide-react";

export default function Home() {
  const { userData: contextUser } = useContext(AuthContext);

  const [searchParams, setSearchParams] = useSearchParams();
  const feedType = searchParams.get("feed") || "latest";

  const {
    data: posts,
    isLoading: isPostsLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: () => getAllPosts(200),
    staleTime: 1000 * 60 * 5,
  });

  const { data: apiUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    enabled: !!contextUser?._id,
  });

  const displayedPosts = useMemo(() => {
    if (!posts) return [];
    if (feedType === "latest") return posts;

    const actualUser =
      apiUser?.user ||
      apiUser?.data?.user ||
      apiUser?.data ||
      apiUser ||
      contextUser ||
      {};

    if (feedType === "following" && !actualUser._id) return [];

    const followingIds = (actualUser.following || []).map((f) =>
      String(f?._id || f),
    );
    const myId = String(actualUser._id);

    return posts.filter((post) => {
      if (!post || !post.user) return false;
      const postUserId = String(post.user?._id || post.user);

      return postUserId === myId || followingIds.includes(postUserId);
    });
  }, [posts, feedType, apiUser, contextUser]);

  return (
    <div className="space-y-6 w-full pb-28 relative">
      <CreatePost />

      <div className="lg:hidden">
        <FollowSuggestions layout="horizontal" />
      </div>

      {isPostsLoading ? (
        <div className="flex flex-col gap-4 justify-center items-center h-60 bg-white/10 dark:bg-black/10 backdrop-blur-md rounded-3xl border border-white/40 dark:border-white/10">
          <Spinner size="lg" color="secondary" />
        </div>
      ) : isError ? (
        <div className="text-center text-red-500 bg-red-500/10 border border-red-500/20 p-6 rounded-2xl">
          <p className="font-bold">Oops! {error?.message}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {displayedPosts.length > 0 ? (
            displayedPosts.map(
              (post) => post?._id && <PostCard key={post._id} post={post} />,
            )
          ) : (
            <div className="text-center py-16 bg-white/20 dark:bg-[#0f0f11]/40 backdrop-blur-xl rounded-3xl border border-white/40 dark:border-white/10 shadow-sm">
              <p className="text-gray-900 dark:text-white text-xl font-bold mb-2">
                {feedType === "following"
                  ? "No posts from following yet!"
                  : "Nothing here yet!"}
              </p>
              <p className="text-gray-500 text-sm">
                {feedType === "following"
                  ? "Follow more people to see their posts here."
                  : "Switch to 'Latest' or follow more people."}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-70 w-[90%] max-w-sm pointer-events-none">
        <div className="pointer-events-auto flex items-center justify-between p-1.5 backdrop-blur-2xl bg-white/80 dark:bg-[#0f0f11]/80 border border-gray-200 dark:border-white/10 shadow-[0_10px_40px_rgba(147,51,234,0.15)] rounded-full">
          <button
            onClick={() => setSearchParams({ feed: "latest" })}
            className={`flex-1 flex justify-center items-center gap-2 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
              feedType === "latest"
                ? "bg-purple-600 text-white shadow-lg shadow-purple-500/40 transform scale-[1.02]"
                : "text-gray-500 dark:text-gray-400 hover:text-purple-600 hover:bg-gray-100 dark:hover:bg-white/5"
            }`}
          >
            <Sparkles size={18} /> Latest
          </button>

          <button
            onClick={() => setSearchParams({ feed: "following" })}
            className={`flex-1 flex justify-center items-center gap-2 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
              feedType === "following"
                ? "bg-purple-600 text-white shadow-lg shadow-purple-500/40 transform scale-[1.02]"
                : "text-gray-500 dark:text-gray-400 hover:text-purple-600 hover:bg-gray-100 dark:hover:bg-white/5"
            }`}
          >
            <Users size={18} /> Following
          </button>
        </div>
      </div>

      <PostDetailModal />
    </div>
  );
}

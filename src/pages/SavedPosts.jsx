import { useQuery } from "@tanstack/react-query";
import { getSavedPosts } from "../services/postsAPI";
import PostCard from "../components/post/PostCard";
import { Spinner } from "@heroui/react";
import { Bookmark, Inbox } from "lucide-react";

export default function SavedPosts() {
  const { data: savedPosts, isLoading } = useQuery({
    queryKey: ["savedPosts"],
    queryFn: getSavedPosts,
  });

  return (
    <div className="space-y-6 w-full pb-10">
      <div className="flex items-center gap-3 bg-white/20 dark:bg-black/20 backdrop-blur-md p-4 rounded-3xl border border-white/40 dark:border-white/10 shadow-sm">
        <div className="p-3 bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded-2xl">
          <Bookmark size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Saved Posts
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            All your bookmarked posts in one place.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20 bg-white/10 dark:bg-black/10 backdrop-blur-md rounded-3xl border border-white/40 dark:border-white/10">
          <Spinner size="lg" color="warning" />
        </div>
      ) : savedPosts && savedPosts.length > 0 ? (
        <div className="flex flex-col gap-6">
          {savedPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-white/20 dark:bg-[#0f0f11]/40 backdrop-blur-xl rounded-3xl border border-white/40 dark:border-white/10 shadow-sm">
          <div className="bg-gray-100 dark:bg-black/30 p-6 rounded-full mb-4 border border-white/40 dark:border-white/5">
            <Inbox size={48} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            No saved posts yet
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm">
            When you see a post you want to keep, tap the bookmark icon to save
            it here.
          </p>
        </div>
      )}
    </div>
  );
}

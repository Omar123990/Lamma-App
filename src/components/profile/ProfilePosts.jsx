import { Spinner } from "@heroui/react";
import PostCard from "../post/PostCard";
import { Grid } from "lucide-react";

export default function ProfilePosts({ myPosts, isLoading }) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Spinner size="lg" color="secondary" />
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800 dark:text-white">
        <Grid size={20} /> My Posts
        <span className="text-sm font-normal text-gray-400">
          ({myPosts?.length || 0})
        </span>
      </h2>

      {myPosts && myPosts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {myPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-300 dark:border-white/10">
          <p className="text-gray-500">You haven't posted anything yet.</p>
        </div>
      )}
    </div>
  );
}

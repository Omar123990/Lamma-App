import { Spinner } from "@heroui/react";
import PostCard from "../components/post/PostCard";
import CreatePost from "../components/post/CreatePost";
import { useQuery } from "@tanstack/react-query";
import { getAllPosts } from "../services/postsAPI";
import PostDetailModal from "../components/post/PostDetailModal";

export default function Home() {

  const {
    data: posts,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['posts'],
    queryFn: getAllPosts,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <div className="container mx-auto max-w-2xl py-6 px-4">

      <div className="mb-8">
        <CreatePost />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-60">
          <Spinner size="lg" color="secondary" label="Loading posts..." />
        </div>
      ) : isError ? (
        <div className="text-center text-red-500 bg-red-500/10 p-4 rounded-xl">
          Error: {error?.message || "Something went wrong fetching posts."}
        </div>
      ) : (
        <div className="space-y-5">
          {posts && posts.length > 0 ? (
            posts.map((post) => {
              if (!post || !post._id) return null;
              return <PostCard key={post._id} post={post} />;
            })
          ) : (
            <p className="text-center text-gray-400">No posts found!</p>
          )}
        </div>
      )}
      <PostDetailModal />
    </div>
  );
}
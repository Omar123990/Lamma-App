import { useEffect, useContext } from "react";
import { Spinner } from "@heroui/react";
import PostCard from "../components/post/PostCard";
import { PostContext } from "../context/PostContext";
import CreatePost from "../components/post/CreatePost";

export default function Home() {
  const { posts, setPosts, getAllPosts, isLoading } = useContext(PostContext);

  useEffect(() => {
    if (posts.length === 0) {
      getAllPosts();
    }
  }, []);

  return (
    <div className="container mx-auto max-w-2xl py-6 px-4">

      <div className="mb-8">
        <CreatePost setPosts={setPosts} />
      </div>

      {isLoading && posts.length === 0 ? (
        <div className="flex justify-center items-center h-60">
          <Spinner size="lg" color="secondary" label="Loading posts..." />
        </div>
      ) : (
        <div className="space-y-5">
          {posts.length > 0 ? (
            posts.map((post) => {
              if (!post || !post._id) return null;

              return <PostCard key={post._id} post={post} />;
            })
          ) : (
            !isLoading && <p className="text-center text-gray-400">No posts found!</p>
          )}
        </div>
      )}
    </div>
  );
}
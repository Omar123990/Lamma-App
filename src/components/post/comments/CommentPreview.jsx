import { useQuery } from "@tanstack/react-query";
import { getPostComments } from "../../../services/postsAPI";
import { Avatar, Skeleton } from "@heroui/react";

export default function CommentPreview({ postId, onClick }) {

  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => getPostComments(postId),
    staleTime: 1000 * 60 * 5
  });

  if (isLoading) {
    return (
      <div className="flex gap-2 items-center px-4 pb-3 opacity-50">
        <div className="text-xs">↳</div>
        <Skeleton className="rounded-full w-6 h-6" />
        <Skeleton className="h-4 w-32 rounded-lg" />
      </div>
    );
  }

  if (!comments || comments.length === 0) return null;

  const latestComment = comments[comments.length - 1];

  const rawPhoto = latestComment.commentCreator?.photo;
  const commenterPhoto = (rawPhoto && !rawPhoto.includes("undefined"))
    ? rawPhoto
    : "https://linked-posts.routemisr.com/uploads/default-profile.png";

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        if (onClick) onClick();
      }}
      className="px-4 pb-3 cursor-pointer group"
    >
      <div className="flex gap-2 items-start opacity-80 group-hover:opacity-100 transition-opacity">
        <div className="mt-2 text-gray-400 dark:text-gray-500 text-[10px]">↳</div>

        <Avatar
          src={commenterPhoto}
          size="sm"
          className="w-6 h-6 mt-0.5 ring-1 ring-white/20"
          isBordered
        />

        <div className="
                bg-white/30 dark:bg-white/10 
                backdrop-blur-md 
                px-3 py-1.5 
                rounded-2xl rounded-tl-none 
                text-xs text-gray-800 dark:text-gray-200 
                border border-white/20 dark:border-white/5
                line-clamp-1 max-w-[85%]
                shadow-sm
            ">
          <span className="font-bold mr-1.5 text-black dark:text-white">
            {latestComment?.commentCreator?.name || "User"}
          </span>
          {latestComment.content}
        </div>
      </div>

      <p className="text-[10px] text-gray-500 dark:text-gray-400 pl-7 mt-1 group-hover:text-blue-400 transition-colors">
        View all {comments.length} comments...
      </p>
    </div>
  );
}
import { Button } from "@heroui/react";
import { Heart, MessageCircle } from "lucide-react";

export default function CommentActions({
  handleLike,
  isLiked,
  likesCount,
  setIsReplying,
  isReplying,
  isLikingComment,
}) {
  return (
    <div className="flex items-center gap-4 mt-1 ml-1">
      <button
        onClick={handleLike}
        disabled={isLikingComment}
        className={`flex items-center gap-1.5 text-[11px] font-semibold transition-colors ${
          isLiked
            ? "text-red-500"
            : "text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
        }`}
      >
        <Heart size={14} className={isLiked ? "fill-red-500" : ""} />
        <span>{likesCount > 0 ? likesCount : "Like"}</span>
      </button>

      <button
        onClick={() => setIsReplying(!isReplying)}
        className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors"
      >
        <MessageCircle size={14} />
        <span>Reply</span>
      </button>
    </div>
  );
}

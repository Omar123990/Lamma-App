import { Spinner } from "@heroui/react";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import toast from "react-hot-toast";

export default function PostActions({
  likes,
  isLiked,
  isLiking,
  onLike,
  onComment,
  postId,
  userName,
  postBody,
  showCommentBtn = true,
}) {
  const likesCount = likes?.length || 0;

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/?postId=${postId}`;
    const shareData = {
      title: `Post by ${userName}`,
      text: postBody?.substring(0, 50) + "...",
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success("Shared successfully! 🚀");
      } catch (err) {
        toast.error("Failed to share");
        console.log("Share cancelled");
        console.log(err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied! 📋");
      } catch (err) {
        console.log(err);
        toast.error("Failed to copy link");
      }
    }
  };

  return (
    <div className="flex gap-1 sm:gap-6 justify-between w-full pt-3 border-t border-gray-200/50 dark:border-white/10">
      <button
        disabled={isLiking}
        onClick={(e) => {
          e.stopPropagation();
          if (!isLiking) onLike();
        }}
        className={`flex cursor-pointer gap-2 items-center justify-center flex-1 py-2 rounded-lg transition-all group ${isLiking ? "opacity-70 cursor-wait" : "hover:bg-gray-100 dark:hover:bg-white/5"}`}
      >
        {isLiking ? (
          <Spinner size="sm" color="danger" />
        ) : (
          <Heart
            size={22}
            className={`transition-transform group-hover:scale-110 ${isLiked ? "fill-pink-500 text-pink-500" : "text-gray-500 dark:text-gray-400 group-hover:text-pink-500"}`}
          />
        )}
        <span
          className={`text-xs font-semibold hidden min-[350px]:block ${isLiked ? "text-pink-500" : "text-gray-500 dark:text-gray-400"}`}
        >
          {likesCount} {likesCount === 1 ? "Like" : "Likes"}
        </span>
        <span className="text-xs font-semibold block min-[350px]:hidden text-gray-500 dark:text-gray-400">
          {likesCount}
        </span>
      </button>

      {showCommentBtn && (
        <button
          onClick={onComment}
          className="flex cursor-pointer gap-2 items-center justify-center flex-1 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-all group"
        >
          <MessageCircle
            size={22}
            className="group-hover:scale-110 transition-transform"
          />
          <span className="text-xs font-semibold hidden min-[350px]:block">
            Comment
          </span>
        </button>
      )}

      <button
        onClick={(e) => {
          e.stopPropagation();
          handleShare();
        }}
        className="flex cursor-pointer gap-2 items-center justify-center flex-1 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-all group"
      >
        <Share2
          size={22}
          className="group-hover:scale-110 transition-transform"
        />
        <span className="text-xs font-semibold hidden min-[350px]:block">
          Share
        </span>
      </button>
    </div>
  );
}

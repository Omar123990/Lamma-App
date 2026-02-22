import { Avatar } from "@heroui/react";
import { formatDistanceToNow } from "date-fns";

export default function ReplyItem({ reply }) {
  const creator = reply.creator || reply.commentCreator || reply.user;

  const getUserPhoto = (photo) => {
    if (!photo || photo.includes("undefined"))
      return "https://linked-posts.routemisr.com/uploads/default-profile.png";
    if (photo.startsWith("http")) return photo;
    return `https://linked-posts.routemisr.com/${photo}`;
  };

  return (
    <div className="flex gap-2 group/reply animate-appearance-in mb-3 mt-1">
      <Avatar
        src={getUserPhoto(creator?.photo)}
        size="sm"
        className="w-6 h-6 mt-1 shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="bg-gray-50 dark:bg-white/5 p-2 rounded-xl inline-block min-w-25">
          <span className="font-bold text-xs block text-gray-900 dark:text-white mb-0.5">
            {creator?.name || "User"}
          </span>
          <p className="text-xs text-gray-600 dark:text-gray-300 whitespace-pre-wrap wrap-break-word">
            {reply.content}
          </p>
        </div>
        <div className="text-[10px] text-gray-400 mt-0.5 ml-1">
          {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
        </div>
      </div>
    </div>
  );
}

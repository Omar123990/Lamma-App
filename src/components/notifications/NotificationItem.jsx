import { Avatar } from "@heroui/react";
import {
  Check,
  Heart,
  MessageCircle,
  Share2,
  UserPlus,
  Bell,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const getNotificationImage = (photo) => {
  if (!photo || photo === "undefined" || photo.includes("undefined"))
    return "https://linked-posts.routemisr.com/uploads/default-profile.png";
  if (photo.startsWith("http")) return photo;
  return `https://linked-posts.routemisr.com/${photo}`;
};

const getActionIcon = (type = "") => {
  const t = type.toLowerCase();
  if (t.includes("like"))
    return <Heart size={14} className="text-red-500 fill-red-500" />;
  if (t.includes("comment"))
    return <MessageCircle size={14} className="text-blue-500 fill-blue-500" />;
  if (t.includes("share"))
    return <Share2 size={14} className="text-green-500" />;
  if (t.includes("follow"))
    return <UserPlus size={14} className="text-purple-500" />;
  return <Bell size={14} className="text-gray-500" />;
};

const getNotificationText = (type = "") => {
  const t = type.toLowerCase();
  if (t === "like_post" || t === "like") return "liked your post";
  if (t === "comment_post" || t === "comment") return "commented on your post";
  if (t === "share_post" || t === "share") return "shared your post";
  if (t === "follow") return "started following you";
  return "interacted with you";
};

export default function NotificationItem({
  notif,
  isLast,
  isMarkingOne,
  markingId,
  handleMarkOne,
}) {
  const sender = notif.actor || notif.user || {};
  const senderName = sender.name || "Someone";
  const senderPhoto = sender.photo;
  const notifType = notif.type || "";
  const isThisMarking = isMarkingOne && markingId === notif._id;

  return (
    <div
      className={`p-4 flex items-start gap-4 transition-colors ${!notif.isRead ? "bg-white/40 dark:bg-white/5" : "bg-transparent"} ${!isLast ? "border-b border-white/20 dark:border-white/5" : ""}`}
    >
      <div className="relative shrink-0 pt-1">
        <Avatar
          src={getNotificationImage(senderPhoto)}
          size="md"
          className="ring-2 ring-purple-500/30"
        />
      </div>

      <div className="flex-1 min-w-0 flex flex-col items-start">
        <p className="text-sm text-gray-800 dark:text-gray-100 mb-2 leading-relaxed">
          <span className="font-bold">{senderName}</span>{" "}
          {getNotificationText(notifType)}
        </p>

        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-white/50 dark:bg-black/40 flex items-center justify-center border border-white/20 dark:border-white/5">
            {getActionIcon(notifType)}
          </div>

          {!notif.isRead ? (
            <button
              onClick={() => handleMarkOne(notif._id)}
              disabled={isThisMarking}
              className="flex items-center cursor-pointer gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              <Check size={14} />{" "}
              {isThisMarking ? "Marking..." : "Mark as read"}
            </button>
          ) : (
            <span className="flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-500">
              <Check size={14} /> Read
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
          {notif.createdAt &&
            formatDistanceToNow(new Date(notif.createdAt), {
              addSuffix: false,
            }).replace("about ", "")}
        </span>
        {!notif.isRead && (
          <span className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
        )}
      </div>
    </div>
  );
}

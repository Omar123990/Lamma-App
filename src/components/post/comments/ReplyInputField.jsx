import { Avatar, Input, Spinner } from "@heroui/react";
import { Send } from "lucide-react";

export default function ReplyInputField({
  userData,
  creatorName,
  replyContent,
  setReplyContent,
  handleReply,
  isSendingReply,
}) {
  const userPhoto = userData?.photo?.includes("undefined")
    ? "https://linked-posts.routemisr.com/uploads/default-profile.png"
    : userData?.photo?.startsWith("http")
      ? userData.photo
      : `https://linked-posts.routemisr.com/${userData?.photo}`;

  return (
    <div className="mt-2 flex gap-2 items-center animate-appearance-in pl-2">
      <Avatar
        src={userPhoto}
        size="sm"
        className="w-6 h-6 shrink-0 ring-1 ring-purple-500/20"
      />
      <Input
        placeholder={`Reply to ${creatorName}...`}
        size="sm"
        variant="faded"
        radius="full"
        value={replyContent}
        onValueChange={setReplyContent}
        onKeyDown={(e) =>
          e.key === "Enter" && replyContent.trim() && handleReply()
        }
        endContent={
          <button
            onClick={handleReply}
            disabled={!replyContent.trim() || isSendingReply}
            className="text-purple-600 hover:text-purple-700 disabled:opacity-50 transition-colors p-1"
          >
            {isSendingReply ? (
              <Spinner size="sm" color="current" />
            ) : (
              <Send size={14} />
            )}
          </button>
        }
        classNames={{
          inputWrapper:
            "bg-white/40 dark:bg-black/20 hover:bg-white/60 dark:hover:bg-black/40 transition-colors border border-white/20 dark:border-white/5 shadow-sm",
        }}
      />
    </div>
  );
}

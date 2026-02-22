import {
  Avatar,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import {
  MoreVertical,
  Edit2,
  Trash2,
  UserPlus,
  UserCheck,
  Bookmark,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

export default function PostHeader({
  user,
  createdAt,
  isOwner,
  onEdit,
  onDelete,
  onFollow,
  isFollowing,
  isFollowingPending,
  onSave,
  isSaved,
  isSavingPending,
}) {
  const navigate = useNavigate();
  const authorPhoto =
    user?.photo && !user.photo.includes("undefined")
      ? user.photo
      : "https://linked-posts.routemisr.com/uploads/default-profile.png";

  const goToProfile = (e) => {
    e.stopPropagation();
    if (user?._id) navigate(`/profile/${user._id}`);
  };

  return (
    <div className="flex justify-between items-start px-4 pt-4">
      <div className="flex gap-3 items-center">
        <Avatar
          isBordered
          radius="full"
          size="md"
          src={authorPhoto}
          className="ring-2 ring-purple-500/30 cursor-pointer"
          onClick={goToProfile}
        />
        <div className="flex flex-col gap-0.5 items-start justify-center">
          <div className="flex items-center gap-2">
            <h4
              onClick={goToProfile}
              className="text-sm font-bold text-gray-800 dark:text-gray-100 hover:underline cursor-pointer"
            >
              {user?.name || "Anonymous"}
            </h4>

            {!isOwner && (
              <>
                <span className="text-gray-400 text-xs">•</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onFollow();
                  }}
                  disabled={isFollowingPending}
                  className={`text-xs font-semibold flex items-center gap-1 transition-colors ${
                    isFollowing
                      ? "text-gray-500 hover:text-red-500"
                      : "text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  }`}
                >
                  {isFollowingPending ? (
                    <span className="opacity-50">Wait...</span>
                  ) : isFollowing ? (
                    <>
                      <UserCheck size={14} /> Following
                    </>
                  ) : (
                    <>
                      <UserPlus size={14} /> Follow
                    </>
                  )}
                </button>
              </>
            )}
          </div>

          <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
            {createdAt &&
              formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </span>
        </div>
      </div>

      <Dropdown className="bg-white/80 dark:bg-[#27272a] backdrop-blur-md border border-gray-200 dark:border-white/10">
        <DropdownTrigger>
          <Button
            isIconOnly
            size="sm"
            variant="light"
            className="text-gray-500 hover:bg-black/5 dark:hover:bg-white/10 rounded-full"
          >
            <MoreVertical size={20} />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Post Actions" variant="flat">
          <DropdownItem
            key="save"
            startContent={
              <Bookmark
                size={16}
                className={
                  isSaved ? "fill-orange-500 text-orange-500" : "text-gray-500"
                }
              />
            }
            onPress={onSave}
          >
            {isSavingPending
              ? "Waiting..."
              : isSaved
                ? "Remove from Saved"
                : "Save Post"}
          </DropdownItem>

          {isOwner ? (
            <DropdownItem
              key="edit"
              startContent={<Edit2 size={16} />}
              onPress={onEdit}
            >
              Edit Post
            </DropdownItem>
          ) : null}

          {isOwner ? (
            <DropdownItem
              key="delete"
              className="text-danger"
              color="danger"
              startContent={<Trash2 size={16} />}
              onPress={onDelete}
            >
              Delete Post
            </DropdownItem>
          ) : null}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}

import { useState, useContext } from "react";
import { Avatar, Input, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { MoreVertical, Trash2, Edit2, X, Check } from "lucide-react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteComment, updateComment } from "../../../services/postsAPI";
import { AuthContext } from "../../../context/AuthContext";

export default function CommentItem({ comment, postId }) {
  const { userData } = useContext(AuthContext);
  const queryClient = useQueryClient();

  function formatTimeAgo(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  const creatorId = comment?.commentCreator?._id || comment?.commentCreator;
  const myId = userData?._id;
  const isOwner = myId === creatorId;

  const rawPhoto = comment.commentCreator?.photo;
  const commenterPhoto = (rawPhoto && !rawPhoto.includes("undefined"))
    ? rawPhoto
    : "https://linked-posts.routemisr.com/uploads/default-profile.png";

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(comment.content);

  const { mutate: remove, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteComment({ postId, commentId: comment._id }),
    onSuccess: () => {
      toast.success("Comment deleted");
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
    onError: () => toast.error("Failed to delete")
  });

  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationFn: () => updateComment({ postId, commentId: comment._id, content: editValue }),
    onSuccess: () => {
      toast.success("Comment updated");
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
    onError: () => toast.error("Failed to update")
  });

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    if (editValue.trim() && editValue !== comment.content) {
      update();
    } else {
      setIsEditing(false);
    }
  };

  return (
    <div className={`flex gap-3 group ${isDeleting ? "opacity-50 pointer-events-none" : ""}`}>

      <Avatar
        src={commenterPhoto}
        className="w-8 h-8 flex-shrink-0 mt-1"
        isBordered
        color="default"
      />

      <div className="flex-1">
        <div className="bg-gray-100 shadow dark:shadow-none p-3 dark:bg-gray-900/50 text-white dark:text-gray-100 rounded-2xl rounded-tl-none border border-white/5 relative hover:border-white/10 transition-colors">

          <div className="flex justify-between items-start mb-1">
            <span className="font-bold text-sm text-gray-900 dark:text-white">
              {comment.commentCreator?.name || "User"}
            </span>

            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-500 dark:text-white font-medium">
                {formatTimeAgo(comment.createdAt)}
              </span>

              {isOwner && !isEditing && (
                <Dropdown className="bg-[#18181b] border border-white/10 dark">
                  <DropdownTrigger>
                    <button className="text-gray-500 dark:text-white hover:text-gray-900 dark:hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer outline-none">
                      <MoreVertical size={14} />
                    </button>
                  </DropdownTrigger>
                  <DropdownMenu variant="faded" aria-label="Comment Actions">
                    <DropdownItem
                      key="edit"
                      startContent={<Edit2 size={14} />}
                      onPress={() => setIsEditing(true)}
                    >
                      Edit
                    </DropdownItem>
                    <DropdownItem
                      key="delete"
                      className="text-danger"
                      color="danger"
                      startContent={<Trash2 size={14} />}
                      onPress={() => remove()}
                    >
                      Delete
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              )}
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdateSubmit} className="flex gap-2 items-center mt-2 animate-in fade-in">
              <Input
                autoFocus
                size="sm"
                value={editValue}
                onValueChange={setEditValue}
                className="text-white"
                classNames={{ inputWrapper: "bg-black/20 h-8 border-white/20" }}
              />
              <button type="submit" disabled={isUpdating} className="text-green-500 hover:bg-green-500/10 p-1.5 rounded cursor-pointer">
                <Check size={16} />
              </button>
              <button type="button" onClick={() => setIsEditing(false)} className="text-red-500 hover:bg-red-500/10 p-1.5 rounded cursor-pointer">
                <X size={16} />
              </button>
            </form>
          ) : (
            <p className="text-sm text-gray-900 dark:text-white mt-0.5 whitespace-pre-wrap leading-relaxed dir-auto">
              {comment.content}
            </p>
          )}

        </div>
      </div>
    </div>
  );
}
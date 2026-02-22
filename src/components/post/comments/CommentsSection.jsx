import { useState, useContext } from "react";
import { Avatar, Spinner, Input } from "@heroui/react";
import { Send } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPostComments, addComment } from "../../../services/postsAPI";
import { getCurrentUser } from "../../../services/authAPI";
import { AuthContext } from "../../../context/AuthContext";
import toast from "react-hot-toast";
import CommentItem from "./CommentItem";

export default function CommentSection({ postId }) {
  const { userData: contextUser } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");

  const { data: apiUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });

  const actualUser =
    apiUser?.user ||
    apiUser?.data?.user ||
    apiUser?.data ||
    apiUser ||
    contextUser ||
    {};

  const { data: comments, isLoading } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => getPostComments(postId),
    enabled: !!postId,
  });

  const { mutate: handleAdd, isPending: isAdding } = useMutation({
    mutationFn: () => {
      if (!postId) throw new Error("No Post ID");
      return addComment({ postId, content });
    },
    onSuccess: () => {
      setContent("");
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Comment added! 💬");
    },
    onError: () => toast.error("Failed to add comment"),
  });

  const getUserPhoto = (photo) => {
    if (
      !photo ||
      String(photo).includes("undefined") ||
      String(photo).includes("null")
    )
      return "https://linked-posts.routemisr.com/uploads/default-profile.png";
    if (photo.startsWith("http")) return photo;
    return `https://linked-posts.routemisr.com/${photo}`;
  };

  const myPhoto = getUserPhoto(actualUser?.photo);

  return (
    <div className="flex flex-col h-full bg-transparent">
      <div className="flex-1 p-2 sm:p-4 space-y-4 max-h-100 overflow-y-auto custom-scrollbar">
        {isLoading ? (
          <div className="flex justify-center py-6">
            <Spinner size="md" color="secondary" />
          </div>
        ) : comments && comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              postId={postId}
              userData={actualUser}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-gray-500">
            <p className="text-sm font-semibold">No comments yet</p>
            <p className="text-xs mt-1">
              Be the first to share your thoughts! 💬
            </p>
          </div>
        )}
      </div>

      <div className="p-3 mt-2 border-t border-gray-200/50 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-md rounded-2xl flex gap-3 items-center">
        <Avatar
          src={myPhoto}
          size="sm"
          className="shrink-0 ring-2 ring-purple-500/20"
        />
        <Input
          placeholder="Write a comment..."
          variant="faded"
          radius="full"
          value={content}
          onValueChange={setContent}
          onKeyDown={(e) => e.key === "Enter" && content.trim() && handleAdd()}
          endContent={
            <button
              onClick={() => content.trim() && handleAdd()}
              disabled={isAdding || !content.trim()}
              className="text-purple-600 hover:text-purple-700 disabled:opacity-50 transition-colors p-1"
            >
              {isAdding ? (
                <Spinner size="sm" color="current" />
              ) : (
                <Send size={18} />
              )}
            </button>
          }
          classNames={{
            inputWrapper:
              "bg-white/60 dark:bg-[#18181b]/60 hover:bg-white dark:hover:bg-[#18181b] transition-colors border-none shadow-sm",
          }}
        />
      </div>
    </div>
  );
}

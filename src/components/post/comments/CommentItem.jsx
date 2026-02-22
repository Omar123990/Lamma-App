import { useState } from "react";
import { Avatar } from "@heroui/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteComment,
  updateComment,
  addReply,
  toggleCommentLike,
  getCommentReplies,
} from "../../../services/postsAPI";
import toast from "react-hot-toast";

import CommentBody from "./CommentBody";
import CommentActions from "./CommentActions";
import ReplyInputField from "./ReplyInputField";
import RepliesList from "./RepliesList";

export default function CommentItem({ comment, postId, userData }) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [replyContent, setReplyContent] = useState("");

  const creator = comment.creator || comment.commentCreator;
  const isMyComment = userData?._id === creator?._id;
  const isLiked = comment.likes?.includes(userData?._id);
  const likesCount = comment.likes?.length || 0;

  const repliesCount = comment.repliesCount || comment.replies?.length || 0;

  const { data: repliesData, isLoading: isLoadingReplies } = useQuery({
    queryKey: ["replies", comment._id],
    queryFn: () => getCommentReplies(postId, comment._id),
    enabled: showReplies,
    staleTime: 5 * 60 * 1000,
  });

  const { mutate: handleEdit, isPending: isSavingEdit } = useMutation({
    mutationFn: () =>
      updateComment({ postId, commentId: comment._id, content: editContent }),
    onSuccess: () => {
      toast.success("Updated ✨");
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
    onError: () => toast.error("Failed to update"),
  });

  const { mutate: handleDelete } = useMutation({
    mutationFn: () => deleteComment({ postId, commentId: comment._id }),
    onSuccess: () => {
      toast.success("Deleted 🗑️");
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: () => toast.error("Failed to delete"),
  });

  const { mutate: handleLike, isPending: isLikingComment } = useMutation({
    mutationFn: () => toggleCommentLike({ postId, commentId: comment._id }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["comments", postId] }),
    onError: () => toast.error("Like failed"),
  });

  const { mutate: handleReply, isPending: isSendingReply } = useMutation({
    mutationFn: () =>
      addReply({ postId, commentId: comment._id, content: replyContent }),
    onSuccess: () => {
      toast.success("Reply added ↩️");
      setReplyContent("");
      setIsReplying(false);
      setShowReplies(true);
      queryClient.invalidateQueries({ queryKey: ["replies", comment._id] });
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
    onError: () => toast.error("Failed to reply"),
  });

  const shouldShowReplies = repliesCount > 0 || showReplies || isReplying;

  const getUserPhoto = (photo) => {
    if (!photo || photo.includes("undefined"))
      return "https://linked-posts.routemisr.com/uploads/default-profile.png";
    if (photo.startsWith("http")) return photo;
    return `https://linked-posts.routemisr.com/${photo}`;
  };

  return (
    <div className="flex gap-3 mb-2 group animate-appearance-in">
      <div className="flex flex-col items-center">
        <Avatar
          src={getUserPhoto(creator?.photo)}
          size="sm"
          className="mt-1 shrink-0 z-10"
        />
        {showReplies && repliesData?.length > 0 && (
          <div className="w-px h-full bg-gray-200 dark:bg-white/10 mt-1 mb-2"></div>
        )}
      </div>

      <div className="flex-1 min-w-0 pb-3">
        <CommentBody
          comment={comment}
          isEditing={isEditing}
          editContent={editContent}
          setEditContent={setEditContent}
          handleEdit={handleEdit}
          setIsEditing={setIsEditing}
          isSavingEdit={isSavingEdit}
          isMyComment={isMyComment}
          handleDelete={handleDelete}
        />

        <CommentActions
          comment={comment}
          handleLike={handleLike}
          isLiked={isLiked}
          likesCount={likesCount}
          setIsReplying={setIsReplying}
          isReplying={isReplying}
          isLikingComment={isLikingComment}
        />

        {isReplying && (
          <div className="mt-2 pl-2 border-l-2 border-purple-500/30">
            <ReplyInputField
              userData={userData}
              creatorName={creator?.name}
              replyContent={replyContent}
              setReplyContent={setReplyContent}
              handleReply={handleReply}
              isSendingReply={isSendingReply}
            />
          </div>
        )}

        <RepliesList
          shouldShow={shouldShowReplies}
          showReplies={showReplies}
          setShowReplies={setShowReplies}
          isLoading={isLoadingReplies}
          repliesData={repliesData}
          repliesCount={repliesCount}
        />
      </div>
    </div>
  );
}

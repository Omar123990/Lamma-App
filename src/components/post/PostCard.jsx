import { useContext, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Card,
  CardFooter,
  useDisclosure,
  Modal,
  ModalContent,
  ModalBody,
} from "@heroui/react";
import { AuthContext } from "../../context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deletePost,
  updatePost,
  toggleLike,
  toggleFollowUser,
  toggleSavePost,
} from "../../services/postsAPI";
import { getCurrentUser } from "../../services/authAPI";
import toast from "react-hot-toast";
import PostHeader from "./card/PostHeader";
import PostBody from "./card/PostBody";
import PostActions from "./card/PostActions";
import { DeletePostModal, EditPostModal } from "./card/PostModals";
import CommentPreview from "./comments/CommentPreview";

export default function PostCard({ post, disableModal = false }) {
  const { userData: contextUser, userToken } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [, setSearchParams] = useSearchParams();

  const deleteModal = useDisclosure();
  const editModal = useDisclosure();
  const imageModal = useDisclosure();

  const { data: apiUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    enabled: !!userToken,
  });

  const fullUserData = apiUser || contextUser;

  const actualIsFollowing =
    fullUserData?.following?.some(
      (f) => f === post?.user?._id || f?._id === post?.user?._id,
    ) || false;

  const actualIsSaved =
    fullUserData?.bookmarks?.some(
      (b) => b === post?._id || b?._id === post?._id,
    ) || false;

  const [optimisticFollow, setOptimisticFollow] = useState(null);
  const [optimisticSave, setOptimisticSave] = useState(null);

  const isFollowingLocal =
    optimisticFollow !== null ? optimisticFollow : actualIsFollowing;
  const isSavedLocal = optimisticSave !== null ? optimisticSave : actualIsSaved;

  let postImage =
    post?.image || post?.imgUrl || post?.cover || post?.photo || null;
  if (postImage && !postImage.startsWith("http")) {
    postImage = `https://linked-posts.routemisr.com/${postImage}`;
  }

  const [editContent, setEditContent] = useState(post?.body || "");
  const [editImage, setEditImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(postImage);
  const [prevBody, setPrevBody] = useState(post?.body || "");

  const { mutate: handleDelete, isPending: isDeleting } = useMutation({
    mutationFn: () => deletePost(post?._id),
    onSuccess: () => {
      toast.success("Deleted 🗑️");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      deleteModal.onOpenChange(false);
    },
  });

  const { mutate: handleEdit, isPending: isEditing } = useMutation({
    mutationFn: () => {
      const formData = new FormData();
      formData.append("body", editContent);
      if (editImage) formData.append("image", editImage);
      return updatePost({ postId: post?._id, formData });
    },
    onSuccess: () => {
      toast.success("Updated ✨");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      editModal.onOpenChange(false);
    },
  });

  const { mutate: handleLikeMutation, isPending: isLiking } = useMutation({
    mutationFn: () => toggleLike(post?._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    },
  });

  const { mutate: handleFollow, isPending: isFollowingPending } = useMutation({
    mutationFn: () => toggleFollowUser(post?.user?._id),
    onMutate: () => {
      setOptimisticFollow(!isFollowingLocal);
    },
    onSuccess: () => {
      setOptimisticFollow(null);
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      toast.success(
        !actualIsFollowing ? "Followed successfully! 🤝" : "Unfollowed",
      );
    },
    onError: () => {
      setOptimisticFollow(null);
      toast.error("Failed to update follow status");
    },
  });

  const { mutate: handleSave, isPending: isSavingPending } = useMutation({
    mutationFn: () => toggleSavePost(post?._id),
    onMutate: () => {
      setOptimisticSave(!isSavedLocal);
    },
    onSuccess: () => {
      setOptimisticSave(null);
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["savedPosts"] });
      toast.success(
        !actualIsSaved ? "Post Saved! 🔖" : "Removed from bookmarks",
      );
    },
    onError: () => {
      setOptimisticSave(null);
      toast.error("Failed to save post");
    },
  });

  if (post && post.body !== prevBody) {
    setPrevBody(post.body);
    setEditContent(post.body);
    setPreviewImage(postImage);
  }

  if (!post) return null;

  const { user, body, createdAt, _id, likes } = post;

  const isLiked =
    fullUserData &&
    likes?.some(
      (id) => id === fullUserData._id || id?._id === fullUserData._id,
    );
  const isOwner = fullUserData?._id === user?._id;

  const handleOpenPost = () => {
    if (!disableModal) setSearchParams({ postId: _id });
  };

  const handleImageClick = (e) => {
    e.stopPropagation();
    imageModal.onOpen();
  };

  return (
    <>
      <Card
        className={`w-full mb-6 bg-white/10 dark:bg-black/10 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/20 dark:hover:bg-black/20 ${disableModal ? "cursor-pointer" : ""} ${isEditing || isDeleting ? "opacity-50 pointer-events-none" : ""}`}
      >
        <PostHeader
          user={user}
          createdAt={createdAt}
          isOwner={isOwner}
          onEdit={editModal.onOpen}
          onDelete={deleteModal.onOpen}
          onFollow={handleFollow}
          isFollowing={isFollowingLocal}
          isFollowingPending={isFollowingPending}
          onSave={handleSave}
          isSaved={isSavedLocal}
          isSavingPending={isSavingPending}
        />

        <PostBody
          body={body}
          postImage={postImage}
          onOpenPost={handleOpenPost}
          onImageClick={handleImageClick}
        />

        <CardFooter className="gap-3 px-4 pb-4 pt-2 flex flex-col items-stretch">
          <PostActions
            likes={likes}
            isLiked={isLiked}
            isLiking={isLiking}
            onLike={handleLikeMutation}
            onComment={handleOpenPost}
            postId={_id}
            userName={user?.name}
            postBody={body}
          />
          {!disableModal && (
            <CommentPreview postId={_id} onClick={handleOpenPost} />
          )}
        </CardFooter>
      </Card>

      <Modal
        isOpen={imageModal.isOpen}
        onOpenChange={imageModal.onOpenChange}
        size="4xl"
        backdrop="blur"
        classNames={{
          base: "bg-transparent shadow-none",
          closeButton:
            "top-0 right-0 z-50 text-white bg-black/50 hover:bg-black rounded-full m-2",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <ModalBody className="p-0 flex justify-center items-center overflow-hidden">
              <img
                src={postImage}
                alt="Post Attachment"
                className="max-w-full max-h-[90vh] object-contain rounded-xl cursor-zoom-out"
                onClick={onClose}
              />
            </ModalBody>
          )}
        </ModalContent>
      </Modal>

      <DeletePostModal
        isOpen={deleteModal.isOpen}
        onOpenChange={deleteModal.onOpenChange}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />
      <EditPostModal
        isOpen={editModal.isOpen}
        onOpenChange={editModal.onOpenChange}
        onEdit={handleEdit}
        isEditing={isEditing}
        editContent={editContent}
        setEditContent={setEditContent}
        editImage={editImage}
        setEditImage={setEditImage}
        previewImage={previewImage}
        setPreviewImage={setPreviewImage}
      />
    </>
  );
}

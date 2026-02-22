import { useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { Modal, ModalContent, ModalBody, Spinner, Button } from "@heroui/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSinglePost, toggleLike } from "../../services/postsAPI";
import { AuthContext } from "../../context/AuthContext";
import { X } from "lucide-react";
import toast from "react-hot-toast";

import PostHeader from "./card/PostHeader";
import PostBody from "./card/PostBody";
import PostActions from "./card/PostActions";
import CommentSection from "./comments/CommentsSection";

export default function PostDetailModal() {
  const [searchParams, setSearchParams] = useSearchParams();
  const postId = searchParams.get("postId");
  const { userData } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const { data: post, isLoading } = useQuery({
    queryKey: ["singlePost", postId],
    queryFn: () => getSinglePost(postId),
    enabled: !!postId,
  });

  const { mutate: handleLikeMutation, isPending: isLiking } = useMutation({
    mutationFn: () => toggleLike(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["singlePost", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: () => toast.error("Like failed"),
  });

  const handleClose = () => {
    setSearchParams({});
  };

  if (!postId) return null;

  return (
    <Modal
      isOpen={!!postId}
      onOpenChange={handleClose}
      size="3xl"
      scrollBehavior="inside"
      backdrop="blur"
      placement="center"
      hideCloseButton
      classNames={{
        base: "bg-white/90 dark:bg-[#0f0f11]/90 backdrop-blur-2xl border border-gray-200 dark:border-white/10 shadow-[0_20px_60px_rgba(147,51,234,0.15)] rounded-3xl overflow-hidden",
        body: "p-0",
      }}
    >
      <ModalContent>
        {() => (
          <ModalBody className="flex flex-col max-h-[85vh] relative">
            <Button
              isIconOnly
              size="sm"
              radius="full"
              variant="flat"
              onPress={handleClose}
              className="absolute top-4 right-4 z-50 bg-gray-200/50 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 text-gray-700 dark:text-gray-300 backdrop-blur-md"
            >
              <X size={18} />
            </Button>

            {isLoading || !post ? (
              <div className="flex flex-col h-[50vh] items-center justify-center gap-4">
                <Spinner size="lg" color="secondary" />
                <p className="text-gray-500 dark:text-gray-400 text-sm animate-pulse">
                  Loading post details...
                </p>
              </div>
            ) : (
              <div className="flex flex-col h-full overflow-hidden">
                <div className="p-5 border-b border-gray-100 dark:border-white/5 bg-white/50 dark:bg-black/20 shrink-0">
                  <PostHeader
                    user={post.user || post.creator}
                    createdAt={post.createdAt}
                    isOwner={false}
                    onEdit={() => {}}
                    onDelete={() => {}}
                  />
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
                  <div className="px-5 py-4">
                    <PostBody
                      body={post.body}
                      postImage={post.image || post.imgUrl}
                    />
                  </div>

                  <div className="px-5 pb-4 border-b border-gray-100 dark:border-white/5 shrink-0">
                    <PostActions
                      likes={post.likes}
                      isLiked={
                        userData &&
                        post.likes?.some(
                          (id) =>
                            id === userData._id || id?._id === userData._id,
                        )
                      }
                      isLiking={isLiking}
                      onLike={handleLikeMutation}
                      onComment={() => {}}
                      postId={post._id}
                      userName={post.user?.name}
                      postBody={post.body}
                      showCommentBtn={false}
                    />
                  </div>

                  <div className="flex-1 bg-gray-50/50 dark:bg-black/20 p-2 sm:p-5">
                    <CommentSection postId={post._id} />
                  </div>
                </div>
              </div>
            )}
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
}

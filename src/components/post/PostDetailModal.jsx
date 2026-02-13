import { useSearchParams } from "react-router-dom";
import { Modal, ModalContent, ModalBody, Spinner } from "@heroui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import PostCard from "./PostCard";
import CommentsSection from "./comments/CommentsSection";

const getSinglePost = async (postId) => {
  const token = localStorage.getItem("userToken");
  if (!postId) return null;
  const { data } = await axios.get(`https://linked-posts.routemisr.com/posts/${postId}`, { headers: { token } });
  return data.post;
};

export default function PostDetailModal() {
  const [searchParams, setSearchParams] = useSearchParams();
  const postId = searchParams.get("postId");
  const isOpen = !!postId;

  const queryClient = useQueryClient();

  const { data: post, isLoading } = useQuery({
    queryKey: ['singlePost', postId],
    queryFn: () => getSinglePost(postId),
    enabled: isOpen,
    staleTime: 1000 * 60 * 5,
    initialData: () => {
      const allPosts = queryClient.getQueryData(['posts']);
      return allPosts?.find(p => p._id === postId);
    }
  });

  const handleClose = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("postId");
    setSearchParams(newParams);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="4xl"
      backdrop="blur"
      scrollBehavior="inside"
      classNames={{
        base: "bg-white dark:bg-[#18181b] border border-gray-200 dark:border-white/10 shadow-2xl h-[90vh] max-h-[800px] overflow-hidden",
        closeButton: "z-50 cursor-pointer top-4 right-4 bg-gray-100 dark:bg-black/50 hover:bg-gray-200 dark:hover:bg-white/20 text-black dark:text-white p-2 rounded-full",
        body: "p-0",
        backdrop: "bg-black/20 backdrop-blur-sm"
      }}
    >
      <ModalContent>
        <ModalBody className="p-0 flex flex-row overflow-hidden h-full">

          {isLoading && !post ? (
            <div className="w-full h-full flex justify-center items-center bg-white dark:bg-[#18181b]">
              <Spinner size="lg" color="secondary" />
            </div>
          ) : post ? (
            <div className="flex flex-col md:flex-row w-full h-full">

              <div className="w-full md:w-[60%] overflow-y-auto p-4 border-b md:border-b-0 md:border-r border-gray-200 dark:border-white/10 custom-scrollbar bg-gray-50 dark:bg-black/20">
                <PostCard post={post} disableModal={true} />
              </div>

              <div className="w-full md:w-[40%] bg-white dark:bg-[#18181b] flex flex-col h-full relative">

                <div className="p-4 border-b border-gray-200 dark:border-white/10 shadow-sm z-10 bg-white dark:bg-[#18181b]">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">Comments</h3>
                </div>

                <div className="flex-1 overflow-hidden relative">
                  <CommentsSection postId={postId} />
                </div>

              </div>

            </div>
          ) : (
            <div className="p-10 text-center text-red-400 w-full m-auto">Post not found</div>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
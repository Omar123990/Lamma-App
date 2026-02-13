import { useState, useContext } from "react";
import { Spinner, useDisclosure } from "@heroui/react";
import toast from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../context/AuthContext";
import { getCurrentUser } from "../services/authAPI";
import { getUserPosts, updatePost } from "../services/postsAPI";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileAbout from "../components/profile/ProfileAbout";
import ProfilePosts from "../components/profile/ProfilePosts";
import { EditModal } from "../components/profile/PostModals";
import PostDetailModal from "../components/post/PostDetailModal";

export default function Profile() {
  const { userToken } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const [selectedPost, setSelectedPost] = useState(null);

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onOpenChange: onEditChange,
    onClose: onEditClose
  } = useDisclosure();

  const { data: userProfile, isLoading: loadingProfile } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    enabled: !!userToken
  });

  const { data: myPosts, isLoading: loadingPosts } = useQuery({
    queryKey: ['posts', userProfile?._id],
    queryFn: () => getUserPosts(userProfile?._id),
    enabled: !!userProfile?._id
  });

  const { mutate: handleUpdate, isPending: isUpdating } = useMutation({
    mutationFn: updatePost,
    onSuccess: () => {
      toast.success("Post updated successfully ✨");
      onEditClose();
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Failed to update post");
    }
  });

  const handleOpenEdit = (post) => {
    setSelectedPost(post);
    onEditOpen();
  };

  const handleConfirmEdit = (newBody, newImageFile) => {
    const formData = new FormData();
    formData.append("body", newBody);
    if (newImageFile) {
      formData.append("image", newImageFile);
    }

    handleUpdate({ postId: selectedPost._id, formData });
  };

  if (loadingProfile) {
    return <div className="flex justify-center items-center h-screen"><Spinner size="lg" color="secondary" /></div>;
  }

  if (!userProfile) return <div className="text-white text-center mt-10">Failed to load profile</div>;

  return (
    <div className="container mx-auto max-w-4xl py-6 px-4 space-y-6">

      <ProfileHeader
        userInfo={userProfile}
        myPostsCount={myPosts?.length || 0}
      />

      <ProfileAbout userInfo={userProfile} />

      <ProfilePosts
        myPosts={myPosts}
        isLoading={loadingPosts}
        onEdit={handleOpenEdit}
      />

      <EditModal
        isOpen={isEditOpen}
        onClose={onEditChange}
        onConfirm={handleConfirmEdit}
        post={selectedPost}
        isProcessing={isUpdating}
      />

      <PostDetailModal />

    </div>
  );
}
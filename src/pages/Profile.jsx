import { useEffect, useContext, useState } from "react";
import axios from "axios";
import { Spinner, useDisclosure } from "@heroui/react";
import toast from "react-hot-toast";

import { AuthContext } from "../context/AuthContext";

import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileAbout from "../components/profile/ProfileAbout";
import ProfilePosts from "../components/profile/ProfilePosts";
import { DeleteModal, EditModal } from "../components/profile/PostModals";

export default function Profile() {
  const {
    userProfile, setUserProfile,
    myPosts, setMyPosts,
    getProfileData, isLoadingProfile
  } = useContext(AuthContext);

  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteChange, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditChange, onClose: onEditClose } = useDisclosure();

  const [selectedPost, setSelectedPost] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    getProfileData();
  }, []);

  const handleOpenDelete = (post) => {
    setSelectedPost(post);
    onDeleteOpen();
  };

  const handleConfirmDelete = async () => {
    setIsProcessing(true);
    const loadingToast = toast.loading("Deleting post...");
    try {
      const token = localStorage.getItem("userToken");
      await axios.delete(`https://linked-posts.routemisr.com/posts/${selectedPost._id}`, { headers: { token } });

      setMyPosts(prev => prev.filter(post => post._id !== selectedPost._id));

      toast.success("Deleted post successfully", { id: loadingToast });
      onDeleteClose();
    } catch (error) {
      toast.error("Failed to delete post", { id: loadingToast });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOpenEdit = (post) => {
    setSelectedPost(post);
    onEditOpen();
  };

  const handleConfirmEdit = async (newBody, newImageFile) => {
    setIsProcessing(true);
    const loadingToast = toast.loading("Saving changes...");

    try {
      const token = localStorage.getItem("userToken");
      const formData = new FormData();
      formData.append("body", newBody);

      if (newImageFile) {
        formData.append("image", newImageFile);
      }

      const { data } = await axios.put(`https://linked-posts.routemisr.com/posts/${selectedPost._id}`, formData, {
        headers: { token, "Content-Type": "multipart/form-data" }
      });

      if (data.message === "success") {
        const updatedPost = data.post || data.data;

        const finalPost = {
          ...updatedPost,
          user: selectedPost.user || userProfile
        };

        setMyPosts(prev => prev.map(p => p._id === selectedPost._id ? finalPost : p));

        toast.success("Updated post successfully", { id: loadingToast });
        onEditClose();
      }

    } catch (error) {
      console.error(error);
      toast.error("Failed to update post", { id: loadingToast });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoadingProfile && !userProfile) {
    return <div className="flex justify-center items-center h-screen"><Spinner size="lg" color="secondary" /></div>;
  }

  if (!userProfile) return <div className="text-white text-center mt-10">Failed to load user data</div>;

  return (
    <div className="container mx-auto max-w-4xl py-6 px-4 space-y-6">

      <ProfileHeader
        userInfo={userProfile}
        setUserInfo={setUserProfile}
        myPostsCount={myPosts.length}
      />

      <ProfileAbout userInfo={userProfile} />

      <ProfilePosts
        myPosts={myPosts}
        isLoading={isLoadingProfile}
        onDelete={handleOpenDelete}
        onEdit={handleOpenEdit}
      />

      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={onDeleteChange}
        onConfirm={handleConfirmDelete}
        isProcessing={isProcessing}
      />

      <EditModal
        isOpen={isEditOpen}
        onClose={onEditChange}
        onConfirm={handleConfirmEdit}
        post={selectedPost}
        isProcessing={isProcessing}
      />

    </div>
  );
}
import { useState, useRef } from "react";
import { Avatar, Button, useDisclosure, Spinner } from "@heroui/react";
import {
  Settings,
  Calendar,
  UserPlus,
  UserCheck,
  MessageCircle,
  Camera,
} from "lucide-react";
import { format } from "date-fns";
import SettingsModal from "./SettingsModal";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toggleFollowUser } from "../../services/postsAPI";
import { uploadProfilePhoto, getCurrentUser } from "../../services/authAPI";
import toast from "react-hot-toast";

export default function ProfileHeader({ userInfo, myPostsCount, isOwner }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);

  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });

  const isActuallyFollowing =
    currentUser?.following?.some(
      (f) => f === userInfo?._id || f?._id === userInfo?._id,
    ) || false;

  const [optimisticFollow, setOptimisticFollow] = useState(null);

  const isFollowing =
    optimisticFollow !== null ? optimisticFollow : isActuallyFollowing;

  const { mutate: handleFollow, isPending: isFollowingPending } = useMutation({
    mutationFn: () => toggleFollowUser(userInfo?._id),
    onMutate: () => {
      setOptimisticFollow(!isFollowing);
    },
    onSuccess: () => {
      setOptimisticFollow(null);
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({
        queryKey: ["userProfile", userInfo?._id],
      });
      toast.success(
        !isActuallyFollowing
          ? `Followed ${userInfo?.name}! 🤝`
          : `Unfollowed ${userInfo?.name}`,
      );
    },
    onError: () => {
      setOptimisticFollow(null);
      toast.error("Failed to update follow status");
    },
  });

  const { mutate: handleUploadPhoto, isPending: isUploading } = useMutation({
    mutationFn: (file) => {
      const formData = new FormData();
      formData.append("photo", file);
      return uploadProfilePhoto(formData);
    },
    onSuccess: () => {
      toast.success("Profile photo updated! 📸");
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({
        queryKey: ["userProfile", userInfo?._id],
      });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: () => toast.error("Failed to upload photo"),
  });

  const onFileChange = (e) => {
    if (e.target.files && e.target.files[0])
      handleUploadPhoto(e.target.files[0]);
  };

  const getProfileImage = (photo) => {
    if (!photo)
      return "https://linked-posts.routemisr.com/uploads/default-profile.png";
    const photoStr = String(photo).toLowerCase();
    if (
      photoStr.includes("null") ||
      photoStr.includes("undefined") ||
      photoStr.trim() === ""
    ) {
      return "https://linked-posts.routemisr.com/uploads/default-profile.png";
    }
    if (photo.startsWith("http")) return photo;
    return `https://linked-posts.routemisr.com/${photo}`;
  };

  const profilePic = getProfileImage(userInfo?.photo);
  const followersCount = userInfo?.followers?.length || 0;
  const followingCount = userInfo?.following?.length || 0;

  let joinedDate = "Unknown";
  if (userInfo?.createdAt) {
    const date = new Date(userInfo.createdAt);
    if (!isNaN(date.getTime())) joinedDate = format(date, "MMMM yyyy");
  }

  return (
    <>
      <div className="relative bg-white/20 dark:bg-[#0f0f11]/40 backdrop-blur-xl rounded-3xl shadow-lg border border-white/40 dark:border-white/10 mb-8 mt-6">
        <div className="h-40 md:h-52 bg-linear-to-r from-purple-600 via-pink-500 to-red-500 rounded-t-3xl"></div>

        <div className="px-4 sm:px-6 pb-6">
          <div className="flex flex-wrap items-center sm:items-end justify-center sm:justify-start gap-4 sm:gap-6">
            <div className="relative z-10 -mt-16 md:-mt-20 shrink-0 w-full sm:w-auto flex justify-center sm:block">
              <div className="relative group p-1.5 bg-gray-50 dark:bg-[#0f0f11] rounded-full inline-block shadow-lg">
                <Avatar
                  src={profilePic}
                  className={`w-32 h-32 md:w-36 md:h-36 text-large border-4 border-white dark:border-[#18181b] transition-all duration-300 ${isUploading ? "opacity-50 blur-sm" : ""}`}
                  isBordered
                />
                {isUploading && (
                  <div className="absolute inset-0 flex justify-center items-center z-20">
                    <Spinner color="white" size="lg" />
                  </div>
                )}
                {isOwner && !isUploading && (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-1.5 rounded-full bg-black/40 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10 backdrop-blur-sm"
                  >
                    <Camera className="text-white mb-1" size={28} />
                    <span className="text-white text-xs font-bold">Change</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  ref={fileInputRef}
                  onChange={onFileChange}
                />
              </div>
            </div>

            <div className="flex-1 min-w-50 text-center sm:text-left mt-2 sm:mt-0">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white truncate">
                {userInfo?.name || "User"}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 font-medium truncate">
                @
                {userInfo?.name
                  ? userInfo.name.replace(/\s+/g, "").toLowerCase()
                  : "user"}
              </p>
              <div className="flex justify-center sm:justify-start flex-wrap gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar size={16} /> Joined {joinedDate}
                </div>
              </div>
            </div>

            <div className="shrink-0 w-full sm:w-auto flex justify-center mt-2 sm:mt-0 ml-auto">
              {isOwner ? (
                <Button
                  onPress={onOpen}
                  color="secondary"
                  variant="ghost"
                  startContent={<Settings size={20} />}
                  className="font-bold w-full sm:w-auto"
                >
                  Settings
                </Button>
              ) : (
                <div className="flex gap-3 w-full sm:w-auto">
                  <Button
                    onPress={handleFollow}
                    disabled={isFollowingPending}
                    className={`font-bold flex-1 sm:flex-none transition-all ${
                      isFollowing
                        ? "bg-transparent border border-gray-300 dark:border-white/20 text-gray-700 dark:text-white"
                        : "bg-purple-600 text-white shadow-md shadow-purple-500/30 hover:bg-purple-700"
                    }`}
                    startContent={
                      isFollowing ? (
                        <UserCheck size={20} />
                      ) : (
                        <UserPlus size={20} />
                      )
                    }
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </Button>
                  <Button
                    isIconOnly
                    color="default"
                    variant="bordered"
                    className="text-center"
                  >
                    <MessageCircle size={20} />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/10 flex justify-around sm:justify-start sm:gap-12">
            <div className="text-center sm:text-left hover:bg-gray-50 dark:hover:bg-white/5 p-2 rounded-lg cursor-pointer transition-colors">
              <span className="block text-center text-xl font-bold text-gray-900 dark:text-white">
                {myPostsCount}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Posts
              </span>
            </div>
            <div className="text-center sm:text-left hover:bg-gray-50 dark:hover:bg-white/5 p-2 rounded-lg cursor-pointer transition-colors">
              <span className="block text-center text-xl font-bold text-gray-900 dark:text-white">
                {followersCount}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Followers
              </span>
            </div>
            <div className="text-center sm:text-left hover:bg-gray-50 dark:hover:bg-white/5 p-2 rounded-lg cursor-pointer transition-colors">
              <span className="block text-center text-xl font-bold text-gray-900 dark:text-white">
                {followingCount}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Following
              </span>
            </div>
          </div>
        </div>
      </div>

      {isOwner && (
        <SettingsModal
          isOpen={isOpen}
          onClose={onOpenChange}
          userInfo={userInfo}
        />
      )}
    </>
  );
}

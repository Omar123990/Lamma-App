import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFollowSuggestions } from "../../services/authAPI";
import { toggleFollowUser } from "../../services/postsAPI";
import { Avatar, Button, Spinner } from "@heroui/react";
import { UserPlus, UserCheck, Sparkles, Users } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const SuggestionCard = ({ user, layout }) => {
  const queryClient = useQueryClient();
  const [isFollowing, setIsFollowing] = useState(false);

  const { mutate: handleFollow, isPending } = useMutation({
    mutationFn: () => toggleFollowUser(user._id),
    onMutate: () => setIsFollowing(!isFollowing),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      toast.success(isFollowing ? "Followed successfully! 🤝" : "Unfollowed");
    },
    onError: () => {
      setIsFollowing(!isFollowing);
      toast.error("Failed to update follow status");
    },
  });

  const getProfileImage = (u) => {
    const photo =
      u?.photo || u?.image || u?.profilePic || u?.avatar || u?.picture;
    if (!photo)
      return "https://linked-posts.routemisr.com/uploads/default-profile.png";
    const photoStr = String(photo).toLowerCase();
    if (
      photoStr === "null" ||
      photoStr.includes("undefined") ||
      photoStr.trim() === ""
    ) {
      return "https://linked-posts.routemisr.com/uploads/default-profile.png";
    }
    if (photo.startsWith("http")) return photo;
    const cleanPhoto = photo.startsWith("/") ? photo.substring(1) : photo;
    return `https://linked-posts.routemisr.com/${cleanPhoto}`;
  };

  const userPhoto = getProfileImage(user);

  if (layout === "vertical") {
    return (
      <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/30 dark:hover:bg-white/5 transition-colors group">
        <Link
          to={`/profile/${user._id}`}
          className="flex items-center gap-3 overflow-hidden flex-1"
        >
          <Avatar
            src={userPhoto}
            name={user.name}
            showFallback
            className="shrink-0 ring-2 ring-transparent group-hover:ring-purple-500/50 transition-all bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300"
            size="sm"
            isBordered
          />
          <div className="flex flex-col overflow-hidden text-left pr-2">
            <span className="text-sm font-bold text-gray-900 dark:text-white truncate group-hover:text-purple-600 transition-colors">
              {user.name}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
              @{user.name.replace(/\s+/g, "").toLowerCase()}
            </span>
          </div>
        </Link>
        <Button
          size="sm"
          radius="full"
          isIconOnly={isFollowing}
          onPress={handleFollow}
          disabled={isPending}
          className={`font-bold text-xs shrink-0 transition-all ${
            isFollowing
              ? "bg-transparent border border-gray-300 dark:border-white/20 text-gray-700 dark:text-white"
              : "bg-purple-600 text-white shadow-md shadow-purple-500/30 px-3 hover:bg-purple-700"
          }`}
        >
          {isFollowing ? <UserCheck size={14} /> : "Follow"}
        </Button>
      </div>
    );
  }

  return (
    <div className="min-w-35 max-w-35 flex flex-col items-center p-4 rounded-2xl bg-white/20 dark:bg-[#0f0f11]/40 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-sm hover:shadow-md transition-all snap-start shrink-0">
      <Link
        to={`/profile/${user._id}`}
        className="flex flex-col items-center text-center"
      >
        <Avatar
          src={userPhoto}
          name={user.name}
          showFallback
          className="w-16 h-16 mb-3 text-large ring-2 ring-purple-500/30 bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300 font-bold"
          isBordered
        />
        <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate w-full hover:text-purple-600 transition-colors">
          {user.name}
        </h4>
        <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate w-full mb-3">
          @{user.name.replace(/\s+/g, "").toLowerCase()}
        </p>
      </Link>
      <Button
        size="sm"
        radius="full"
        onPress={handleFollow}
        disabled={isPending}
        className={`font-bold text-xs w-full transition-all ${
          isFollowing
            ? "bg-transparent border border-gray-300 dark:border-white/20 text-gray-700 dark:text-white"
            : "bg-purple-600 text-white shadow-md shadow-purple-500/30 hover:bg-purple-700"
        }`}
        startContent={
          isFollowing ? <UserCheck size={14} /> : <UserPlus size={14} />
        }
      >
        {isFollowing ? "Following" : "Follow"}
      </Button>
    </div>
  );
};

export default function FollowSuggestions({ layout = "horizontal" }) {
  const { data: suggestions, isLoading } = useQuery({
    queryKey: ["followSuggestions"],
    queryFn: () => getFollowSuggestions(10),
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-4 mb-6">
        <Spinner size="sm" color="secondary" />
      </div>
    );
  }

  if (!suggestions || suggestions.length === 0) return null;

  if (layout === "vertical") {
    return (
      <div className="bg-white/20 dark:bg-black/20 backdrop-blur-md rounded-3xl border border-white/40 dark:border-white/10 p-5 shadow-sm">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 px-2 flex items-center gap-2">
          <Users size={16} className="text-purple-500" />
          Suggested Friends
        </h3>
        <div className="flex flex-col gap-1">
          {suggestions.slice(0, 6).map((user) => (
            <SuggestionCard key={user._id} user={user} layout="vertical" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 w-full block lg:hidden">
      <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2 uppercase tracking-wider px-1">
        <Sparkles size={16} className="text-purple-500" />
        Discover People
      </h3>
      <div className="flex overflow-x-auto gap-4 pb-4 pt-1 snap-x snap-mandatory hide-scrollbar">
        {suggestions.map((user) => (
          <SuggestionCard key={user._id} user={user} layout="horizontal" />
        ))}
      </div>
    </div>
  );
}

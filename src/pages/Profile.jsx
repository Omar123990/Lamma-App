import { useContext } from "react";
import { useParams } from "react-router-dom";
import { Spinner } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../context/AuthContext";
import { getCurrentUser, getUserById } from "../services/authAPI";
import { getUserPosts } from "../services/postsAPI";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileAbout from "../components/profile/ProfileAbout";
import ProfilePosts from "../components/profile/ProfilePosts";
import PostDetailModal from "../components/post/PostDetailModal";
import CreatePost from "../components/post/CreatePost";
import { Helmet } from "react-helmet-async";

export default function Profile() {
  const { id } = useParams();
  const { userData: loggedInUser } = useContext(AuthContext);

  const currentUserId = loggedInUser?._id || loggedInUser?.user?._id;
  const isOwner = currentUserId === id;

  const { data: profileResponse, isLoading: loadingProfile } = useQuery({
    queryKey: ["userProfile", id],
    queryFn: () => (isOwner ? getCurrentUser() : getUserById(id)),
    enabled: !!id,
  });

  const { data: userPosts, isLoading: loadingPosts } = useQuery({
    queryKey: ["userPosts", id],
    queryFn: () => getUserPosts(id),
    enabled: !!id,
  });

  if (loadingProfile) {
    return (
      <>
        <Helmet>
          <title>Loading Profile... | Lamma</title>
        </Helmet>
        <div className="flex justify-center items-center h-screen">
          <Spinner size="lg" color="secondary" />
        </div>
      </>
    );
  }

  let actualUser =
    profileResponse?.user ||
    profileResponse?.data?.user ||
    profileResponse?.data ||
    profileResponse;

  if (!actualUser)
    return (
      <>
        <Helmet>
          <title>User Not Found | Lamma</title>
        </Helmet>
        <div className="text-gray-500 text-center mt-20 font-bold text-xl">
          User not found
        </div>
      </>
    );

  return (
    <div className="space-y-6 w-full pb-10">
      <Helmet>
        <title>
          {actualUser?.name ? `${actualUser.name} | Lamma` : "Profile | Lamma"}
        </title>
      </Helmet>

      <ProfileHeader
        userInfo={actualUser}
        myPostsCount={userPosts?.length || 0}
        isOwner={isOwner}
      />

      <ProfileAbout userInfo={actualUser} />

      {isOwner && (
        <div className="mb-2">
          <CreatePost />
        </div>
      )}

      <ProfilePosts myPosts={userPosts} isLoading={loadingPosts} />

      <PostDetailModal />
    </div>
  );
}

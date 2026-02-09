import { Heart, MessageCircle, Share2 } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useDisclosure } from "@heroui/react";
import CommentsModal from "./comments/CommentsModal";
import CommentPreview from "./comments/CommentPreview";

export default function PostCard({ post }) {
    const { userData } = useContext(AuthContext); 
    
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    if (!post) return null;

    const { user, body, image, createdAt, _id } = post;

    function formatTimeAgo(dateString) {
        if (!dateString) return "";
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return "Just now";
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
        
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }

    const MALE_DEFAULT = "https://linked-posts.routemisr.com/uploads/default-profile.png";
    const FEMALE_DEFAULT = "https://i.pravatar.cc/150?u=female-user"; 

    const getUserImage = (u) => {
        if (u?.photo && !u.photo.includes("undefined")) return u.photo;
        if (u?.profileImage && !u.profileImage.includes("undefined")) return u.profileImage;
        return u?.gender === "female" ? FEMALE_DEFAULT : MALE_DEFAULT;
    };

    const postOwnerImage = getUserImage(user);

    return (
        <div className="
            mb-6 rounded-3xl overflow-hidden
            border border-white/20 shadow-xl
            bg-white/10 dark:bg-black/20 
            backdrop-blur-md
            text-gray-200 dark:text-white
            transition-all duration-300 hover:bg-white/20 dark:hover:bg-black/30
        ">

            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img
                        src={postOwnerImage}
                        alt={user?.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-500/50"
                    />
                    <div>
                        <h3 className="font-bold text-sm">{user?.name || "Anonymous"}</h3>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                            {formatTimeAgo(createdAt)}
                        </p>
                    </div>
                </div>
            </div>

            <div className="px-4 pb-3 cursor-text">
                <p className="text-sm leading-relaxed whitespace-pre-line dir-auto text-right">
                    {body}
                </p>
            </div>

            {image && (
                <div className="w-full h-64 sm:h-80 bg-black/50 overflow-hidden">
                    <img src={image} alt="Post Content" className="w-full h-full object-cover" />
                </div>
            )}

            <div className="p-4 flex items-center justify-between border-t border-white/10">

                <button className="flex items-center gap-2 text-gray-200 dark:text-gray-300 hover:text-pink-500 transition-colors group cursor-pointer">
                    <div className="p-2 rounded-full group-hover:bg-pink-500/10">
                        <Heart size={20} className="group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="text-sm font-medium">likes</span>
                </button>

                <button
                    onClick={onOpen} 
                    className="flex items-center gap-2 transition-colors group cursor-pointer text-gray-200 dark:text-gray-300 hover:text-blue-500"
                >
                    <div className="p-2 rounded-full group-hover:bg-blue-500/10">
                        <MessageCircle size={20} />
                    </div>
                    <span className="text-sm font-medium">comment</span>
                </button>

                <button className="flex items-center gap-2 text-gray-200 dark:text-gray-300 hover:text-green-500 transition-colors group cursor-pointer">
                    <div className="p-2 rounded-full group-hover:bg-green-500/10">
                        <Share2 size={20} />
                    </div>
                    <span className="text-sm font-medium">share</span>
                </button>

            </div>

            <CommentPreview postId={_id} onClick={onOpen} />

            <CommentsModal isOpen={isOpen} onClose={onOpenChange} postId={_id} />

        </div>
    );
}
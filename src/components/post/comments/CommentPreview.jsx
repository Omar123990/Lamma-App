import { useEffect, useState } from "react";
import axios from "axios";
import { Avatar } from "@heroui/react";

export default function CommentPreview({ postId, onClick }) {
  const [latestComment, setLatestComment] = useState(null);

  useEffect(() => {
    const getLatestComment = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const { data } = await axios.get(`https://linked-posts.routemisr.com/posts/${postId}/comments`, {
          headers: { token }
        });
        
        if (data.comments && data.comments.length > 0) {
            setLatestComment(data.comments[data.comments.length - 1]);
        }
      } catch (error) {
        console.error("Error fetching preview comment", error);
      }
    };

    if (postId) getLatestComment();
  }, [postId]);

  if (!latestComment) return null;

  return (
    <div 
        onClick={onClick}
        className="px-4 pb-4 cursor-pointer group hover:bg-white/5 transition-colors"
    >
        <div className="flex gap-2 items-start">
            <div className="mt-2 text-gray-500 text-xs">↳</div>
            
            <Avatar 
                src={latestComment?.commentCreator?.photo || "https://linked-posts.routemisr.com/uploads/default-profile.png"} 
                size="sm" 
                className="w-6 h-6"
            />
            
            <div className="bg-gray-100 dark:bg-white/10 px-3 py-1.5 rounded-2xl rounded-tl-none text-xs text-gray-700 dark:text-gray-300 line-clamp-1 max-w-[80%]">
                <span className="font-bold mr-1 text-black dark:text-white">
                    {latestComment?.commentCreator?.name}
                </span>
                {latestComment.content}
            </div>
        </div>
        <p className="text-[10px] text-gray-400 pl-6 mt-1 group-hover:underline">
            View all comments...
        </p>
    </div>
  );
}
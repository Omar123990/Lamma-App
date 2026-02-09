import { useState, useContext } from "react";
import { Button, Input, Avatar } from "@heroui/react";
import { Send } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom"; 

export default function CommentInput({ postId, onCommentAdded }) {
  const { userData } = useContext(AuthContext);
  const navigate = useNavigate(); 
  
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAddComment = async () => {
    if (!content.trim()) return;

    const token = localStorage.getItem("userToken");
    

    if (!token) {
        toast.error("Please login first 🔒");
        return navigate("/login");
    }

    setIsLoading(true);
    try {
      const payload = { 
          content: content, 
          post: postId 
      };

      const { data } = await axios.post("https://linked-posts.routemisr.com/comments", payload, {
        headers: { token }
      });

      if (data.message === "success") {
        toast.success("Comment added");
        setContent("");
        if (onCommentAdded) onCommentAdded(data.comment);
      }
    } catch (error) {
      console.error("API Error:", error);
      
      if (error.response && error.response.status === 401) {
          toast.error("Session expired, please login again");
          localStorage.removeItem("userToken");
          navigate("/login");
      } else {
          const msg = error.response?.data?.message || "Failed to add comment";
          toast.error(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-3 items-center w-full">
      <Avatar 
        src={userData?.photo || "https://linked-posts.routemisr.com/uploads/default-profile.png"} 
        size="sm" 
        className="flex-shrink-0"
      />
      
      <div className="relative flex-1">
        <Input
          placeholder="Write a comment..."
          value={content}
          onValueChange={setContent}
          radius="full"
          variant="faded"
          className="w-full"
          classNames={{
            input: "text-small",
            inputWrapper: "pr-12 bg-default-100 dark:bg-default-50/50 hover:bg-default-200"
          }}
          onKeyDown={(e) => {
             if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAddComment();
             }
          }}
        />
        <Button
            isIconOnly
            size="sm"
            variant="light"
            radius="full"
            className="absolute right-1 top-1/2 -translate-y-1/2 text-purple-600 dark:text-purple-400"
            isLoading={isLoading}
            onPress={handleAddComment}
        >
            <Send size={16} />
        </Button>
      </div>
    </div>
  );
}
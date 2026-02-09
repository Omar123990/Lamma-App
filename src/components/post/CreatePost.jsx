import { useState, useRef, useContext } from "react";
import axios from "axios";
import { Avatar, Button, Card, CardBody, Textarea } from "@heroui/react";
import { Image as ImageIcon, Send, X } from "lucide-react";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";

export default function CreatePost({ setPosts }) { 
  
  const { userData, myPosts, setMyPosts } = useContext(AuthContext); 
  
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCreatePost = async () => {
    if (!content.trim() && !selectedImage) return;

    setIsLoading(true);
    const loadingToast = toast.loading("Publishing post...");

    try {
      const token = localStorage.getItem("userToken");
      const formData = new FormData();
      formData.append("body", content);
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const { data } = await axios.post("https://linked-posts.routemisr.com/posts", formData, {
        headers: { token, "Content-Type": "multipart/form-data" }
      });

      if (data.message === "success") {
        toast.success("Post published successfully 🎉", { id: loadingToast });
        setContent("");
        removeImage();

        const apiPost = data.post || data.data;

        if (apiPost) {
            const newPost = {
                ...apiPost,
                user: userData
            };

            if (setPosts) {
                setPosts(prev => [newPost, ...prev]);
            }

            if (myPosts && myPosts.length > 0 && setMyPosts) {
                setMyPosts(prev => [newPost, ...prev]);
            }
        }
      }

    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.error || "Failed to publish post";
      toast.error(errMsg, { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full bg-white/5 border border-white/10 backdrop-blur-md mb-6">
      <CardBody className="gap-4">
        <div className="flex gap-4">
          
          <Avatar 
            src={userData?.photo || "https://linked-posts.routemisr.com/uploads/default-profile.png"} 
            className="w-12 h-12 flex-shrink-0" 
            isBordered 
            color="primary"
          />

          <Textarea
            placeholder={`What's on your mind ${userData?.name?.split(" ")[0] || "User"}?`}
            minRows={2}
            value={content}
            onValueChange={setContent}
            variant="bordered"
            classNames={{
              input: "text-white text-lg",
              inputWrapper: "border-none shadow-none bg-transparent group-data-[focus=true]:bg-transparent"
            }}
          />
        </div>

        {imagePreview && (
          <div className="relative mt-2">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="w-full max-h-80 object-cover rounded-xl border border-white/10" 
            />
            <button 
              onClick={removeImage}
              className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-red-500 transition"
            >
              <X size={20} />
            </button>
          </div>
        )}

        <div className="flex justify-between items-center border-t border-white/10 pt-3 mt-2">
          <div>
            <input 
              type="file" 
              hidden 
              ref={fileInputRef} 
              onChange={handleImageSelect} 
              accept="image/*"
            />
            <Button 
              variant="light" 
              className="text-purple-400 font-bold px-8 hover:scale-100 hover:text-white transition-all duration-300 hover:bg-white/5"
              startContent={<ImageIcon size={24} />}
              onPress={() => fileInputRef.current.click()}
            >
              Image
            </Button>
          </div>

          <Button 
            className="text-white px-8 font-bold bg-gradient-to-br from-purple-600 to-pink-600 hover:scale-105 transition-all duration-300"
            endContent={!isLoading && <Send size={18} />}
            isLoading={isLoading}
            onPress={handleCreatePost}
            isDisabled={!content.trim() && !selectedImage}
          >
            {isLoading ? "Publishing..." : "Publish"}
          </Button>

        </div>
      </CardBody>
    </Card>
  );
}
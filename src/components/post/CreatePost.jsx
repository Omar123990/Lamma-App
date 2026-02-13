import { useState, useRef, useContext } from "react";
import { Avatar, Button, Card, CardBody, Textarea, Spinner } from "@heroui/react";
import { Image as ImageIcon, Send, X } from "lucide-react";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createNewPost } from "../../services/postsAPI";
import { getCurrentUser } from "../../services/authAPI"; 

export default function CreatePost() {
  
  const { userData: contextUser } = useContext(AuthContext);
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();

  const { data: apiUser, isLoading: loadingUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    staleTime: 1000 * 60 * 10,
  });

  const currentUser = apiUser || contextUser;

  const { mutate, isPending } = useMutation({
    mutationFn: createNewPost,
    onSuccess: () => {
      toast.success("Post published successfully 🎉");
      setContent("");
      removeImage();
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error) => {
      const errMsg = error.response?.data?.error || "Failed to publish post";
      toast.error(errMsg);
    }
  });

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

  const handlePublish = () => {
    if (!content.trim() && !selectedImage) return;
    mutate({ content, image: selectedImage });
  };

  const userPhoto = (currentUser?.photo && !currentUser.photo.includes("undefined")) 
    ? currentUser.photo 
    : "https://linked-posts.routemisr.com/uploads/default-profile.png";

  return (
    <Card className="w-full bg-white/5 border border-white/10 backdrop-blur-md mb-6">
      <CardBody className="gap-4">
        <div className="flex gap-4">
          
          <Avatar 
            src={userPhoto} 
            className="w-12 h-12 flex-shrink-0" 
            isBordered 
            color="secondary" 
          />

          <Textarea
            placeholder={loadingUser ? "Loading..." : `What's on your mind, ${currentUser?.name?.split(" ")[0] || "User"}?`}
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
          <div className="relative mt-2 animate-in fade-in zoom-in duration-300">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="w-full max-h-80 object-cover rounded-xl border border-white/10" 
            />
            <button 
              onClick={removeImage}
              className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-full hover:bg-red-500 transition-colors backdrop-blur-sm"
            >
              <X size={18} />
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
              className="text-purple-400 font-bold px-4 hover:text-white transition-colors hover:bg-white/5"
              startContent={<ImageIcon size={22} />}
              onPress={() => fileInputRef.current.click()}
            >
              Photo
            </Button>
          </div>

          <Button 
            className="text-white px-8 font-bold bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg shadow-purple-900/20"
            endContent={!isPending && <Send size={18} />}
            isLoading={isPending}
            onPress={handlePublish}
            isDisabled={(!content.trim() && !selectedImage) || isPending}
          >
            {isPending ? "Publishing..." : "Publish"}
          </Button>

        </div>
      </CardBody>
    </Card>
  );
}
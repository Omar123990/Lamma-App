import { useState, useRef, useContext, useMemo } from "react";
import { Avatar, Button, Textarea, Card, CardBody } from "@heroui/react";
import { Image as ImageIcon, Send, X } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPost } from "../../services/postsAPI";
import { getCurrentUser } from "../../services/authAPI";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function CreatePost() {
  const { userData: contextUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const { data: apiUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    enabled: !!contextUser,
  });

  const currentUser = apiUser || contextUser;

  const [body, setBody] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const userPhoto = useMemo(() => {
    if (!currentUser?.photo)
      return "https://linked-posts.routemisr.com/uploads/default-profile.png";

    let photo = currentUser.photo;

    if (photo.includes("undefined")) {
      return "https://linked-posts.routemisr.com/uploads/default-profile.png";
    }

    if (photo.startsWith("http")) {
      return photo;
    }

    return `https://linked-posts.routemisr.com/${photo}`;
  }, [currentUser]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      const formData = new FormData();
      formData.append("body", body);
      if (image) formData.append("image", image);
      return createPost(formData);
    },
    onSuccess: () => {
      toast.success("Post created! 🎉");
      setBody("");
      removeImage();
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    },
    onError: (err) =>
      toast.error(err.response?.data?.error || "Failed to post"),
  });

  const handleSubmit = () => {
    if (!body.trim() && !image) return;
    mutate();
  };

  return (
    <Card
      className="mb-8 w-full overflow-visible 
        bg-white/10 dark:bg-black/20 
        backdrop-blur-xl 
        border border-white/20 dark:border-white/10 
        shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]
    "
    >
      <CardBody className="p-5">
        <div className="flex gap-4">
          <div className="shrink-0">
            <Avatar
              src={userPhoto}
              size="lg"
              isBordered
              color="secondary"
              className="w-12 h-12"
              showFallback
              name={currentUser?.name?.charAt(0) || "U"}
            />
          </div>

          <div className="flex-1">
            <Textarea
              placeholder={`What's on your mind, ${currentUser?.name?.split(" ")[0] || "Friend"}?`}
              minRows={2}
              variant="flat"
              size="lg"
              value={body}
              onValueChange={setBody}
              classNames={{
                base: "w-full",
                input:
                  "text-lg text-gray-800 dark:text-white placeholder:text-gray-500/70",
                inputWrapper:
                  "bg-transparent shadow-none hover:bg-transparent data-[focus=true]:bg-transparent transition-colors",
              }}
            />

            {preview && (
              <div className="relative mt-4 mb-2 w-full max-w-md group">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full max-h-80 rounded-2xl object-cover border border-white/20 shadow-lg"
                />
                <button
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-black/60 hover:bg-red-500 text-white rounded-full p-1.5 backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
                >
                  <X size={18} />
                </button>
              </div>
            )}

            <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200/30 dark:border-white/10">
              <div className="flex gap-2">
                <Button
                  isIconOnly
                  variant="light"
                  className="text-green-600 hover:bg-green-500/10 rounded-full"
                  onPress={() => fileInputRef.current.click()}
                >
                  <ImageIcon size={24} />
                </Button>
                <input
                  type="file"
                  hidden
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                />
              </div>

              <Button
                className="px-8 font-bold bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/20"
                radius="full"
                endContent={!isPending && <Send size={18} />}
                isLoading={isPending}
                isDisabled={(!body.trim() && !image) || isPending}
                onPress={handleSubmit}
              >
                {isPending ? "Posting..." : "Post"}
              </Button>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

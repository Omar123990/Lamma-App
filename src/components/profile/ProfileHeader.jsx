import { useRef, useState } from "react";
import { Avatar, Button, Card, CardBody, useDisclosure } from "@heroui/react"; 
import { Settings, Camera } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import SettingsModal from "./SettingsModal";

export default function ProfileHeader({ userInfo, myPostsCount, setUserInfo }) {

  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const loadingToast = toast.loading("Uploading photo...");

    try {
      const token = localStorage.getItem("userToken");
      const formData = new FormData();
      formData.append("photo", file);

      const { data } = await axios.put("https://linked-posts.routemisr.com/users/upload-photo", formData, {
        headers: {
          token,
          "Content-Type": "multipart/form-data"
        }
      });

      const newPhotoUrl = data?.user?.photo || URL.createObjectURL(file);

      setUserInfo(prev => ({ ...prev, photo: newPhotoUrl }));

      toast.success("Changed your photo 📸", { id: loadingToast });

    } catch (error) {
      console.error(error);
      toast.error("Failed to change photo", { id: loadingToast });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <Card className="w-full bg-white/5 border border-white/10 backdrop-blur-md !overflow-visible">
        <div className="h-40 w-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-t-xl relative"></div>

        <CardBody className="px-6 pb-6 pt-0 relative !overflow-visible">
          <div className="flex flex-col md:flex-row justify-between items-start">

            <div className="relative -mt-16 mb-4 md:mb-0 z-10 group">
              <div className="relative inline-block">
                <Avatar
                  src={userInfo?.photo || "https://i.pravatar.cc/300?u=user"}
                  className="w-32 h-32 ring-4 ring-[#18181b] bg-black object-cover"
                  isBordered
                />

                <button
                  onClick={() => fileInputRef.current.click()}
                  disabled={isUploading}
                  className="absolute bottom-0 right-0 bg-white text-black p-2 rounded-full shadow-lg cursor-pointer hover:bg-gray-200 transition-transform hover:scale-110 z-20"
                >
                  <Camera size={18} />
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                />
              </div>

              <div className="mt-4">
                <h2 className="text-3xl font-bold text-white">{userInfo?.name}</h2>
                <p className="text-gray-400 text-sm">@{userInfo?.name?.replace(/\s+/g, '').toLowerCase()}</p>

                <div className="flex gap-6 mt-3 text-gray-300">
                  <div className="flex gap-1"><span className="font-bold text-white">{myPostsCount}</span> Posts</div>
                </div>
              </div>
            </div>

            <div className="mt-4 md:mt-4">
              <Button
                onPress={onOpen}
                variant="bordered"
                className="border-white/20 text-white hover:bg-white/10"
                startContent={<Settings size={18} />}
              >
                Settings
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      <SettingsModal isOpen={isOpen} onClose={onOpenChange} />
    </>
  );
}
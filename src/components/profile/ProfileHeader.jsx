import { useRef } from "react";
import { Avatar, Button, Card, CardBody, useDisclosure } from "@heroui/react"; 
import { Settings, Camera } from "lucide-react";
import toast from "react-hot-toast";
import SettingsModal from "./SettingsModal";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadProfilePhoto } from "../../services/authAPI";

export default function ProfileHeader({ userInfo, myPostsCount }) {
  const fileInputRef = useRef(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const queryClient = useQueryClient();

  const { mutate: uploadPhoto, isPending } = useMutation({
    mutationFn: uploadProfilePhoto,
    onSuccess: () => {
      toast.success("Photo updated successfully 📸");
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Failed to upload photo");
    }
  });

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadPhoto(file);
    }
  };

  return (
    <>
      <Card className="w-full bg-white/5 border border-white/10 backdrop-blur-md !overflow-visible">
        <div className="h-40 w-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-t-xl relative"></div>

        <CardBody className="px-6 pb-6 pt-0 relative !overflow-visible">
          <div className="flex flex-col md:flex-row justify-between items-start">
            
            <div className="relative -mt-16 mb-4 md:mb-0 z-10 group">
              <div className="relative inline-block">
                <Avatar
                  src={userInfo?.photo || "https://linked-posts.routemisr.com/uploads/default-profile.png"}
                  className="w-32 h-32 ring-4 ring-[#18181b] bg-black object-cover"
                  isBordered
                />
                
                <button
                  onClick={() => fileInputRef.current.click()}
                  disabled={isPending}
                  className="absolute bottom-0 right-0 bg-white text-black p-2 rounded-full shadow-lg cursor-pointer hover:bg-gray-200 transition-transform hover:scale-110 z-20"
                >
                  {isPending ? <span className="block w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span> : <Camera size={18} />}
                </button>

                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoSelect} />
              </div>

              <div className="mt-4">
                <h2 className="text-3xl font-bold text-white">{userInfo?.name}</h2>
                <p className="text-gray-400 text-sm">@{userInfo?.name?.replace(/\s+/g, '').toLowerCase()}</p>
                <div className="flex gap-6 mt-3 text-gray-300">
                  <div className="flex gap-1"><span className="font-bold text-white">{myPostsCount}</span> Posts</div>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <Button onPress={onOpen} variant="bordered" className="border-white/20 text-white hover:bg-white/10" startContent={<Settings size={18} />}>
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
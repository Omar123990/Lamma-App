import { useState, useRef, useContext } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Avatar,
  Tab,
  Tabs,
} from "@heroui/react";
import { Lock, Camera, LogOut } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changePassword, uploadProfilePhoto } from "../../services/authAPI";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function SettingsModal({ isOpen, onClose, userInfo }) {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);

  const [selectedTab, setSelectedTab] = useState("photo");
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    reNew: "",
  });

  const [previewImage, setPreviewImage] = useState(userInfo?.photo || null);
  const [prevUserInfo, setPrevUserInfo] = useState(userInfo);
  const [imageFile, setImageFile] = useState(null);

  if (userInfo !== prevUserInfo) {
    setPrevUserInfo(userInfo);
    setPreviewImage(userInfo?.photo || null);
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
    onClose();
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const { mutate: updatePhoto, isPending: isUploading } = useMutation({
    mutationFn: () => {
      const formData = new FormData();
      formData.append("photo", imageFile);
      return uploadProfilePhoto(formData);
    },
    onSuccess: () => {
      toast.success("Profile photo updated! 📸");
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({
        queryKey: ["userProfile", userInfo?._id],
      });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      onClose();
    },
    onError: (err) =>
      toast.error(err.response?.data?.error || "Failed to update photo"),
  });

  const { mutate: updatePass, isPending: isChangingPass } = useMutation({
    mutationFn: () =>
      changePassword({
        password: passwords.current,
        newPassword: passwords.new,
      }),
    onSuccess: () => {
      toast.success("Password changed successfully! 🔐 Please login again.");
      handleLogout();
    },
    onError: (err) =>
      toast.error(err.response?.data?.error || "Failed to change password"),
  });

  const handlePasswordSubmit = () => {
    if (passwords.new !== passwords.reNew) {
      return toast.error("New passwords do not match! ❌");
    }
    if (passwords.new.length < 6) {
      return toast.error("Password must be at least 6 characters long.");
    }
    updatePass();
  };

  const getUserPhoto = (photo) => {
    if (
      !photo ||
      String(photo).includes("undefined") ||
      String(photo).includes("null")
    )
      return "https://linked-posts.routemisr.com/uploads/default-profile.png";
    if (photo.startsWith("http") || photo.startsWith("blob")) return photo;
    return `https://linked-posts.routemisr.com/${photo}`;
  };

  const displayPhoto = getUserPhoto(previewImage);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      backdrop="blur"
      size="md"
      classNames={{
        base: "bg-white/90 dark:bg-[#0f0f11]/90 backdrop-blur-2xl border border-gray-200 dark:border-white/10 shadow-[0_20px_60px_rgba(147,51,234,0.15)] rounded-3xl",
        header: "border-b border-gray-200/50 dark:border-white/10",
        footer: "border-t border-gray-200/50 dark:border-white/10",
        closeButton:
          "hover:bg-gray-100 dark:hover:bg-white/10 active:bg-gray-200",
      }}
    >
      <ModalContent>
        {(close) => (
          <>
            <ModalHeader className="flex flex-col gap-1 font-bold">
              Settings
            </ModalHeader>
            <ModalBody className="py-6">
              <Tabs
                aria-label="Options"
                color="secondary"
                variant="bordered"
                selectedKey={selectedTab}
                onSelectionChange={setSelectedTab}
                classNames={{
                  tabList: "w-full flex",
                  tab: "flex-1",
                }}
              >
                <Tab
                  key="photo"
                  title={
                    <div className="flex items-center space-x-2">
                      <Camera size={16} /> <span>Profile Photo</span>
                    </div>
                  }
                >
                  <div className="flex flex-col items-center gap-6 py-6 animate-appearance-in">
                    <div className="relative group p-1.5 bg-gray-50 dark:bg-black/40 rounded-full inline-block shadow-lg border border-gray-200 dark:border-white/10">
                      <Avatar
                        src={displayPhoto}
                        className="w-32 h-32 text-large border-4 border-white dark:border-[#18181b] transition-all"
                        isBordered
                      />
                      <div
                        onClick={() => fileInputRef.current.click()}
                        className="absolute inset-1.5 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-all text-white backdrop-blur-sm"
                      >
                        <Camera size={32} />
                      </div>
                    </div>
                    <input
                      type="file"
                      hidden
                      ref={fileInputRef}
                      onChange={handleImageSelect}
                      accept="image/*"
                    />

                    <Button
                      color="secondary"
                      isDisabled={!imageFile}
                      isLoading={isUploading}
                      onPress={() => updatePhoto()}
                      className="font-bold w-full max-w-xs shadow-md shadow-purple-500/20"
                    >
                      Save New Photo
                    </Button>
                  </div>
                </Tab>

                <Tab
                  key="security"
                  title={
                    <div className="flex items-center space-x-2">
                      <Lock size={16} /> <span>Security</span>
                    </div>
                  }
                >
                  <div className="flex flex-col gap-4 py-4 animate-appearance-in">
                    <Input
                      label="Current Password"
                      type="password"
                      variant="faded"
                      value={passwords.current}
                      onValueChange={(v) =>
                        setPasswords({ ...passwords, current: v })
                      }
                      classNames={{
                        inputWrapper:
                          "bg-white/60 dark:bg-black/40 border-none shadow-inner",
                      }}
                    />
                    <Input
                      label="New Password"
                      type="password"
                      variant="faded"
                      value={passwords.new}
                      onValueChange={(v) =>
                        setPasswords({ ...passwords, new: v })
                      }
                      classNames={{
                        inputWrapper:
                          "bg-white/60 dark:bg-black/40 border-none shadow-inner",
                      }}
                    />
                    <Input
                      label="Confirm New Password"
                      type="password"
                      variant="faded"
                      value={passwords.reNew}
                      onValueChange={(v) =>
                        setPasswords({ ...passwords, reNew: v })
                      }
                      classNames={{
                        inputWrapper:
                          "bg-white/60 dark:bg-black/40 border-none shadow-inner",
                      }}
                      isInvalid={
                        passwords.new !== passwords.reNew &&
                        passwords.reNew.length > 0
                      }
                      errorMessage={
                        passwords.new !== passwords.reNew &&
                        passwords.reNew.length > 0
                          ? "Passwords don't match"
                          : ""
                      }
                    />

                    <Button
                      color="secondary"
                      className="mt-4 font-bold shadow-md shadow-purple-500/20"
                      isLoading={isChangingPass}
                      isDisabled={
                        !passwords.current ||
                        !passwords.new ||
                        !passwords.reNew ||
                        passwords.new !== passwords.reNew
                      }
                      onPress={handlePasswordSubmit}
                    >
                      Update Password
                    </Button>
                  </div>
                </Tab>
              </Tabs>
            </ModalBody>

            <ModalFooter className="justify-between">
              <Button
                color="danger"
                variant="light"
                startContent={<LogOut size={18} />}
                onPress={handleLogout}
                className="font-bold hover:bg-red-50 dark:hover:bg-red-500/10"
              >
                Log Out
              </Button>
              <Button
                color="default"
                variant="flat"
                onPress={close}
                className="font-bold"
              >
                Cancel
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

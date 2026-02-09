import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@heroui/react";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Lock, Eye, EyeOff, Save, LogOut, Sun, Moon } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { useTheme } from "next-themes";

export default function SettingsModal({ isOpen, onClose }) {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [isVisibleCurrent, setIsVisibleCurrent] = useState(false);
  const [isVisibleNew, setIsVisibleNew] = useState(false);
  const [isVisibleRe, setIsVisibleRe] = useState(false);

  const toggleVisibility = (setter) => setter((prev) => !prev);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !rePassword) {
      return toast.error("All fields are required");
    }
    if (newPassword !== rePassword) {
      return toast.error("New passwords do not match");
    }
    if (newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    setIsLoading(true);
    const loadingToast = toast.loading("Updating password...");

    try {
      const token = localStorage.getItem("userToken");
      const payload = {
        password: currentPassword,
        newPassword: newPassword
      };

      const { data } = await axios.patch("https://linked-posts.routemisr.com/users/change-password", payload, {
        headers: { token }
      });

      if (data.message === "success") {
        toast.success("Password updated successfully 🔒", { id: loadingToast });
        setCurrentPassword("");
        setNewPassword("");
        setRePassword("");
        onClose();
      }

    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || "Failed to update password";
      toast.error(errorMsg, { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    onClose();
  };

  const inputClassNames = {
    input: "text-black dark:text-white",
    inputWrapper: "border-gray-300 dark:border-white/20 hover:border-gray-400 dark:hover:border-white/40 group-data-[focus=true]:border-purple-500 bg-transparent"
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      backdrop="blur"
      classNames={{
        base: "bg-white dark:bg-[#18181b] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white",
        closeButton: "hover:bg-gray-100 dark:hover:bg-white/10 active:bg-gray-200 dark:active:bg-white/20 text-gray-500 dark:text-white",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-2xl font-bold">
              Settings ⚙️
            </ModalHeader>

            <ModalBody className="gap-4">

              <div className="space-y-4">
                <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase tracking-wider">Appearance</p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setTheme('light')}
                    className={`flex-1 p-4 rounded-xl border flex flex-col items-center gap-2 transition-all duration-300 ${theme === 'light'
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-white shadow-md'
                      : 'border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-400'
                      }`}
                  >
                    <Sun size={24} className={theme === 'light' ? 'fill-current' : ''} />
                    <span className="font-medium text-sm">Light Mode</span>
                  </button>

                  <button
                    onClick={() => setTheme('dark')}
                    className={`flex-1 p-4 rounded-xl border flex flex-col items-center gap-2 transition-all duration-300 ${theme === 'dark'
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-white shadow-md'
                      : 'border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-400'
                      }`}
                  >
                    <Moon size={24} className={theme === 'dark' ? 'fill-current' : ''} />
                    <span className="font-medium text-sm">Dark Mode</span>
                  </button>
                </div>
              </div>

              <div className="w-full h-px bg-gray-200 dark:bg-white/10 my-2"></div>

              <div className="space-y-4">
                <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase tracking-wider">Security</p>

                <Input
                  label="Current Password"
                  variant="bordered"
                  endContent={
                    <button className="focus:outline-none" type="button" onClick={() => toggleVisibility(setIsVisibleCurrent)}>
                      {isVisibleCurrent ? <EyeOff className="text-2xl text-default-400 pointer-events-none" /> : <Eye className="text-2xl text-default-400 pointer-events-none" />}
                    </button>
                  }
                  type={isVisibleCurrent ? "text" : "password"}
                  value={currentPassword}
                  onValueChange={setCurrentPassword}
                  startContent={<Lock className="text-gray-400" size={20} />}
                  classNames={inputClassNames}
                />

                <Input
                  label="New Password"
                  variant="bordered"
                  endContent={
                    <button className="focus:outline-none" type="button" onClick={() => toggleVisibility(setIsVisibleNew)}>
                      {isVisibleNew ? <EyeOff className="text-2xl text-default-400 pointer-events-none" /> : <Eye className="text-2xl text-default-400 pointer-events-none" />}
                    </button>
                  }
                  type={isVisibleNew ? "text" : "password"}
                  value={newPassword}
                  onValueChange={setNewPassword}
                  startContent={<Lock className="text-gray-400" size={20} />}
                  classNames={inputClassNames}
                />

                <Input
                  label="Confirm New Password"
                  variant="bordered"
                  color={rePassword && newPassword !== rePassword ? "danger" : "default"}
                  errorMessage={rePassword && newPassword !== rePassword ? "Passwords do not match" : ""}
                  endContent={
                    <button className="focus:outline-none" type="button" onClick={() => toggleVisibility(setIsVisibleRe)}>
                      {isVisibleRe ? <EyeOff className="text-2xl text-default-400 pointer-events-none" /> : <Eye className="text-2xl text-default-400 pointer-events-none" />}
                    </button>
                  }
                  type={isVisibleRe ? "text" : "password"}
                  value={rePassword}
                  onValueChange={setRePassword}
                  startContent={<Lock className="text-gray-400" size={20} />}
                  classNames={inputClassNames}
                />

                <Button
                  className="w-full bg-gradient-to-tr from-purple-600 to-pink-600 text-white font-bold shadow-lg"
                  onPress={handleChangePassword}
                  isLoading={isLoading}
                  startContent={!isLoading && <Save size={18} />}
                >
                  Update Password
                </Button>
              </div>

              <div className="w-full h-px bg-gray-200 dark:bg-white/10 my-2"></div>

              <div className="space-y-2">
                <p className="text-red-500 text-sm font-semibold uppercase tracking-wider">Danger Zone</p>
                <Button
                  color="danger"
                  variant="flat"
                  className="w-full font-bold"
                  startContent={<LogOut size={18} />}
                  onPress={handleLogout}
                >
                  Log Out
                </Button>
              </div>

            </ModalBody>

            <ModalFooter>
              <Button variant="light" onPress={onClose} className="font-semibold border
        border-gray-300 text-gray-700 hover:bg-gray-50
        dark:border-white/20 dark:text-gray-300 dark:hover:bg-white/5">
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
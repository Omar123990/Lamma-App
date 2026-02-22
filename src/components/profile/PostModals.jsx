import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
} from "@heroui/react";
import { useState, useRef } from "react";
import { Image as ImageIcon, X } from "lucide-react";

export const EditModal = ({
  isOpen,
  onClose,
  onConfirm,
  post,
  isProcessing,
}) => {
  const [body, setBody] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  // ✅ الحل الرسمي من React: (Derived State) بدل الـ useEffect
  // بنعمل State تحفظ حالة المودال القديمة، ولو اتغيرت نحدث البيانات فوراً
  const [prevIsOpen, setPrevIsOpen] = useState(false);
  const [prevPostId, setPrevPostId] = useState(null);

  if (isOpen !== prevIsOpen || post?._id !== prevPostId) {
    setPrevIsOpen(isOpen);
    setPrevPostId(post?._id);

    // لو المودال لسه فاتح، حط بيانات البوست في حقول الإدخال
    if (isOpen && post) {
      setBody(post.body || "");
      setImagePreview(post.image || null);
      setSelectedImage(null);
    }
  }

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

  const handleSave = () => {
    onConfirm(body, selectedImage);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      backdrop="blur"
      classNames={{
        base: "bg-[#18181b] border border-white/10 text-white",
        closeButton: "hover:bg-white/10 active:bg-white/20",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Edit Post</ModalHeader>
        <ModalBody>
          <Textarea
            autoFocus
            minRows={3}
            placeholder="what's on your mind.."
            value={body}
            onValueChange={setBody}
            variant="bordered"
            classNames={{
              input: "text-white",
              inputWrapper:
                "border-white/20 hover:border-white/40 focus:border-purple-500",
            }}
          />

          {imagePreview && (
            <div className="relative mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full max-h-60 object-cover rounded-xl border border-white/10"
              />

              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="bg-black/70 backdrop-blur-md text-white p-2 rounded-full hover:bg-purple-600 transition shadow-lg"
                  title="Change Image"
                >
                  <ImageIcon size={16} />
                </button>
                <button
                  onClick={removeImage}
                  className="bg-black/70 backdrop-blur-md text-white p-2 rounded-full hover:bg-red-500 transition shadow-lg"
                  title="Remove Image"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          )}

          {!imagePreview && (
            <Button
              variant="flat"
              color="secondary"
              startContent={<ImageIcon size={18} />}
              onPress={() => fileInputRef.current.click()}
              className="mt-2 w-fit"
            >
              Add Image
            </Button>
          )}

          <input
            type="file"
            hidden
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
          />
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handleSave}
            isLoading={isProcessing}
            className="bg-linear-to-tr from-purple-600 to-pink-600 font-bold"
          >
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export const DeleteModal = ({ isOpen, onClose, onConfirm, isProcessing }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      backdrop="blur"
      classNames={{
        base: "bg-[#18181b] border border-white/10 text-white",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 text-red-500">
          Delete Post
        </ModalHeader>
        <ModalBody>
          <p className="text-gray-300">
            Are you sure you want to delete this post?
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose} className="text-white">
            Cancel
          </Button>
          <Button
            color="danger"
            onPress={onConfirm}
            isLoading={isProcessing}
            className="font-bold shadow-lg shadow-red-500/20"
          >
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

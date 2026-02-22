import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
} from "@heroui/react";
import { AlertTriangle, Edit2, X } from "lucide-react";
import { useRef } from "react";

export function DeletePostModal({
  isOpen,
  onOpenChange,
  onDelete,
  isDeleting,
}) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 items-center pt-8">
              <div className="p-3 rounded-full bg-red-500/10 text-red-500 mb-2">
                <AlertTriangle size={32} />
              </div>
              <span className="text-xl font-bold">Delete Post?</span>
            </ModalHeader>
            <ModalBody className="text-center text-gray-500 dark:text-gray-400">
              <p>Are you sure?</p>
            </ModalBody>
            <ModalFooter className="justify-center pb-8 pt-4">
              <Button variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button color="danger" onPress={onDelete} isLoading={isDeleting}>
                Delete
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export function EditPostModal({
  isOpen,
  onOpenChange,
  onEdit,
  isEditing,
  editContent,
  setEditContent,
  setEditImage,
  previewImage,
  setPreviewImage,
}) {
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const removeSelectedImage = () => {
    setEditImage(null);
    setPreviewImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      size="2xl"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex gap-2 items-center border-b border-gray-200 dark:border-white/10 pb-4">
              <Edit2 size={20} className="text-blue-500" />
              <span className="text-xl font-bold">Edit Post</span>
            </ModalHeader>
            <ModalBody className="py-6">
              <Textarea
                autoFocus
                label="Content"
                variant="bordered"
                value={editContent}
                onValueChange={setEditContent}
                minRows={3}
              />
              <div className="mt-4">
                <input
                  type="file"
                  hidden
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  accept="image/*"
                />
                {previewImage ? (
                  <div className="relative group rounded-xl overflow-hidden border">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full max-h-60 object-cover"
                    />
                    <button
                      onClick={removeSelectedImage}
                      className="absolute top-2 right-2 p-1 bg-black text-white rounded-full"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <Button
                    variant="flat"
                    className="w-full"
                    onPress={() => fileInputRef.current.click()}
                  >
                    Add Photo
                  </Button>
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" onPress={onEdit} isLoading={isEditing}>
                Save Changes
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

import { useContext, useState, useEffect, useRef } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import {
    Card, CardHeader, CardBody, CardFooter, Avatar, Image, Button,
    Dropdown, DropdownTrigger, DropdownMenu, DropdownItem,
    useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
    Textarea
} from "@heroui/react";
import { Heart, MessageCircle, Share2, MoreVertical, Edit2, Trash2, AlertTriangle, Check, X, Image as ImageIcon, XCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { AuthContext } from "../../context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost, updatePost } from "../../services/postsAPI";
import toast from "react-hot-toast";
import CommentPreview from "./comments/CommentPreview";

export default function PostCard({ post, disableModal = false }) {
    const { userData } = useContext(AuthContext);
    const location = useLocation();
    const queryClient = useQueryClient();
    const [_, setSearchParams] = useSearchParams();

    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteOpenChange } = useDisclosure();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange } = useDisclosure();

    if (!post) return null;
    const { user, body, image, createdAt, _id } = post;

    const isOwner = userData?._id === user?._id;

    const [editContent, setEditContent] = useState(body);
    const [editImage, setEditImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(image); 
    const fileInputRef = useRef(null);

    useEffect(() => { 
        setEditContent(body); 
        setPreviewImage(image);
    }, [body, image]);

    const authorPhoto = (user?.photo && !user.photo.includes("undefined"))
        ? user.photo
        : "https://linked-posts.routemisr.com/uploads/default-profile.png";

    const handleOpenPost = () => {
        if (disableModal) return;
        setSearchParams({ postId: _id });
    };

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

    const { mutate: handleDelete, isPending: isDeleting } = useMutation({
        mutationFn: () => deletePost(_id),
        onSuccess: () => {
            toast.success("Post deleted 🗑️");
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            queryClient.invalidateQueries({ queryKey: ['userPosts'] });
            onDeleteOpenChange(false);
        },
        onError: () => toast.error("Failed to delete")
    });

    const { mutate: handleEdit, isPending: isEditing } = useMutation({
        mutationFn: () => {
            const formData = new FormData();
            formData.append("body", editContent);
            if (editImage) {
                formData.append("image", editImage);
            }
            return updatePost({ postId: _id, formData });
        },
        onSuccess: () => {
            toast.success("Post updated ✨");
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            queryClient.invalidateQueries({ queryKey: ['userPosts'] });
            onEditOpenChange(false);
        },
        onError: (err) => {
            console.error(err);
            toast.error("Failed to update post");
        }
    });

    return (
        <Card className={`
            w-full mb-6 
            bg-white/10 dark:bg-black/10
            backdrop-blur-md 
            border border-white/40 dark:border-white/10 
            shadow-lg hover:shadow-xl
            transition-all duration-300
            hover:bg-white/20 dark:hover:bg-black/20
            ${disableModal ? 'cursor-pointer' : ''}
            ${isEditing ? 'opacity-50 pointer-events-none' : ''}
            ${isDeleting ? 'opacity-50 pointer-events-none' : ''}
        `}>

            <CardHeader className="justify-between px-4 pt-4">
                <div className="flex gap-3">
                    <Avatar isBordered radius="full" size="md" src={authorPhoto} className="ring-2 ring-purple-500/30" />
                    <div className="flex flex-col gap-0.5 items-start justify-center">
                        <h4 className="text-sm font-bold text-gray-800 dark:text-gray-100">{user?.name || "Anonymous"}</h4>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
                        </span>
                    </div>
                </div>

                {isOwner && (
                    <Dropdown className="bg-white/80 dark:bg-[#27272a] backdrop-blur-md border border-gray-200 dark:border-white/10">
                        <DropdownTrigger>
                            <Button isIconOnly size="sm" variant="light" className="text-gray-500 hover:bg-black/5 dark:hover:bg-white/10 rounded-full">
                                <MoreVertical size={20} />
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Post Actions" variant="flat">
                            <DropdownItem key="edit" startContent={<Edit2 size={16} />} onPress={onEditOpen}>Edit Post</DropdownItem>
                            <DropdownItem key="delete" className="text-danger" color="danger" startContent={<Trash2 size={16} />} onPress={onDeleteOpen}>Delete Post</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                )}
            </CardHeader>

            <CardBody className="px-4 py-2">
                <div onClick={handleOpenPost} className="cursor-pointer">
                    <p className="mb-3 whitespace-pre-wrap dir-auto text-gray-800 dark:text-gray-200 text-sm leading-relaxed">{body}</p>
                    {image && (
                        <Image
                            alt="Post image"
                            className="object-cover rounded-2xl w-full max-h-[500px] border border-black/5 dark:border-white/10"
                            src={image}
                            width="100%"
                        />
                    )}
                </div>
            </CardBody>

            <CardFooter className="gap-3 px-4 pb-4 pt-2 flex flex-col items-stretch">
                <div className="flex gap-6 justify-around w-full pt-3 border-t border-gray-200/50 dark:border-white/10">
                    <button className="flex cursor-pointer gap-1.5 text-gray-500 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400 transition-colors items-center group">
                        <Heart size={20} className="group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-semibold">Like</span>
                    </button>
                    <button onClick={handleOpenPost} className="flex cursor-pointer gap-1.5 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors items-center group">
                        <MessageCircle size={20} className="group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-semibold">Comment</span>
                    </button>
                    <button className="flex gap-1.5 text-gray-500 dark:text-gray-400 cursor-pointer hover:text-green-500 dark:hover:text-green-400 transition-colors items-center group">
                        <Share2 size={20} className="group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-semibold">Share</span>
                    </button>
                </div>
                {!disableModal && <CommentPreview postId={_id} onClick={handleOpenPost} />}
            </CardFooter>

            <Modal isOpen={isDeleteOpen} onOpenChange={onDeleteOpenChange} backdrop="blur" 
                classNames={{ 
                    base: "bg-white dark:bg-[#18181b] border border-gray-200 dark:border-white/10 text-black dark:text-white" 
                }}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 items-center pt-8">
                                <div className="p-3 rounded-full bg-red-500/10 text-red-500 mb-2"><AlertTriangle size={32} /></div>
                                <span className="text-xl font-bold">Delete Post?</span>
                            </ModalHeader>
                            <ModalBody className="text-center text-gray-500 dark:text-gray-400">
                                <p>Are you sure you want to delete this post?</p>
                            </ModalBody>
                            <ModalFooter className="justify-center pb-8 pt-4">
                                <Button variant="light" onPress={onClose}>Cancel</Button>
                                <Button color="danger" onPress={() => handleDelete()} isLoading={isDeleting}>Delete</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            <Modal isOpen={isEditOpen} onOpenChange={onEditOpenChange} backdrop="blur" size="2xl"
                classNames={{ 
                    base: "bg-white dark:bg-[#18181b] border border-gray-200 dark:border-white/10 text-black dark:text-white",
                    closeButton: "hover:bg-gray-100 dark:hover:bg-white/10"
                }}>
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
                                    placeholder="What's on your mind?"
                                    variant="bordered"
                                    value={editContent}
                                    onValueChange={setEditContent}
                                    minRows={3}
                                    classNames={{
                                        input: "text-gray-800 dark:text-white text-lg",
                                        inputWrapper: "border-gray-300 dark:border-white/20 hover:border-gray-400 dark:hover:border-white/40 focus-within:!border-blue-500"
                                    }}
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
                                        <div className="relative group rounded-xl overflow-hidden border border-gray-200 dark:border-white/10">
                                            <img src={previewImage} alt="Preview" className="w-full max-h-60 object-cover" />
                                            <button 
                                                onClick={removeSelectedImage}
                                                className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-red-500 transition-colors backdrop-blur-sm"
                                            >
                                                <X size={16} />
                                            </button>
                                            <div className="absolute bottom-2 right-2">
                                                <Button 
                                                    size="sm" 
                                                    variant="flat" 
                                                    className="bg-black/60 text-white backdrop-blur-md"
                                                    startContent={<ImageIcon size={16} />}
                                                    onPress={() => fileInputRef.current.click()}
                                                >
                                                    Change
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <Button 
                                            variant="flat" 
                                            className="w-full h-16 border-2 border-dashed border-gray-300 dark:border-white/20 bg-gray-50 dark:bg-white/5 text-gray-500"
                                            startContent={<ImageIcon size={24} />}
                                            onPress={() => fileInputRef.current.click()}
                                        >
                                            Add Photo
                                        </Button>
                                    )}
                                </div>
                            </ModalBody>
                            <ModalFooter className="border-t border-gray-200 dark:border-white/10 pt-4">
                                <Button color="danger" variant="light" onPress={onClose} startContent={<XCircle size={18} />}>Cancel</Button>
                                <Button 
                                    className="bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20" 
                                    onPress={() => handleEdit()} 
                                    isLoading={isEditing}
                                    startContent={!isEditing && <Check size={18} />}
                                >
                                    Save Changes
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </Card>
    );
}
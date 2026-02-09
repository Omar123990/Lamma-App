import { useContext, useState } from "react";
import { Avatar, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Input } from "@heroui/react";
import { MoreVertical, Trash2, Edit2, X, Check } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthContext } from "../../../context/AuthContext";

export default function CommentItem({ comment, onDelete, onUpdate }) {
    const { userData, isAuthReady } = useContext(AuthContext);

    if (!isAuthReady) return null;

    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment?.content || "");
    const [isLoading, setIsLoading] = useState(false);

    const creator = comment?.commentCreator;
    const creatorName = creator?.name || "Unknown User";

    const getValidPhoto = (photo) => {
        if (!photo || photo.includes("undefined")) {
            return "https://linked-posts.routemisr.com/uploads/default-profile.png";
        }
        return photo;
    };

    const creatorPhoto = getValidPhoto(creator?.photo);

    const isMyComment = userData?._id === creator?._id;

    const handleDelete = () => {
        toast.custom((t) => <ConfirmDeleteToast t={t} />, {
            duration: Infinity,
        });
    };

    function ConfirmDeleteToast({ t }) {
        const [loading, setLoading] = useState(false);

        const confirmDelete = async () => {
            if (loading) return;
            setLoading(true);

            try {
                const token = localStorage.getItem("userToken");

                await axios.delete(
                    `https://linked-posts.routemisr.com/comments/${comment._id}`,
                    { headers: { token } }
                );

                toast.dismiss(t.id);
                toast.success("Comment deleted");
                if (onDelete) onDelete(comment._id);

            } catch (error) {
                setLoading(false);
                toast.error("Failed to delete comment");
            }
        };

        return (
            <div
                className={`
                w-[340px] rounded-2xl p-4 shadow-2xl
                bg-white dark:bg-[#18181b] 
                border border-gray-100 dark:border-white/10
                
                transition-all duration-300 ease-in-out
                                ${t.visible
                        ? "animate-in fade-in slide-in-from-top-5 opacity-100 translate-y-0 scale-100"
                        : "opacity-0 -translate-y-5 scale-95"
                    }
            `}
            >
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 flex flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                        <svg className="w-5 h-5 text-red-600 dark:text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z" />
                        </svg>
                    </div>

                    <div className="flex-1 pt-1">
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm">Delete comment?</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                            This action cannot be undone. Are you sure you want to remove this?
                        </p>
                    </div>
                </div>

                <div className="mt-4 flex justify-end gap-3">
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        disabled={loading}
                        className="px-4 py-2 text-xs font-semibold rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 transition"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={confirmDelete}
                        disabled={loading}
                        className="px-4 py-2 text-xs font-semibold rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/30 flex items-center gap-2 transition"
                    >
                        {loading && <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                        {loading ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        );
    }




    const handleUpdate = async () => {
        if (!editContent.trim() || editContent === comment.content) {
            setIsEditing(false);
            return;
        }

        setIsLoading(true);
        try {
            const token = localStorage.getItem("userToken");
            const { data } = await axios.put(`https://linked-posts.routemisr.com/comments/${comment._id}`,
                { content: editContent },
                { headers: { token } }
            );

            if (data.message === "success") {
                toast.success("Comment updated");
                setIsEditing(false);
                if (onUpdate) onUpdate(comment._id, editContent);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to update");
        } finally {
            setIsLoading(false);
        }
    };

    return (

        <div className="flex gap-3 w-full group animate-in fade-in slide-in-from-top-1 duration-300">

            <Avatar
                src={creatorPhoto}
                size="sm"
                className="mt-1 flex-shrink-0"
                showFallback
                name={creatorName?.charAt(0)}
            />

            <div className="flex-1">
                <div className="bg-gray-100 dark:bg-white/5 p-3 rounded-2xl rounded-tl-none relative group/item">

                    <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-xs md:text-sm text-gray-900 dark:text-white">
                            {creatorName}
                        </span>

                        {isMyComment && !isEditing && (
                            <Dropdown>
                                <DropdownTrigger>
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        variant="light"
                                        className="h-6 w-6 min-w-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                    >
                                        <MoreVertical size={16} />
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu aria-label="Comment Actions">
                                    <DropdownItem key="edit" startContent={<Edit2 size={14} />} onPress={() => setIsEditing(true)}>Edit</DropdownItem>
                                    <DropdownItem key="delete" className="text-danger" color="danger" startContent={<Trash2 size={14} />} onPress={handleDelete}>Delete</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        )}
                    </div>

                    {isEditing ? (
                        <div className="flex gap-2 items-center mt-2">
                            <Input
                                size="sm"
                                value={editContent}
                                onValueChange={setEditContent}
                                autoFocus
                                onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
                            />
                            <Button isIconOnly size="sm" color="success" variant="flat" onPress={handleUpdate} isLoading={isLoading}>
                                <Check size={14} />
                            </Button>
                            <Button isIconOnly size="sm" color="danger" variant="flat" onPress={() => { setIsEditing(false); setEditContent(comment.content); }}>
                                <X size={14} />
                            </Button>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed dir-auto text-right">
                            {comment?.content}
                        </p>
                    )}
                </div>

                <span className="text-[10px] text-gray-400 px-2 mt-1 block">
                    {comment?.createdAt ? new Date(comment.createdAt).toLocaleDateString() : "Just now"}
                </span>
            </div>
        </div>
    );
}
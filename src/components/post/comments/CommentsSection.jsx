import { useState, useContext } from "react";
import { Avatar, Button, Input, Spinner } from "@heroui/react";
import { Send, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPostComments, createComment } from "../../../services/postsAPI";
import { AuthContext } from "../../../context/AuthContext";
import CommentItem from "./CommentItem";

export default function CommentsSection({ postId }) {
    const { userData } = useContext(AuthContext);
    const [content, setContent] = useState("");
    const [visibleCount, setVisibleCount] = useState(5);
    const queryClient = useQueryClient();

    const { data: comments, isLoading } = useQuery({
        queryKey: ['comments', postId],
        queryFn: () => getPostComments(postId),
        enabled: !!postId,
    });

    const { mutate: addComment, isPending: isAdding } = useMutation({
        mutationFn: createComment,
        onSuccess: () => {
            setContent("");
            queryClient.invalidateQueries({ queryKey: ['comments', postId] });
            toast.success("Comment added!");
            setVisibleCount(prev => prev + 1);
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed");
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!content.trim()) return;
        addComment({ postId, content });
    };

    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + 5);
    };

    const userPhoto = (userData?.photo && !userData.photo.includes("undefined"))
        ? userData.photo
        : "https://linked-posts.routemisr.com/uploads/default-profile.png";

    return (
        <div className="flex flex-col h-full bg-white dark:bg-[#18181b]">

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {isLoading ? (
                    <div className="flex justify-center py-10"><Spinner size="md" color="secondary" /></div>
                ) : comments?.length > 0 ? (
                    <>
                        {comments.slice(0, visibleCount).map((comment) => (
                            <CommentItem
                                key={comment._id}
                                comment={comment}
                                postId={postId}
                            />
                        ))}

                        {visibleCount < comments.length && (
                            <div className="flex justify-center pt-2">
                                <Button
                                    variant="light"
                                    size="sm"
                                    className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
                                    onPress={handleLoadMore}
                                    endContent={<ChevronDown size={14} />}
                                >
                                    Load more comments ({comments.length - visibleCount} remaining)
                                </Button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center text-gray-400 py-10 text-sm">No comments yet. Be the first! 👇</div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="p-3 bg-white dark:bg-[#18181b] border-t border-gray-200 dark:border-white/10 flex gap-2 items-center shrink-0">
                <Avatar src={userPhoto} className="w-8 h-8 flex-shrink-0" />
                <Input
                    placeholder="Write a comment..."
                    value={content}
                    onValueChange={setContent}
                    radius="full"
                    variant="faded"
                    classNames={{
                        inputWrapper: "bg-gray-100 dark:bg-white/5 border-transparent focus-within:border-gray-300 dark:focus-within:border-white/20 hover:bg-gray-200 dark:hover:bg-white/10",
                        input: "text-gray-800 dark:text-white text-sm placeholder:text-gray-500"
                    }}
                />
                <Button isIconOnly type="submit" radius="full" className="bg-purple-600 text-white shadow-md" isLoading={isAdding} isDisabled={!content.trim()}>
                    {!isAdding && <Send size={16} />}
                </Button>
            </form>

        </div>
    );
}
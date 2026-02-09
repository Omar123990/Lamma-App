import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Spinner } from "@heroui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { ChevronDown } from "lucide-react";
import CommentItem from "./CommentItem";
import CommentInput from "./CommentInput";

export default function CommentsModal({ isOpen, onClose, postId }) {
    const [allComments, setAllComments] = useState([]);
    const [displayedComments, setDisplayedComments] = useState([]);
    const [visibleCount, setVisibleCount] = useState(10);
    const [isLoading, setIsLoading] = useState(true);

    const COMMENTS_PER_PAGE = 10;

    const getComments = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem("userToken");
            const { data } = await axios.get(`https://linked-posts.routemisr.com/posts/${postId}/comments`, {
                headers: { token }
            });

            const validComments = (data.comments || []).filter(c => c !== null && c !== undefined);
            const reversedComments = validComments.reverse();

            setAllComments(reversedComments);
            setDisplayedComments(reversedComments.slice(0, visibleCount));

        } catch (error) {
            console.error("Error fetching comments", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && postId) {
            setVisibleCount(COMMENTS_PER_PAGE);
            getComments();
        }
    }, [isOpen, postId]);

    useEffect(() => {
        setDisplayedComments(allComments.slice(0, visibleCount));
    }, [visibleCount, allComments]);

    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + COMMENTS_PER_PAGE);
    };

    const handleAddToList = () => {
        setVisibleCount(COMMENTS_PER_PAGE);
        getComments();
    };

    const handleDeleteFromList = (commentId) => {
        setAllComments((prev) => prev.filter((c) => c._id !== commentId));
    };

    const handleUpdateInList = (commentId, newContent) => {
        setAllComments((prev) => prev.map((c) => c._id === commentId ? { ...c, content: newContent } : c));
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            scrollBehavior="inside"
            size="lg"
            backdrop="blur"
            isDismissable={false}
            classNames={{
                base: "bg-white dark:bg-[#18181b] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white h-[80vh]",
                header: "border-b border-gray-100 dark:border-white/10",
                footer: "border-t border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-black/20 p-2",
                closeButton: "hover:bg-gray-100 dark:hover:bg-white/10 active:bg-gray-200 dark:active:bg-white/20",
            }}
        >
            <ModalContent>
                {() => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Comments <span className="text-xs text-gray-500 font-normal">{allComments.length} comments</span>
                        </ModalHeader>

                        <ModalBody className="p-4">
                            {isLoading ? (
                                <div className="flex justify-center items-center h-full">
                                    <Spinner size="lg" color="secondary" label="Loading comments..." />
                                </div>
                            ) : allComments.length > 0 ? (
                                <div className="flex flex-col gap-4">
                                    {displayedComments.map((comment) => {
                                        if (!comment || !comment._id) return null;
                                        return (
                                            <CommentItem
                                                key={comment._id}
                                                comment={comment}
                                                onDelete={handleDeleteFromList}
                                                onUpdate={handleUpdateInList}
                                            />
                                        );
                                    })}

                                    {visibleCount < allComments.length && (
                                        <Button
                                            variant="flat"
                                            color="default"
                                            size="sm"
                                            className="w-full mt-2 font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-white"
                                            endContent={<ChevronDown size={16} />}
                                            onPress={handleLoadMore}
                                        >
                                            Load more comments ({allComments.length - visibleCount} remaining)
                                        </Button>
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                                    <p>No comments yet.</p>
                                    <span className="text-xs">Be the first to share your thoughts! 💭</span>
                                </div>
                            )}
                        </ModalBody>

                        <ModalFooter>
                            <CommentInput postId={postId} onCommentAdded={handleAddToList} />
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
import { Spinner } from "@heroui/react";
import ReplyItem from "./ReplyItem";

export default function RepliesList({
  shouldShow,
  showReplies,
  setShowReplies,
  isLoading,
  repliesData,
  repliesCount,
}) {
  if (!shouldShow) return null;

  const hasFetchedAndEmpty =
    !isLoading && repliesData && repliesData.length === 0;

  if (hasFetchedAndEmpty && !showReplies) return null;

  return (
    <div className="mt-1 ml-2">
      {!showReplies && repliesCount > 0 && (
        <button
          onClick={() => setShowReplies(true)}
          className="text-[11px] font-bold text-gray-500 dark:text-gray-400 flex items-center gap-2 hover:text-purple-600 dark:hover:text-purple-400 transition-colors mb-2 ml-1"
        >
          <span className="w-6 h-px bg-gray-400 dark:bg-gray-500"></span>
          View {repliesCount} {repliesCount === 1 ? "reply" : "replies"}
        </button>
      )}

      {showReplies && (
        <div className="pl-4 pt-2 animate-appearance-in">
          {isLoading ? (
            <div className="flex items-center gap-2 py-2 text-xs text-gray-400">
              <Spinner size="sm" color="secondary" /> Loading replies...
            </div>
          ) : repliesData && repliesData.length > 0 ? (
            <div className="flex flex-col gap-3">
              {repliesData.map((reply) => (
                <ReplyItem key={reply._id} reply={reply} />
              ))}

              <button
                onClick={() => setShowReplies(false)}
                className="text-[11px] font-bold text-gray-500 dark:text-gray-400 mt-1 hover:text-purple-600 dark:hover:text-purple-400 flex items-center gap-2 transition-colors w-fit"
              >
                <span className="w-6 h-px bg-gray-400 dark:bg-gray-500"></span>
                Hide replies
              </button>
            </div>
          ) : (
            <div className="text-[11px] text-gray-500 dark:text-gray-400 py-1 flex items-center gap-2">
              <span>No replies yet.</span>
              <button
                onClick={() => setShowReplies(false)}
                className="text-purple-600 font-bold hover:underline"
              >
                Close
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

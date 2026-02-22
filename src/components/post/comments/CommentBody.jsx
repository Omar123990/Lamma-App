import {
  Avatar,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { MoreVertical, Edit2, Trash2 } from "lucide-react";

export default function CommentBody({
  comment,
  isEditing,
  editContent,
  setEditContent,
  handleEdit,
  setIsEditing,
  isSavingEdit,
  isMyComment,
  handleDelete,
}) {
  const creator = comment.creator || comment.commentCreator;
  const userPhoto =
    creator?.photo?.includes("undefined") || !creator?.photo
      ? "https://linked-posts.routemisr.com/uploads/default-profile.png"
      : creator?.photo?.startsWith("http")
        ? creator.photo
        : `https://linked-posts.routemisr.com/${creator?.photo}`;

  return (
    <div className="flex items-start gap-2">
      <div className="bg-white/40 dark:bg-black/20 backdrop-blur-md border border-white/40 dark:border-white/5 p-3 rounded-2xl rounded-tl-none inline-block min-w-37.5 relative transition-colors shadow-sm">
        <span className="font-bold text-sm text-gray-900 dark:text-white block mb-1">
          {creator?.name}
        </span>

        {isEditing ? (
          <div className="mt-2 min-w-50">
            <Input
              size="sm"
              variant="faded"
              radius="lg"
              value={editContent}
              onValueChange={setEditContent}
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && handleEdit()}
              classNames={{
                inputWrapper:
                  "bg-white/60 dark:bg-black/40 border-none shadow-inner",
              }}
            />
            <div className="flex gap-4 mt-2 justify-end">
              <span
                className="text-xs text-gray-500 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </span>
              <span
                className="text-xs text-purple-600 font-bold cursor-pointer hover:text-purple-700 transition-colors"
                onClick={handleEdit}
              >
                {isSavingEdit ? "Saving..." : "Save"}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed wrap-break-word">
            {comment.content}
          </p>
        )}
      </div>

      {isMyComment && !isEditing && (
        <Dropdown>
          <DropdownTrigger>
            <button className="p-1 rounded-full text-gray-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-500/10 outline-none transition-all mt-1">
              <MoreVertical size={16} />
            </button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Comment Actions">
            <DropdownItem
              key="edit"
              startContent={<Edit2 size={14} />}
              onPress={() => setIsEditing(true)}
            >
              Edit
            </DropdownItem>
            <DropdownItem
              key="delete"
              className="text-danger"
              color="danger"
              startContent={<Trash2 size={14} />}
              onPress={handleDelete}
            >
              Delete
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      )}
    </div>
  );
}

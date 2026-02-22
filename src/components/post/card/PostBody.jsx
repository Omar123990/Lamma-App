import { Image } from "@heroui/react";

export default function PostBody({
  body,
  postImage,
  onOpenPost,
  onImageClick,
}) {
  return (
    <div className="px-4 py-2 cursor-pointer" onClick={onOpenPost}>
      <p className="mb-3 whitespace-pre-wrap dir-auto text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
        {body}
      </p>

      {postImage && (
        <div onClick={onImageClick} className="w-full">
          <Image
            alt="Post image"
            className="object-cover rounded-2xl w-full max-h-125 border border-black/5 dark:border-white/10 cursor-zoom-in transition-transform hover:opacity-95"
            src={postImage}
            width="100%"
            onError={(e) => (e.target.style.display = "none")}
          />
        </div>
      )}
    </div>
  );
}

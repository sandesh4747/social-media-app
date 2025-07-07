import React, { useState } from "react";
import profile from "../../assets/profile.png";
import {
  ThumbsUp,
  MessageCircle,
  Share2,
  MoreHorizontal,
  X,
} from "lucide-react";
import { useToogleLikeMutation } from "./postApi";
import { toast } from "react-hot-toast";
import CommentItem from "./CommentItem";

export default function PostCard({ post }) {
  const [toggleLike] = useToogleLikeMutation();
  const [showComments, setShowComments] = useState(false);

  const author = post?.author || {};
  const images = post?.images || [];

  const formattedDate = new Date(post?.createdAt).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleToggleLike = async () => {
    try {
      await toggleLike(post._id).unwrap();
    } catch (error) {
      toast.error(error.data?.message || "Failed to toggle like");
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm w-full mx-auto border border-gray-200 mb-4">
        {/* Header */}
        <div className="flex justify-between p-3">
          <div className="flex gap-2">
            <img
              src={author.profilePic?.url || profile}
              className="w-10 h-10 rounded-full border object-cover"
              alt="profile"
            />
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {author.username || "Unknown"}
              </p>
              <p className="text-xs text-gray-500">{formattedDate} · 🌍</p>
            </div>
          </div>
          <button className="text-gray-500 hover:bg-gray-100 w-8 h-8 flex items-center justify-center rounded-full">
            <MoreHorizontal size={18} />
          </button>
        </div>

        {/* Content */}
        {post?.content && (
          <p className="text-sm text-gray-800 px-4 pb-2">{post.content}</p>
        )}

        {/* Images */}
        {images.length > 0 && (
          <div className="border-t border-b border-gray-200">
            {images.length === 1 ? (
              <img
                src={images[0].url}
                alt="Post"
                className="w-full max-h-[500px] object-contain bg-gray-100"
              />
            ) : (
              <div className="grid grid-cols-2 gap-0.5">
                {images.slice(0, 4).map((img, i) => (
                  <div key={img._id} className="relative aspect-square">
                    <img src={img.url} className="w-full h-full object-cover" />
                    {i === 3 && images.length > 4 && (
                      <div className="absolute inset-0 bg-black/50 text-white flex items-center justify-center font-bold text-xl">
                        +{images.length - 4}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="px-4 py-2 text-xs text-gray-500 border-b flex justify-between">
          <div className="flex items-center gap-1">
            {post.likes.length > 0 && (
              <>
                <span className="bg-blue-500 text-white text-[10px] rounded-full px-[6px] py-[1px]">
                  👍
                </span>
                <span>{post.likes.length}</span>
              </>
            )}
          </div>
          <div>
            {post.comments.length > 0 && (
              <span className="hover:underline cursor-pointer">
                {post.comments.length} comments
              </span>
            )}
            {post.shares > 0 && (
              <span className="ml-2 hover:underline cursor-pointer">
                {post.shares} shares
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between px-4 py-2 text-gray-600 text-sm">
          <button
            onClick={handleToggleLike}
            className="flex-1 flex items-center justify-center gap-2 hover:bg-gray-100 py-2 rounded-md transition"
          >
            <ThumbsUp size={18} /> Like
          </button>
          <button
            onClick={() => setShowComments(true)}
            className="flex-1 flex items-center justify-center gap-2 hover:bg-gray-100 py-2 rounded-md transition"
          >
            <MessageCircle size={18} /> Comment
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 hover:bg-gray-100 py-2 rounded-md transition">
            <Share2 size={18} /> Share
          </button>
        </div>
      </div>

      {/* Fullscreen Comment Card */}
      {showComments && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center px-2">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-xl shadow-lg overflow-hidden flex flex-col relative">
            <div className="flex items-center justify-between p-4 border-b border-gray-300 ">
              <h2 className="text-lg font-semibold text-gray-800">Comments</h2>
              <button
                onClick={() => setShowComments(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X />
              </button>
            </div>
            <CommentItem postId={post._id} comments={post.comments || []} />
          </div>
        </div>
      )}
    </>
  );
}

import React, { useState } from "react";
import profile from "../../assets/profile.png";
import { formatDistanceToNow } from "date-fns";
import { MoreHorizontal, Share, Share2, X } from "lucide-react";
import { useDeletePostMutation } from "./postApi";
import toast from "react-hot-toast";
import EditPost from "./EditPost";
import ToggleLike from "./ToggleLike";
import Comment from "./Comment";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function PostCard({ post, isLoading }) {
  const { user } = useSelector((state) => state.userSlice);
  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();
  const [showEdit, setShowEdit] = useState(false);
  const [horizontalMenu, setHorizontalMenu] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  const time = formatDistanceToNow(new Date(post?.createdAt), {
    addSuffix: true,
  });

  const handleDeletePost = async () => {
    try {
      await deletePost(post._id).unwrap();
      toast.success("Post deleted successfully");
    } catch (error) {
      toast.error(error.data?.message || "Failed to delete post");
    }
  };

  if (isLoading) <LoadingSpinner />;
  return (
    <div>
      {!showEdit ? (
        <div className="  shadow-sm rounded-lg w-full mx-auto border border-gray-200  bg-white relative">
          <div className="flex items-center justify-between relative">
            <div className="flex items-center gap-2 p-3 ">
              <img
                onClick={() => navigate(`/profile/${post?.author?._id}`)}
                src={post?.author?.profilePic?.url || profile}
                alt=""
                className="rounded-full w-10 h-10 object-cover border-1 border-white shadow-xl cursor-pointer"
              />
              <div>
                <p className="font-semibold text-sm text-gray-800">
                  {post?.author?.username || "Unknown"}
                </p>
                <p className="text-xs text-gray-500">{time}</p>
              </div>
            </div>
            {post?.author?._id === user?._id && (
              <div className="px-2">
                {" "}
                <button onClick={() => setHorizontalMenu(!horizontalMenu)}>
                  <MoreHorizontal size={18} />
                </button>
                {horizontalMenu && (
                  <div className="absolute right-4 top-4 bg-white border border-gray-200 rounded-lg shadow-md p-2 z-10">
                    <p
                      onClick={() => {
                        setShowEdit(true);
                        setHorizontalMenu(false);
                      }}
                      className="text-sm text-gray-600 cursor-pointer hover:text-blue-600"
                    >
                      Edit
                    </p>
                    <p
                      onClick={() => {
                        handleDeletePost();
                        setHorizontalMenu(false);
                      }}
                      className="text-sm text-gray-600 cursor-pointer hover:text-red-600"
                    >
                      Delete
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* content */}
          <div>
            <p className="text-sm text-gray-700 font-semibold px-2 pb-2 ">
              {post?.content}
            </p>
          </div>

          {/* images */}
          {post?.images?.length > 0 && (
            <div className="w-full">
              {post.images.length === 1 && (
                <img
                  src={post.images[0].url}
                  alt="Post image"
                  onClick={() => setSelectedImage(post.images[0].url)}
                  className="w-full h-96 object-cover rounded-sm cursor-pointer"
                />
              )}

              {post.images.length === 2 && (
                <div className="grid grid-cols-2 gap-2">
                  {post.images.map((image, index) => (
                    <img
                      key={index}
                      src={image.url}
                      alt={`Post image ${index + 1}`}
                      onClick={() => setSelectedImage(image.url)}
                      className="w-full h-60 object-cover rounded-sm cursor-pointer"
                    />
                  ))}
                </div>
              )}

              {post.images.length === 3 && (
                <div className="grid grid-cols-2 gap-2">
                  <img
                    src={post.images[0].url}
                    alt="Post image 1"
                    onClick={() => setSelectedImage(post.images[0].url)}
                    className="col-span-2 h-60 w-full object-cover rounded-lg cursor-pointer"
                  />
                  <img
                    src={post.images[1].url}
                    alt="Post image 2"
                    onClick={() => setSelectedImage(post.images[1].url)}
                    className="h-40 w-full object-cover rounded-lg cursor-pointer"
                  />
                  <img
                    src={post.images[2].url}
                    alt="Post image 3"
                    onClick={() => setSelectedImage(post.images[2].url)}
                    className="h-40 w-full object-cover rounded-lg cursor-pointer"
                  />
                </div>
              )}

              {post.images.length >= 4 && (
                <div className="grid grid-cols-2 gap-2">
                  {post.images.slice(0, 4).map((image, index) => (
                    <img
                      key={index}
                      src={image.url}
                      alt={`Post image ${index + 1}`}
                      onClick={() => setSelectedImage(image.url)}
                      className="h-40 w-full object-cover rounded-lg cursor-pointer"
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Full image modal */}
          {selectedImage && (
            <div className="fixed inset-0 z-50 bg-black/30  flex items-center justify-center backdrop-blur-md">
              <div className="relative max-w-3xl w-full mx-4">
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-2 right-2 text-white bg-black/30 rounded-full p-1"
                >
                  <X className="w-6 h-6" />
                </button>
                <img
                  src={selectedImage}
                  alt="Full view"
                  className="w-full max-h-[90vh] object-contain rounded-lg"
                />
              </div>
            </div>
          )}
          <div className="flex items-center justify-between mt-4 py-3 border-t border-gray-400 ">
            <div className="flex items-center  gap-2 min-w-[24px] ">
              <ToggleLike
                id={post._id}
                isLikedByUser={post?.likes?.some(
                  (like) => like._id === user._id
                )}
              />
              <span className="inline-block w-6 text-center">
                {post?.likes?.length || 0}
              </span>
            </div>
            <div>
              <Comment postId={post._id} />
            </div>
            <div className=" px-2">
              <Share2 />
            </div>
          </div>
        </div>
      ) : (
        <EditPost postId={post._id} setShowEdit={setShowEdit} />
      )}
    </div>
  );
}

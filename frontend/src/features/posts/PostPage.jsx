import React, { useState } from "react";
import { useSelector } from "react-redux";
import profile from "../../assets/profile.png";
import { Image, Loader, X } from "lucide-react";
import { useCreatePostMutation, useGetAllPostsQuery } from "./postApi";
import toast from "react-hot-toast";
import PostCard from "./PostCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useNavigate } from "react-router-dom";

export default function PostPage() {
  const { data, isLoading: isPostLoading } = useGetAllPostsQuery();
  const posts = data?.posts || [];

  const [createPost, { isLoading }] = useCreatePostMutation();
  const { user } = useSelector((state) => state.userSlice);
  const [showPostModal, setShowPostModal] = useState(false);
  const [postText, setPostText] = useState("");
  const [images, setImages] = useState([]); // Use array, not null
  const navigate = useNavigate();

  const handleCreatePost = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("content", postText);

    if (images.length > 0) {
      for (const image of images) {
        formData.append("images", image);
      }
    }

    try {
      const res = await createPost(formData).unwrap();
      toast.success(res.message || "Post created successfully");
      setPostText("");
      setImages([]);
      setShowPostModal(false);
    } catch (error) {
      toast.error(error.data?.message || "Failed to create post");
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (images.length + files.length > 4) {
      toast.error("You can only upload up to 4 images.");
      return;
    }

    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  if (isPostLoading) return <LoadingSpinner />;
  return (
    <div className="space-y-6 ">
      <div className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm">
        <img
          onClick={() => navigate(`/profile/${user?._id}`)}
          src={user?.profilePic?.url || profile}
          alt="profile"
          className="w-10 h-10 rounded-full shadow border border-white object-cover cursor-pointer"
        />
        <input
          type="text"
          readOnly
          onClick={() => setShowPostModal(true)}
          placeholder="What's on your mind?"
          className="border border-gray-300 rounded-full p-2 w-full bg-white outline-none cursor-pointer hover:bg-gray-50 text-sm text-gray-600"
        />
      </div>
      {showPostModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center min-h-screen">
          <div className="bg-white w-full max-w-xl rounded-xl p-6 shadow-xl relative">
            <button
              onClick={() => setShowPostModal(false)}
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-600"
            >
              <X />
            </button>

            <h2 className="text-lg font-semibold text-center mb-4 text-gray-800">
              Create Post
            </h2>

            <div className="flex items-center gap-3 mb-4">
              <img
                src={user?.profilePic?.url || profile}
                alt="profile"
                className="w-10 h-10 rounded-full border shadow"
              />
              <p className="font-medium text-gray-700">{user?.username}</p>
            </div>

            <textarea
              rows={5}
              placeholder="What's on your mind?"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 outline-none resize-none"
            />

            {/* Image preview section */}
            {images.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-4">
                {images.map((img, index) => (
                  <div key={index} className="relative w-24 h-24">
                    <img
                      src={URL.createObjectURL(img)}
                      alt="preview"
                      className="w-full h-full object-cover rounded"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-0 right-0 bg-black bg-opacity-50 text-white text-xs px-1 rounded-bl"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-orange-600 cursor-pointer">
                <Image className="w-5 h-5" />
                Add Images
                <input
                  type="file"
                  className="hidden"
                  onChange={handleImageChange}
                  multiple
                />
              </label>
              <button
                onClick={handleCreatePost}
                type="submit"
                disabled={isLoading}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1 rounded-md text-sm"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <Loader className="animate-spin h-4 w-4" />
                    <span className="ml-2">Posting...</span>
                  </div>
                ) : (
                  "Post"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {sortedPosts?.length > 0 ? (
        sortedPosts?.map((post) => (
          <PostCard key={post._id} post={post} isLoading={isPostLoading} />
        ))
      ) : (
        <div className="w-full flex flex-col items-center justify-center py-16 text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mb-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 10h2l1 2h13l1-2h2M12 20h.01M4 6h16"
            />
          </svg>
          <p className="text-lg font-medium">No posts yet</p>
          <p className="text-sm text-gray-400">Start sharing something soon!</p>
        </div>
      )}
    </div>
  );
}

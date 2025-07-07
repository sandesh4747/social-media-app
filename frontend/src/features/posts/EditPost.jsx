import React, { useEffect, useState } from "react";
import { useGetSinglePostQuery, useUpdatePostMutation } from "./postApi";
import profile from "../../assets/profile.png";
import { Image, X } from "lucide-react";
import toast from "react-hot-toast";

export default function EditPost({ postId, setShowEdit }) {
  const { data, isLoading: isPostLoading } = useGetSinglePostQuery(postId);
  const post = data?.post;

  const [updatePost, { isLoading }] = useUpdatePostMutation();
  const [showPostModal, setShowPostModal] = useState(true);
  const [postText, setPostText] = useState("");
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (post) {
      setPostText(post.content);
      setImages(post.images || []); // Load existing image objects { url, public_id }
    }
  }, [post]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("content", postText);

    const existingImages = images.filter((img) => !(img instanceof File));
    const newImages = images.filter((img) => img instanceof File);

    formData.append(
      "existingImages",
      JSON.stringify(existingImages.map((img) => img.url))
    );

    newImages.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const res = await updatePost({ id: postId, data: formData }).unwrap();
      toast.success(res.message || "Post updated successfully");
      setPostText("");
      setImages([]);
      setShowPostModal(false);
      setShowEdit(false);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update post");
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 4) {
      toast.error("You can only upload up to 4 images");
      return;
    }
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6 py-4">
      {showPostModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-xl rounded-xl p-6 shadow-xl relative">
            {isPostLoading ? (
              <p className="text-center text-gray-500">Loading post...</p>
            ) : (
              <>
                <button
                  onClick={() => {
                    setShowPostModal(false);
                    setShowEdit(false);
                  }}
                  className="absolute top-3 right-4 text-gray-400 hover:text-gray-600"
                >
                  <X />
                </button>

                <h2 className="text-lg font-semibold text-center mb-4 text-gray-800">
                  Update Post
                </h2>

                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={post?.author?.profilePic?.url || profile}
                    alt="profile"
                    className="w-10 h-10 rounded-full border shadow"
                  />
                  <p className="font-medium text-gray-700">
                    {post?.author?.username}
                  </p>
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
                  <div className="mt-4 flex flex-wrap  gap-4">
                    {images.map((img, index) => (
                      <div key={index} className="relative w-24 h-24">
                        <img
                          src={
                            img instanceof File
                              ? URL.createObjectURL(img)
                              : img?.url
                          }
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
                      multiple
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                  <button
                    onClick={handleCreatePost}
                    type="submit"
                    disabled={isLoading}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1 rounded-md text-sm"
                  >
                    {isLoading ? "Posting..." : "Post"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

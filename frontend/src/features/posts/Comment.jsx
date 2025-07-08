import { Edit, MessageCircle, Send, Trash, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  useAddCommentMutation,
  useDeleteCommentMutation,
  useEditCommentMutation,
  useGetSinglePostQuery,
} from "./postApi";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Loader } from "lucide-react";

export default function Comment({ postId }) {
  const [deletingCommentId, setDeletingCommentId] = useState(null);
  const { user } = useSelector((state) => state.userSlice);
  const [editComment, { isLoading: isEditing }] = useEditCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const {
    data: posts,
    isLoading: isPostLoading,
    refetch,
  } = useGetSinglePostQuery(postId);
  const post = posts?.post;

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [addComment, { isLoading }] = useAddCommentMutation();
  const [showComment, setShowComment] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [localComments, setLocalComments] = useState([]);

  useEffect(() => {
    if (post?.comments) {
      setLocalComments(post.comments);
    }
  }, [post]);

  // const handleAddComment = async (e) => {
  //   e.preventDefault();

  //   try {
  //     await addComment({
  //       id: post._id,
  //       data: { text: commentText },
  //     }).unwrap();
  //     setCommentText("");
  //     refetch();
  //   } catch (error) {
  //     toast.error(error.data?.message || "Failed to add comment");
  //   }
  // };

  const handleAddComment = async (e) => {
    e.preventDefault();
    const newComment = {
      id: Date.now().toString(), // temporary ID
      text: commentText,

      author: {
        _id: user._id,
        username: user.username,
        profilePic: user.profilePic,
      },
    };

    // optimistic update UI
    setLocalComments([...localComments, newComment]);
    setCommentText("");

    try {
      await addComment({
        id: post._id,
        data: { text: commentText },
      }).unwrap();

      refetch(); //sync real data from backend
    } catch (error) {
      toast.error(error.data?.message || "Failed to add comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    setDeletingCommentId(commentId);
    try {
      await deleteComment({ id: post._id, commentId }).unwrap();
      refetch();
    } catch (error) {
      toast.error(error.data?.message || "Failed to delete comment");
    } finally {
      setDeletingCommentId(null);
    }
  };

  const startEditing = (comment) => {
    setEditingCommentId(comment._id);
    setEditingText(comment.text);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await editComment({
        id: post._id,
        commentId: editingCommentId,
        data: { text: editingText },
      }).unwrap();

      toast.success("Comment updated");
      setEditingCommentId(null);
      setEditingText("");
      refetch();
    } catch (error) {
      toast.error(error.data?.message || "Failed to edit comment");
    }
  };

  if (isPostLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <button
        onClick={() => setShowComment(!showComment)}
        className="flex items-center gap-1 text-gray-600 hover:text-orange-500 transition-colors"
        aria-label="Toggle comments"
      >
        <MessageCircle size={20} />
        <span className="text-sm">{post?.comments?.length || 0}</span>
      </button>

      {showComment && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="border-b  border-gray-300 p-4 flex justify-between items-center">
              <h3 className="font-semibold text-lg">Comments</h3>
              <button
                onClick={() => setShowComment(false)}
                className="p-1 rounded-full hover:bg-gray-100"
                aria-label="Close comments"
              >
                <X size={20} />
              </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {post?.comments?.length > 0 ? (
                post?.comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="flex gap-3 group hover:bg-gray-50 p-2 rounded-lg"
                  >
                    <img
                      src={comment?.author?.profilePic?.url}
                      alt={comment?.author?.username}
                      className="w-8 h-8 rounded-full object-cover mt-1"
                    />
                    <div className="flex-1">
                      {editingCommentId === comment._id ? (
                        <form onSubmit={handleEditSubmit}>
                          <textarea
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                            rows={3}
                            placeholder="Edit your comment..."
                            autoFocus
                          />
                          <div className="flex gap-2 mt-2 justify-end">
                            <button
                              type="button"
                              onClick={() => setEditingCommentId(null)}
                              className="px-3 py-1 text-sm text-gray-700 rounded-md hover:bg-gray-100"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            >
                              {isEditing ? (
                                <span className="flex items-center gap-2">
                                  <Loader className="animate-spin h-4 w-4" />
                                  Saving...
                                </span>
                              ) : (
                                "Save"
                              )}
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="relative">
                          <div className="bg-gray-100 rounded-2xl px-3 py-2 inline-block">
                            <p className="font-semibold text-sm text-gray-900">
                              {comment?.author?.username}
                            </p>
                            <p className="text-gray-800 text-sm whitespace-pre-wrap">
                              {comment?.text}
                            </p>
                          </div>
                          <div className="absolute right-8 top-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                            <button
                              onClick={() => startEditing(comment)}
                              className="p-1 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-full"
                              aria-label="Edit comment"
                            >
                              {comment?.author?._id === user?._id && (
                                <Edit size={14} />
                              )}
                            </button>
                            {deletingCommentId === comment._id ? (
                              <Loader className="animate-spin h-4 w-4 text-red-500" />
                            ) : (
                              <button
                                onClick={() => handleDeleteComment(comment._id)}
                                className="p-1 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full"
                                aria-label="Delete comment"
                              >
                                {comment?.author?._id === user?._id && (
                                  <Trash size={14} />
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No comments yet
                </div>
              )}
            </div>

            {/* Comment Input */}
            <div className="border-t border-gray-300 p-4">
              <form onSubmit={handleAddComment} className="flex gap-2">
                <img
                  src={user?.profilePic?.url}
                  alt="Your profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1 relative">
                  <input
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full p-2 pl-3 pr-10 bg-gray-100 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !commentText.trim()}
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${
                      isLoading || !commentText.trim()
                        ? "text-gray-400"
                        : "text-blue-500 hover:text-blue-600"
                    }`}
                    aria-label="Send comment"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

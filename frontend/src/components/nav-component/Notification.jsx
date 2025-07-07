import React from "react";
import { X } from "lucide-react";
import { useGetAllPostsQuery } from "../../features/posts/postApi";
import { useSelector } from "react-redux";

export default function Notification({ setShowNotification }) {
  const { data } = useGetAllPostsQuery();
  const { user } = useSelector((state) => state.userSlice);
  const posts = data?.posts;

  // Filter only the posts created by the logged-in user
  const myPosts = posts?.filter((post) => post?.author?._id === user?._id);

  // Check if there are any notifications (likes or comments from others)
  const hasNotifications = myPosts?.some(
    (post) =>
      post.likes?.some((like) => like?._id !== user._id) ||
      post.comments?.some((comment) => comment?.author?._id !== user._id)
  );

  return (
    <div className="w-80 bg-white border border-gray-300 rounded-xl shadow-xl p-4 overflow-y-auto max-h-96 z-999">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 border-b border-gray-300 pb-2">
        <h2 className="font-bold text-lg text-gray-800">Notifications</h2>
        <button
          onClick={() => setShowNotification(false)}
          className="text-gray-500 hover:text-red-600 transition"
        >
          <X />
        </button>
      </div>

      {/* Notifications */}
      {hasNotifications ? (
        myPosts.map((post) => (
          <div key={post._id} className="space-y-2 mb-4">
            {/* Likes */}
            {post.likes?.map(
              (like) =>
                like?._id !== user._id && (
                  <div
                    key={`like-${post._id}-${like._id}`}
                    className="flex items-start bg-gray-50 rounded-lg p-2 shadow-sm"
                  >
                    <div className="flex-grow text-sm text-gray-700">
                      <span className="font-semibold">{like.username}</span>{" "}
                      liked your post.
                    </div>
                  </div>
                )
            )}
            {/* Comments */}
            {post.comments?.map(
              (comment) =>
                comment?.author?._id !== user._id && (
                  <div
                    key={`comment-${post._id}-${comment._id}`}
                    className="flex items-start bg-gray-50 rounded-lg p-2 shadow-sm"
                  >
                    <div className="flex-grow text-sm text-gray-700">
                      <span className="font-semibold">
                        {comment.author.username}
                      </span>{" "}
                      commented on your post.
                    </div>
                  </div>
                )
            )}
          </div>
        ))
      ) : (
        <p className="text-center text-gray-400">No notifications</p>
      )}
    </div>
  );
}

import React from "react";
import profile from "../../assets/profile.png";
import { Loader } from "lucide-react";
import { useGetAllUsersQuery } from "../user/userApi";

export default function SuggestedUsers({ user, handleFollow, isLoading }) {
  const { data, isLoading: isUsersLoading } = useGetAllUsersQuery();

  const suggestedUsers = data?.users?.filter(
    (otherUser) =>
      //Is there no one in the following list whose ID matches otherUser._id
      !user?.following?.some((f) => f._id === otherUser._id) &&
      otherUser._id !== user?._id
  );

  return (
    <div>
      {isUsersLoading ? (
        <div className="flex justify-center py-4">
          <Loader className="animate-spin h-5 w-5 text-gray-500" />
        </div>
      ) : suggestedUsers?.length > 0 ? (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h1 className="text-lg font-semibold text-gray-800 mb-4">
            Suggested For You
          </h1>
          <div className="space-y-3">
            {suggestedUsers?.slice(0, 5).map((suggestedUser) => (
              <div
                key={suggestedUser._id}
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                {/* User info */}
                <div className="flex items-center gap-3">
                  <img
                    src={suggestedUser?.profilePic?.url || profile}
                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                    alt={suggestedUser.username}
                  />
                  <span className="font-medium text-gray-700">
                    {suggestedUser.username}
                  </span>
                </div>

                {/* Follow button - simplified */}
                <button
                  onClick={() => handleFollow(suggestedUser._id)}
                  disabled={isLoading} // Disable ALL buttons during ANY follow operation
                  className="text-sm bg-orange-500 hover:bg-orange-600 px-3 py-1 rounded-lg text-white transition-colors min-w-[80px]"
                >
                  {isLoading ? (
                    <Loader className="animate-spin h-4 w-4 mx-auto" />
                  ) : (
                    "Follow"
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-6 text-gray-400">
          <p>No suggestions available</p>
        </div>
      )}
    </div>
  );
}

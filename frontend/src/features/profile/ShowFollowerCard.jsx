import React, { useState } from "react";
import profile from "../../assets/profile.png";
import { X } from "lucide-react";
export default function ShowFollowerCard({
  user,
  setShowFollowersCard,
  showFollowersCard,
  isLoading,
  isFollowing,
  handleFollow,
}) {
  return (
    <div>
      {showFollowersCard && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white max-w-md w-full p-6 rounded-xl shadow-xl relative">
            <button
              className="absolute top-2 right-3 text-gray-400 hover:text-gray-600"
              onClick={() => setShowFollowersCard(false)}
            >
              <X />
            </button>
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              All Followers
            </h2>
            <div className="max-h-96 overflow-y-auto space-y-3">
              {user?.followers?.map((follower) => (
                <div
                  key={follower._id}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={follower?.profilePic?.url || profile}
                      alt={follower.username}
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                    <span className="font-medium text-gray-700">
                      {follower.username}
                    </span>
                  </div>
                  <button
                    onClick={() => handleFollow(follower._id)}
                    disabled={isLoading}
                    className={`text-sm px-3 py-1 rounded-lg transition-colors min-w-[80px] flex justify-center ${
                      isFollowing(follower._id)
                        ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                    }`}
                  >
                    {isFollowing(follower._id) ? "Following" : "Follow"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

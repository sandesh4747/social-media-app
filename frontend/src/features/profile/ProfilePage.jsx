import React, { useState } from "react";
import ProfileCard from "./ProfileCard";
import logo from "../../assets/logo.png";
import { Loader, Search } from "lucide-react";
import { useSelector } from "react-redux";
import profile from "../../assets/profile.png";
import { useToggleFollowMutation } from "../user/userApi";
import { toast } from "react-hot-toast";
import SuggestedUsers from "./SuggestedUsers";
import ShowFollowerCard from "./ShowFollowerCard";

export default function ProfilePage() {
  const [loadingUserId, setLoadingUserId] = useState(null);
  const [showAllFollowers, setShowAllFollowers] = useState(false);
  const [showFollowersCard, setShowFollowersCard] = useState(false);

  const { user } = useSelector((state) => state.userSlice);

  const [toogleFollow, { isLoading }] = useToggleFollowMutation();

  const handleFollow = async (userId) => {
    setLoadingUserId(userId);
    try {
      const response = await toogleFollow(userId).unwrap();
      toast.success(response?.message);
    } catch (error) {
      toast.error(error.data?.message || "Failed to follow");
    } finally {
      setLoadingUserId(null);
    }
  };
  const isFollowing = (targetUserId) => {
    return (
      user?.following?.some(
        (followedUser) =>
          followedUser?._id?.toString() === targetUserId?.toString()
      ) || false
    );
  };

  const followersToShow = showAllFollowers
    ? user?.followers
    : user?.followers.slice(0, 3);

  return (
    <div className="min-h-screen  bg-[#FEF5E0]/30   space-y-6">
      <div className="space-y-4 ">
        <ProfileCard user={user} />

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h1 className="text-lg font-semibold text-gray-800 mb-4">
            Who is following you
          </h1>
          <div className="space-y-3">
            {followersToShow?.length > 0 ? (
              followersToShow?.map((user, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={user?.profilePic?.url || profile}
                      className="w-10 h-10 rounded-full object-cover border border-gray-200"
                      alt={user.username}
                    />
                    <span className="font-medium text-gray-700">
                      {user?.username}
                    </span>
                  </div>
                  <button
                    onClick={() => handleFollow(user._id)}
                    disabled={isLoading}
                    className={`text-sm px-3 py-1 rounded-lg transition-colors min-w-[80px] flex justify-center ${
                      isFollowing(user._id)
                        ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        : "bg-orange-500 hover:bg-orange-600 text-white"
                    }`}
                  >
                    {loadingUserId === user._id ? (
                      <Loader className="animate-spin h-4 w-4" />
                    ) : isFollowing(user._id) ? (
                      "Following"
                    ) : (
                      "Follow"
                    )}
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-400">
                <p>No followers yet</p>
              </div>
            )}
          </div>

          {user?.followers?.length > 3 && (
            <div className="text-right mt-3">
              <button
                onClick={() => setShowFollowersCard(true)}
                className="text-sm text-orange-600 hover:underline"
              >
                See More
              </button>
            </div>
          )}
          <ShowFollowerCard
            handleFollow={handleFollow}
            isFollowing={isFollowing}
            isLoading={isLoading}
            user={user}
            setShowFollowersCard={setShowFollowersCard}
            showFollowersCard={showFollowersCard}
          />
        </div>

        <SuggestedUsers user={user} handleFollow={handleFollow} />
      </div>
    </div>
  );
}

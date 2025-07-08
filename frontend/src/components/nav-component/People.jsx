import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import profilePic from "../../assets/profile.png";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useGetAllUsersQuery,
  useGetMeQuery,
  useToggleFollowMutation,
} from "../../features/user/userApi";
import { setUser } from "../../features/user/userSlice";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";
import { useState } from "react";

export default function People() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userSlice);

  const { data: meData, refetch } = useGetMeQuery();
  const { data: allUsersData, isLoading: isUsersLoading } =
    useGetAllUsersQuery();
  const [toggleFollow, { isLoading }] = useToggleFollowMutation();
  const [loadingUserId, setLoadingUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    refetch();
  }, [location.pathname]);

  useEffect(() => {
    if (meData) {
      dispatch(setUser(meData?.user));
    }
  }, [meData, dispatch]);

  const suggestedUsers = allUsersData?.users?.filter(
    (otherUser) =>
      !user?.following?.some((f) => f._id === otherUser._id) &&
      otherUser._id !== user?._id
  );

  const handleFollow = async (userId) => {
    try {
      setLoadingUserId(userId);
      const res = await toggleFollow(userId).unwrap();
      toast.success(res?.message);
      refetch(); // update local user state after following
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
  return (
    <div className="max-w-4xl mx-auto p-4   pb-20 sm:pb-8">
      {/* People You May Know Section */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="text-xl font-bold mb-4">People You May Know</h2>

        {isUsersLoading ? (
          <div className="flex justify-center py-6">
            <Loader className="animate-spin h-5 w-5 text-gray-500" />
          </div>
        ) : suggestedUsers?.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {suggestedUsers?.slice(0, 6).map((person) => (
              <div
                key={person._id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <img
                  onClick={() => navigate(`/profile/${person._id}`)}
                  src={person.profilePic?.url || profilePic}
                  alt={person.username}
                  className="w-20 h-20 rounded-full mx-auto mb-3 object-cover cursor-pointer"
                />
                <h3 className="text-center font-medium">{person.username}</h3>

                <div className="flex gap-2 mt-3 items-center justify-center">
                  <button
                    onClick={() => handleFollow(person._id)}
                    disabled={loadingUserId === person._id}
                    className=" bg-orange-500 hover:bg-orange-600 text-white py-1 px-3 rounded-md text-sm "
                  >
                    {loadingUserId === person._id ? (
                      <Loader className="animate-spin h-4 w-4 mx-auto" />
                    ) : (
                      "Follow"
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-6">
            No suggestions available
          </p>
        )}
      </div>

      {/* people you are following */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="text-xl font-bold mb-4">People You Are Following</h2>

        {user?.following?.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {user?.following?.map((person) => (
              <div
                key={person._id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <img
                  onClick={() => navigate(`/profile/${person._id}`)}
                  src={person.profilePic?.url || profilePic}
                  alt={person.username}
                  className="w-20 h-20 rounded-full mx-auto mb-3 object-cover cursor-pointer"
                />
                <h3 className="text-center font-medium">{person.username}</h3>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <button
                    onClick={() => handleFollow(person._id)}
                    className={`  py-1 px-3 rounded-md text-sm  ${
                      (isFollowing(person._id) &&
                        "bg-gray-100 text-gray-700 hover:bg-gray-200") ||
                      "bg-orange-500 text-white"
                    }`}
                  >
                    {loadingUserId === person._id ? (
                      <Loader className="h-4 w-4 animate-spin" />
                    ) : isFollowing(person._id) ? (
                      "Following"
                    ) : (
                      "follow"
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-6">
            You are not following anyone
          </p>
        )}
      </div>

      {/* Your followers */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="text-xl font-bold mb-4">Your Followers</h2>

        {user?.followers?.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {user?.followers?.map((person, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4">
                <img
                  onClick={() => navigate(`/profile/${person._id}`)}
                  src={person.profilePic?.url || profilePic}
                  alt={person.username}
                  className="w-20 h-20 rounded-full mx-auto mb-3 object-cover cursor-pointer"
                />
                <h3 className="text-center font-medium">{person.username}</h3>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-6">
            You have no followers
          </p>
        )}
      </div>

      {/* Friends Section */}
      <div className="bg-white rounded-lg shadow p-4  ">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Your Friends</h2>
          <span className="text-gray-500">
            {user?.friends?.length || 0}{" "}
            {`${user?.friends?.length === 1 ? "friend" : "friends"}`}
          </span>
        </div>

        {user?.friends?.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {user?.friends?.map((friend, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4">
                <img
                  onClick={() => navigate(`/profile/${friend._id}`)}
                  src={friend.profilePic?.url || profilePic}
                  alt={friend.username}
                  className="w-20 h-20 rounded-full mx-auto mb-3 object-cover cursor-pointer"
                />
                <h3 className="text-center font-medium">{friend.username}</h3>
                <div className="flex justify-center gap-2 mt-3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>You don't have any friends yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

import React from "react";
import { FaUserPlus, FaSearch } from "react-icons/fa";
import profilePic from "../../../assets/profile.png";

export default function Friends({ user }) {
  const hasFriends = user?.friends?.length > 0;
  console.log("user user", user);
  return (
    <div className="bg-white rounded-lg shadow p-4 pb-15   ">
      {/* Friends Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Friends</h2>
      </div>

      {/* Friends Content */}
      {hasFriends ? (
        <div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-600">
              {user?.friends?.length}{" "}
              {user?.friends?.length === 1 ? "friend" : "friends"}
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {user?.friends?.map((friend) => (
              <div key={friend._id} className="text-center">
                <img
                  src={friend?.profilePic?.url || profilePic}
                  alt={friend?.username}
                  className="w-20 h-20 object-cover rounded-full mx-auto mb-2"
                />
                <p className="font-medium">{friend?.username}</p>
                <button className="mt-2 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md text-sm w-full"></button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-10">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FaUserPlus className="text-3xl text-gray-400" />
          </div>
          <h3 className="text-xl font-medium mb-2">No friends yet</h3>
          <p className="text-gray-600 mb-4">
            Connect with people to see them here
          </p>
        </div>
      )}
    </div>
  );
}

import React from "react";
import { useSelector } from "react-redux";

export default function OnlineFriends() {
  const { user } = useSelector((state) => state.userSlice);

  const hasFriends = user?.friends?.length > 0;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-semibold text-lg mb-2">Online Friends</h3>

      {hasFriends ? (
        <ul className="space-y-2">
          {user.friends.map((friend, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="font-medium">{friend.username}</span>
              <span className="text-gray-500 text-sm">Active now</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-gray-500 text-center py-4">
          <p>No friends online</p>
          <p className="text-sm">Connect with more people to see them here</p>
        </div>
      )}
    </div>
  );
}

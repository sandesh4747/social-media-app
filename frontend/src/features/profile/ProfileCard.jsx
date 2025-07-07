import React from "react";
import profile from "../../assets/profile.png";
import bgImage from "../../assets/bg.png";
import { useNavigate } from "react-router-dom";

export default function ProfileCard({ user }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/profile/${user?._id}`)}
      className="shadow-sm  rounded-xl flex flex-col gap-5 w-full  bg-gray-50 cursor-pointer"
    >
      <div className="relative">
        <img
          src={bgImage}
          alt=""
          className="h-25 w-full object-cover rounded-t-xl overflow-hidden"
        />
        <div className="flex items-center justify-center absolute -bottom-10 left-1/2 transform -translate-x-1/2">
          <img
            src={user?.profilePic?.url || profile}
            alt="profile image"
            className="w-20 h-20 rounded-full shadow-xl border-3 border-white object-cover"
          />
        </div>
      </div>
      <div className="text-center pt-8">
        <p className="font-semibold text-lg">{user?.username}</p>
      </div>

      <div className="border borber-t  text-gray-200" />

      <div className="flex justify-between items-center ">
        <div className="flex flex-col justify-center w-full items-center">
          {" "}
          <p className="font-medium">Follower</p>
          <p className="text-sm text-gray-600">
            {user?.followers?.length || 0}
          </p>
        </div>

        <div className="h-15 border-r border-gray-200" />

        <div className="flex flex-col justify-center w-full items-center">
          {" "}
          <p className="font-medium">Following</p>
          <p className="text-sm text-gray-600">
            {user?.following?.length || 0}
          </p>
        </div>
      </div>

      <div className="border borber-t  text-gray-200" />

      <div>
        <p className="font-medium text-center text-orange-600 pb-5">
          My Profile
        </p>
      </div>
    </div>
  );
}

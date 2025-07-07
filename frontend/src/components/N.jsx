import React, { useState } from "react";
import bgImg from "../../../assets/bg.png";
import { FaCamera, FaPencilAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import profilePic from "../../../assets/profile.png";
import PostPage from "../../../features/posts/PostPage";

import toast from "react-hot-toast";
import EditProfile from "./EditProfile";
import About from "./About";
import Friends from "./Friends";
import EditBio from "./EditBio";

export default function Profile() {
  const { user } = useSelector((state) => state.userSlice);
  const [selected, setSelected] = useState("Posts");
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [ShowEditBio, setShowEditBio] = useState(false);
  const list = ["Posts", "About", "Friends"];
  const tab = [
    {
      name: "Posts",
      component: <PostPage />,
    },
    {
      name: "About",
      component: <About user={user} />,
    },
    {
      name: "Friends",
      component: <Friends user={user} />,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto bg-white">
      {/* Cover Photo */}
      <div className="relative">
        <img
          src={bgImg}
          alt="cover"
          className="w-full h-[398px] object-cover"
        />
        <button className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-gray-800 px-3 py-1.5 rounded-md flex items-center gap-2 text-sm font-medium">
          <FaCamera />
          Edit cover photo
        </button>
      </div>

      {/* Profile Header */}
      <div className="relative px-4 md:px-6  border-gray-200 bg-white ">
        <div>
          <div className="flex  gap-5 relative">
            {/* Profile Picture */}
            <div>
              <div className=" w-36 h-36 border-4 border-white rounded-full shadow-md cursor-pointer flex shrink-0  mt-[-2.5rem] relative">
                <img
                  src={user?.profilePic?.url || profilePic}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
                <button className="absolute  bottom-0 left-20 bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600">
                  <FaCamera />
                </button>
              </div>
            </div>

            <div className="pb-3 pt-10 flex  justify-between w-full">
              {/* Username and Email */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 ">
                  {user?.username}
                </h2>
                <p>
                  {user?.friends?.length}{" "}
                  {user?.friends?.length === 1 ? "friend" : "friends"}
                </p>
              </div>
              {/* Right: Edit Profile Button */}
              <div className="pb-4 ">
                <button
                  onClick={() => setShowEditProfile(true)}
                  className="bg-gray-200 hover:bg-gray-300 px-4 py-1.5 rounded-md font-medium flex items-center gap-2 "
                >
                  <FaPencilAlt />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Tabs */}
      <div className="border-t border-gray-300 mt-4 bg-white flex justify-center">
        <div className="flex">
          {list.map((item) => (
            <div key={item}>
              <button
                onClick={() => setSelected(item)}
                key={item}
                className={`px-4 py-3 font-medium   ${
                  selected === item
                    ? " text-orange-500 border-b-2"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {item}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-col md:flex-row gap-4 p-4 justify-between">
        <div className="flex flex-col gap-4 w-full md:w-1/3">
          {/* Left Column - Intro */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="font-bold text-lg mb-4">Intro</h2>
            <p className="mb-4">{user?.bio || "No bio yet"}</p>
            <button
              onClick={() => setShowEditBio(true)}
              className="w-full bg-gray-100 hover:bg-gray-200 rounded-md py-1.5 font-medium"
            >
              Edit Bio
            </button>
            {ShowEditBio && (
              <EditBio setShowEditBio={setShowEditBio} user={user} />
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full md:w-2/3">
          <div>
            {tab.map((item) => (
              <div key={item.name}>
                {selected === item.name && item.component}
              </div>
            ))}
          </div>
        </div>
      </div>
      {showEditProfile && (
        <EditProfile setShowEditProfile={setShowEditProfile} />
      )}
    </div>
  );
}

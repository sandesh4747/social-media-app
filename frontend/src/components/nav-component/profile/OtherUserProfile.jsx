import React, { useState } from "react";
import bgImg from "../../../assets/bg.png";
import { FaCamera, FaPencilAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import profilePic from "../../../assets/profile.png";
import PostPage from "../../../features/posts/PostPage";

import toast from "react-hot-toast";
import EditProfile from "./EditProfile";
import About from "./About";
import Friends from "./Friends";
import EditBio from "./EditBio";
import { useNavigate, useParams } from "react-router-dom";
import { useGetSingleUserQuery } from "../../../features/user/userApi";
import UserPost from "./UserPost";
import LoadingSpinner from "../../LoadingSpinner";
import { LogOut } from "lucide-react";
import { useUserLogoutMutation } from "../../../features/authentication/authApi";
import { setUser } from "../../../features/user/userSlice";

export default function OtherUserProfile() {
  const { id } = useParams();
  const [userLogout] = useUserLogoutMutation();
  const { data, isLoading } = useGetSingleUserQuery(id);
  const { user: me } = useSelector((state) => state.userSlice);

  const [selected, setSelected] = useState("Posts");
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [ShowEditBio, setShowEditBio] = useState(false);
  const list = ["Posts", "About", "Friends"];
  const user = data?.user;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tab = [
    {
      name: "Posts",
      component: <UserPost userId={user?._id} />,
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

  const handleLogout = async () => {
    try {
      await userLogout().unwrap();
      dispatch(setUser(null));
      navigate("/login");
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(
        error?.data?.message || "Failed to logout. Please try again."
      );
    }
  };

  if (isLoading) return <LoadingSpinner />;
  return (
    <div className="max-w-7xl  mx-auto bg-white">
      {/* Cover Photo */}
      <div className="relative">
        <img
          src={bgImg}
          alt="cover"
          className="w-full h-[398px] object-cover"
        />

        {/* {me?._id === user?._id && (
          <button className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-gray-800 px-3 py-1.5 rounded-md flex items-center gap-2 text-sm font-medium">
            <FaCamera />
            Edit cover photo
          </button>
        )} */}
      </div>

      {/* Profile Header */}
      <div className="relative px-4 md:px-6  border-gray-200 bg-white ">
        <div>
          <div className="flex  gap-5 relative">
            {/* Profile Picture */}
            <div>
              <div className="w-20 h-20 sm:w-26 sm:h-26 md:w-36 md:h-36 border-4 border-white rounded-full shadow-md cursor-pointer flex shrink-0  mt-[-2.5rem] relative">
                <img
                  src={user?.profilePic?.url || profilePic}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
                <button className="absolute  bottom-0 left-10 sm:left-12 md:left-20 bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600">
                  <FaCamera />
                </button>
              </div>
            </div>

            <div className="pb-3 pt-10 flex justify-between items-start w-full flex-wrap gap-4">
              {/* Left: Username and Stats */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {user?.username}
                </h2>

                {/* Stats */}
                <div className="flex gap-6 mt-2 text-gray-600 text-sm">
                  <div className="flex flex-col items-center">
                    <span className="font-semibold text-base">
                      {user?.friends?.length || 0}
                    </span>
                    <span>
                      {user?.friends?.length === 1 ? "Friend" : "Friends"}
                    </span>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="font-semibold text-base">
                      {user?.followers?.length || 0}
                    </span>
                    <span>
                      {user?.followers?.length === 1 ? "Follower" : "Followers"}
                    </span>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="font-semibold text-base">
                      {user?.following?.length || 0}
                    </span>
                    <span>Following</span>
                  </div>
                </div>
              </div>

              {/* Right: Edit Profile Button */}
              {me?._id === user?._id && (
                <div>
                  <button
                    onClick={() => setShowEditProfile(true)}
                    className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md font-medium flex items-center gap-2"
                  >
                    <FaPencilAlt className="text-gray-700" />
                    Edit Profile
                  </button>
                </div>
              )}
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

            {me?._id === user?._id && (
              <div>
                <button
                  onClick={() => setShowEditBio(true)}
                  className="w-full bg-gray-100 hover:bg-gray-200 rounded-md py-1.5 font-medium"
                >
                  Edit Bio
                </button>
              </div>
            )}

            {ShowEditBio && (
              <EditBio setShowEditBio={setShowEditBio} user={user} />
            )}
          </div>

          {me?._id === user?._id && (
            <div
              className="bg-white rounded-lg shadow p-4"
              onClick={handleLogout}
            >
              {" "}
              <button
                className=" mt-15 
              w-full bg-white text-orange-500 hover:text-orange-700 rounded-md py-1.5 font-medium flex gap-3"
              >
                <LogOut />
                <p>Logout</p>
              </button>
            </div>
          )}
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

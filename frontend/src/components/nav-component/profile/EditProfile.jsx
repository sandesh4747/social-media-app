import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useUpdateProfileMutation } from "../../../features/user/userApi";
import { FaCamera, FaTimes } from "react-icons/fa";
import profile from "../../../assets/profile.png";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../../features/user/userSlice";
import { Loader } from "lucide-react";

export default function EditProfile({ setShowEditProfile }) {
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const { user } = useSelector((state) => state.userSlice);

  const [bio, setBio] = useState("");
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState("");

  useEffect(() => {
    if (user) {
      setBio(user?.bio || "");
      setUsername(user?.username || "");
      setProfilePic(user?.profilePic || profile);
    }
  }, [user]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleEditProfile = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("username", username);
    formData.append("bio", bio);
    if (profilePic) formData.append("profilePic", profilePic);
    try {
      const response = await updateProfile(formData).unwrap();
      dispatch(setUser(response?.user));
      setShowEditProfile(false);

      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(
        error?.data?.message || "Failed to update profile. Please try again."
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Profile</h2>
          <button
            onClick={() => setShowEditProfile(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleEditProfile} className="space-y-4">
          {/* Profile Picture Upload */}
          <div className="mb-4 flex flex-col items-center">
            <div className="relative w-32 h-32 mb-4">
              <label className="cursor-pointer block w-full h-full">
                <img
                  src={
                    profilePic
                      ? typeof profilePic?.url === "string"
                        ? profilePic?.url
                        : URL.createObjectURL(profilePic)
                      : profile
                  }
                  alt="Profile Preview"
                  className="w-full h-full rounded-full object-cover border-4 border-orange-500"
                />

                <div className="absolute bottom-0 right-0 bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600">
                  <FaCamera />
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) setProfilePic(file);
                  }}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Username Field */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Username</label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          {/* Bio Field */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Bio</label>
            <textarea
              name="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3 py-2 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              rows="4"
            ></textarea>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowEditProfile(false)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md disabled:opacity-70"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

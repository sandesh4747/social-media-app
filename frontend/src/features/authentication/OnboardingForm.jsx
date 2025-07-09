import React, { useState } from "react";
import { useOnboardMutation } from "./authApi";
import { Camera } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../user/userSlice";
import profileLogo from "../../assets/profile.png";

export default function OnboardingForm() {
  const navigate = useNavigate();
  const [bio, setBio] = useState("");
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const dispatch = useDispatch();

  const [onboard, { isLoading }] = useOnboardMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", username);
    formData.append("bio", bio);
    if (profilePic) formData.append("profilePic", profilePic);

    try {
      const response = await onboard(formData).unwrap();
      dispatch(setUser(response?.user));
      navigate("/");
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.data?.message || "Failed to update profile");
    }
  };

  return (
    <div className="h-[calc(100vh-10rem)]  flex items-center justify-center px-4 bg-[#f0f2f5]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-orange-600">
          Complete Your Profile
        </h2>

        <div className="relative mx-auto w-28 h-28 group">
          <label htmlFor="profilePic" className="cursor-pointer">
            <img
              className="w-28 h-28 rounded-full object-cover border border-orange-300 shadow-sm"
              src={
                profilePic
                  ? typeof profilePic === "string"
                    ? profilePic
                    : URL.createObjectURL(profilePic)
                  : profileLogo
              }
              alt="avatar"
            />
            <div className="absolute bottom-0 right-0 bg-orange-100 p-2 rounded-full border border-orange-300 shadow-md group-hover:scale-110 transition-transform">
              <Camera className="h-5 w-5 text-orange-600" />
            </div>
          </label>
          <input
            type="file"
            id="profilePic"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) setProfilePic(file);
            }}
          />
        </div>

        <div className="text-xs text-gray-500 text-center">
          Click the image to change your profile picture
        </div>

        <input
          type="text"
          className="w-full p-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <textarea
          rows={3}
          className="w-full p-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Write your bio here..."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium transition-colors duration-300  ${
            isLoading ? "opacity-50 cursor-not-allowed text-gray-500" : ""
          }`}
        >
          {isLoading ? "Saving..." : "Complete Profile"}
        </button>
      </form>
    </div>
  );
}

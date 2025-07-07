import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useUpdateProfileMutation } from "../../../features/user/userApi";
import { Loader } from "lucide-react";
import { setUser } from "../../../features/user/userSlice";

export default function EditBio({ setShowEditBio, user }) {
  const dispatch = useDispatch();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [bio, setBio] = useState("");

  useEffect(() => {
    if (user) {
      setBio(user?.bio || "");
    }
  }, [user]);

  const handleEditBio = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("bio", bio);

    try {
      const response = await updateProfile(formData).unwrap();
      dispatch(setUser(response?.user));
      toast.success("Bio updated successfully");
      setShowEditBio(false);
    } catch (error) {
      toast.error(
        console.log(error),
        error?.data?.message || "Failed to update bio. Please try again."
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <form onSubmit={handleEditBio}>
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
              onClick={() => setShowEditBio(false)}
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

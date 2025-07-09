import { updateProfileSchema } from "../middleware/validator.js";
import { Post } from "../models/Post.js";
import User from "../models/User.js";

export const getAllUser = async (req, res) => {
  try {
    const { search } = req.query;
    const query = search ? { username: { $regex: search, $options: "i" } } : {}; // i for case-insensitive
    const users = await User.find(query).select("-password");

    if (!users) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json({ success: true, users });
  } catch (error) {
    console.log("Error in getAllUser controller", error);
    res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    // First get the populated user document
    const user = await User.findById(req.user._id).populate([
      { path: "followers", select: "_id username profilePic" },
      { path: "following", select: "_id username profilePic" },
    ]);

    // Then convert to plain object if needed
    const userObject = user.toObject();

    // Find mutual connections
    const friends = user.following.filter((followedUser) =>
      user.followers.some(
        (followerUser) =>
          followerUser._id.toString() === followedUser._id.toString()
      )
    );

    user.friends = friends;
    await user.save();

    res.status(200).json({
      success: true,
      user: {
        ...userObject,
        password: undefined,
        friends,
      },
    });
  } catch (error) {
    console.error("Error in getMe:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const toggleFollow = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const targetUserId = req.params.id;
    if (currentUserId.toString() === targetUserId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }
    const currentUser = await User.findById(currentUserId);

    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isFollowing = currentUser.following.includes(targetUserId);

    if (isFollowing) {
      currentUser.following.pull(targetUserId);
      targetUser.followers.pull(currentUserId);
    } else {
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUserId);
    }

    await currentUser.save();
    await targetUser.save();

    res.status(200).json({
      success: true,
      following: currentUser.following,
      followers: targetUser.followers,
      message: isFollowing ? "Unfollowed user" : "Followed user",
    });
  } catch (error) {
    console.log("Error in toggleFollow controller", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { username, bio } = await updateProfileSchema.validateAsync(
      req.body,
      {
        abortEarly: false,
      }
    );

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (username) user.username = username;
    if (bio) user.bio = bio;
    if (req.file)
      user.profilePic = { url: req.file.path, public_id: req.file.filename };

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        ...updatedUser._doc,
        password: undefined,
      },
    });
  } catch (error) {
    if (error.isJoi) {
      return res.status(400).json({ message: error.details[0].message });
    }
    console.error("Error in updateProfile controller", error);
    res.status(500).json({ message: error.message });
  }
};

export const getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("friends");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const posts = await Post.find({ author: user._id });
    res.status(200).json({
      success: true,
      user: {
        ...user._doc,
        password: undefined,
        posts,
      },
    });
  } catch (error) {
    console.error("Error in getSingleUser controller", error);
    res.status(500).json({ message: error.message });
  }
};

// Search posts or users
export const searchUsers = async (req, res) => {
  const { query } = req.query;

  // Validate query exists and has minimum length
  if (!query || query.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: "Search query must be at least 2 characters long",
    });
  }

  try {
    // Search users with better matching (starts with first, then contains)
    const users = await User.find({
      $or: [
        { username: { $regex: `^${query}`, $options: "i" } }, // Exact start matches first
        { username: { $regex: query, $options: "i" } }, // Then contains matches
      ],
    })
      .select("username profilePic")
      .sort({ username: 1 }) // Alphabetical order
      .limit(10); // Limit results for performance

    res.status(200).json({
      success: true,
      users,
      count: users.length,
    });
  } catch (error) {
    console.error("User search error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

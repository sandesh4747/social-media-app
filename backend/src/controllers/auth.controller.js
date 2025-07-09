import { generateTokenAndSetCookie } from "../lib/generateTokenAndSetCookie.js";
import {
  loginSchema,
  onboardSchema,
  registerSchema,
} from "../middleware/validator.js";
import User from "../models/User.js";

// SINGUP
export const signup = async (req, res) => {
  try {
    const { username, email, password } = await registerSchema.validateAsync(
      req.body,
      { abortEarly: false }
    ); //return all validation errors

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ message: "Please enter a valid email address" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = await User.create({
      email,
      username,
      password,
    });
    generateTokenAndSetCookie(res, user._id);

    res
      .status(201)
      .json({ success: true, user: { ...user._doc, password: undefined } });
  } catch (error) {
    if (error.isJoi) {
      return res.status(400).json({ message: error.details[0].message });
    }
    console.log("Error in signup controller", error);
    res.status(500).json({ message: error.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = await loginSchema.validateAsync(req.body, {
      abortEarly: false,
    }); //return all validation errors

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    generateTokenAndSetCookie(res, user._id);

    res
      .status(200)
      .json({ success: true, user: { ...user._doc, password: undefined } });
  } catch (error) {
    if (error.isJoi) {
      return res.status(400).json({ message: error.details[0].message });
    }
    console.log("Error in login controller", error);
    res.status(500).json({ message: error.message });
  }
};

// LOGOUT
export const logout = async (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

// ONBOARD
export const onboard = async (req, res) => {
  try {
    const userId = req.user._id;
    const { username, bio } = await onboardSchema.validateAsync(req.body, {
      abortEarly: false,
    });

    if (!username) {
      return res.status(400).json({
        message: "Username is required",
      });
    }

    if (!bio) {
      return res.status(400).json({
        message: "Bio is required",
      });
    }
    const profilePic = req.file
      ? {
          url: req.file.path,
          public_id: req.file.filename,
        }
      : undefined;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...req.body,
        isOnboarded: true,
        profilePic,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user: { ...updatedUser._doc, password: undefined },
    });
  } catch (error) {
    if (error.isJoi) {
      return res.status(400).json({ message: error.details[0].message });
    }
    console.log("Error in onboard controller", error);
    res.status(500).json({ message: error.message });
  }
};

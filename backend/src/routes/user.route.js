import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  getAllUser,
  getMe,
  getSingleUser,
  toggleFollow,
  updateProfile,
} from "../controllers/user.controller.js";
import { upload } from "../lib/upload.js";
import { getUserPosts } from "../controllers/post.controller.js";

const router = express.Router();
router.get("/", protectRoute, getAllUser);

router.get("/me", protectRoute, getMe);
router.get("/:id", protectRoute, getSingleUser);

router.patch("/follow/:id", protectRoute, toggleFollow);
router.get("/:id/posts", getUserPosts);
router.patch(
  "/update",
  upload.single("profilePic"),
  protectRoute,
  updateProfile
);

export default router;

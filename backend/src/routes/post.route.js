import express from "express";
import {
  addComment,
  createPost,
  deleteComment,
  deletePost,
  editComment,
  getAllPosts,
  getSinglePost,
  getUserPosts,
  toogleLike,
  updatePost,
} from "../controllers/post.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";
import { upload } from "../lib/upload.js";
import {
  commentSchema,
  postSchema,
  validates,
} from "../middleware/validator.js";
const router = express.Router();

router.get("/", getAllPosts);
router.post(
  "/create",
  protectRoute,
  upload.array("images", 4),
  // validates.body(postSchema),

  createPost
);
router.get("/:id", getSinglePost);

router.put(
  "/update/:id",
  protectRoute,
  upload.array("images", 5),
  // validates.body(postSchema),
  updatePost
);

router.post("/like/:id", protectRoute, toogleLike);
router.post(
  "/comment/:id",
  protectRoute,
  // validates.body(commentSchema),
  addComment
);
router.patch(
  "/:id/comment/:commentId",
  protectRoute,
  // validates.body(commentSchema),
  editComment
);
router.delete("/:id/comment/:commentId", protectRoute, deleteComment);

router.delete("/delete/:id", protectRoute, deletePost);

export default router;

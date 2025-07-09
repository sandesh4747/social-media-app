import express from "express";
import {
  login,
  logout,
  onboard,
  signup,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  loginSchema,
  registerSchema,
  updateProfileSchema,
  validates,
} from "../middleware/validator.js";
import { upload } from "../lib/upload.js";

const router = express.Router();

router.post(
  "/signup",

  signup
);
router.post(
  "/login",

  login
);
router.post("/logout", logout);

router.post(
  "/onboard",
  protectRoute,
  upload.single("profilePic"),

  onboard
);

export default router;

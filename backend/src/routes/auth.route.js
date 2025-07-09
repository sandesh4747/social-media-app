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
  // validates.body(registerSchema),
  signup
);
router.post(
  "/login",
  //  validates.body(loginSchema),
  login
);
router.post("/logout", logout);

router.post(
  "/onboard",
  protectRoute,
  upload.single("profilePic"),
  // validates.body(updateProfileSchema),
  onboard
);

export default router;

import express from "express";
import {
  login,
  signup,
  google,
  signOut,
  githubAuth,
  githubCallback,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/signout", signOut);
router.post("/google", google);
router.get("/github", githubAuth);
router.get("/github/callback", githubCallback);

export default router;

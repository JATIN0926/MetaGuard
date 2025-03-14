import express from "express";
import {
  login,
  signup,
  google,
  signOut,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/signout", signOut);
router.post("/google", google);

export default router;

import express from "express";
import { updateUserProfile , getUserProfile  } from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.put("/edit", verifyToken, updateUserProfile);
router.get("/me", verifyToken, getUserProfile); 
export default router;

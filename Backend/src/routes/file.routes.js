import express from "express";
import { uploadFile } from "../controllers/file.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js"; 

const router = express.Router();

// Routes
router.post("/upload", verifyToken, uploadFile);  // No need for multer here

export default router;

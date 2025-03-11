import express from "express";
import { uploadFile, getUserFiles } from "../controllers/file.controller.js";
import multer from "multer";
import { verifyToken } from "../middlewares/auth.middleware.js"; 

const router = express.Router();

const upload = multer(); // Middleware for handling multipart form data

// Routes
router.post("/upload", verifyToken, upload.single("file"), uploadFile);
router.get("/", verifyToken, getUserFiles);

export default router;

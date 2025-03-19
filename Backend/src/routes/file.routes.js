import express from "express";
import { uploadFile , fetchMetadata } from "../controllers/file.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js"; 

const router = express.Router();

// Routes
router.post("/upload", verifyToken, uploadFile);
router.get("/metadata", verifyToken, fetchMetadata); 

export default router;

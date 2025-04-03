import express from "express";
import {
  uploadFile,
  fetchMetadata,
  uploadUserFile,
  getUserFiles,
  decryptFile,
  deleteFile,
} from "../controllers/file.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Routes
router.post("/upload", verifyToken, uploadFile);
router.get("/metadata", verifyToken, fetchMetadata);
router.post("/user-files/upload", verifyToken, uploadUserFile);
router.get("/user-files/get-files", verifyToken, getUserFiles);
router.post("/user-files/decrypt", verifyToken, decryptFile);
router.delete("/user-files/delete/:fileId", verifyToken, deleteFile);


export default router;

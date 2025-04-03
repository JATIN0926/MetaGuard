import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../config/s3Config.js";
import streamToString from "../utils/streamToString.js";
import upload from "../config/multerConfig.js";
import File from "../models/file.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

const SECRET_KEY = process.env.FILE_ENCRYPTION_KEY;

export const uploadFile = async (req, res) => {
  console.log("📥 Upload request received");

  upload.single("file")(req, res, async (err) => {
    if (err) {
      console.error("❌ Multer error:", err);
      return res
        .status(500)
        .json({ message: "File upload failed", error: err });
    }

    try {
      if (!req.file) {
        console.log("❌ No file uploaded");
        return res.status(400).json({ message: "No file uploaded" });
      }

      // ✅ Sanitize filename (Replace spaces & underscores with "+")
      const sanitizedFileName = req.file.originalname.replace(/[\s_]+/g, "+");
      const uniqueFileName = `${Date.now()}-${sanitizedFileName}`;
      const s3FilePath = `uploads/${uniqueFileName}`;

      console.log("📂 Uploading file to S3 path:", s3FilePath);

      // ✅ Upload file to S3
      const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: s3FilePath,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      await s3.send(new PutObjectCommand(uploadParams));

      // ✅ Construct S3 file URL
      const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3FilePath}`;

      console.log("✅ File Uploaded Successfully:", {
        originalName: req.file.originalname,
        fileUrl,
      });

      // ✅ Save file metadata in MongoDB
      const newFile = await File.create({
        user: req.user.id,
        originalName: req.file.originalname,
        s3Url: fileUrl,
      });

      // ✅ Link file to user
      await User.findByIdAndUpdate(req.user.id, {
        $push: { files: newFile._id },
      });

      console.log("✅ File entry saved in DB:", newFile);

      // ✅ Send sanitized filename without "uploads/"
      res.status(201).json({
        message: "File uploaded successfully",
        file: newFile,
        sanitizedFileName: uniqueFileName, // Removed "uploads/"
      });
    } catch (error) {
      console.error("❌ Error saving file entry:", error);
      res.status(500).json({ message: "Internal server error", error });
    }
  });
};

export const fetchMetadata = async (req, res) => {
  try {
    let { fileName } = req.query;

    console.log("📂 Received fileName:", fileName);

    if (!fileName) {
      return res.status(400).json({ message: "fileName is required" });
    }

    const metadataFileName = `${fileName}.metadata.json`;
    console.log("📂 Fetching metadata file:", metadataFileName);

    const getParams = {
      Bucket: process.env.AWS_METADATA_BUCKET,
      Key: metadataFileName,
    };

    try {
      const metadataObject = await s3.send(new GetObjectCommand(getParams));
      const metadataString = await streamToString(metadataObject.Body);
      const metadata = JSON.parse(metadataString);

      console.log("✅ Metadata fetched successfully:", metadata);
      return res.status(200).json({ metadata, malicious: false });
    } catch (error) {
      if (error.name === "NoSuchKey") {
        console.warn("⚠️ Metadata not found. Marking file as malicious.");
        return res
          .status(404)
          .json({ message: "Malicious file detected!", malicious: true });
      }
      throw error;
    }
  } catch (error) {
    console.error("❌ Error fetching metadata:", error);
    res.status(500).json({ message: "Failed to fetch metadata", error });
  }
};


export const uploadUserFile = async (req, res) => {
  console.log("📥 Upload request received for user files");

  upload.single("file")(req, res, async (err) => {
    if (err) {
      console.error("❌ Multer error:", err);
      return res
        .status(500)
        .json({ message: "File upload failed", error: err });
    }

    try {
      if (!req.file) {
        console.log("❌ No file uploaded");
        return res.status(400).json({ message: "No file uploaded" });
      }

      const { password } = req.body; // Get password from request
      let encryptedKey = null;
      let passwordProtected = false;

      if (password) {
        passwordProtected = true;

        // ✅ Hash password before storing
        const saltRounds = 10;
        encryptedKey = bcrypt.hashSync(password, saltRounds);
      }

      const sanitizedFileName = req.file.originalname.replace(/\s+/g, "_");
      const uniqueFileName = `${Date.now()}-${sanitizedFileName}`;
      const s3FilePath = `user-files/${req.user.id}/${uniqueFileName}`;

      console.log("📂 Uploading file to S3:", s3FilePath);

      const uploadParams = {
        Bucket: process.env.AWS_STORE_BUCKET,
        Key: s3FilePath,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      await s3.send(new PutObjectCommand(uploadParams));

      const fileUrl = `https://${process.env.AWS_STORE_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3FilePath}`;
      console.log("✅ File uploaded successfully:", fileUrl);

      const newFile = await File.create({
        user: req.user.id,
        originalName: req.file.originalname,
        s3Url: fileUrl,
        passwordProtected,
        encryptedKey, // ✅ Store bcrypt-hashed password
      });

      await User.findByIdAndUpdate(req.user.id, {
        $push: { files: newFile._id },
      });

      res.status(201).json({
        message: "File uploaded successfully",
        file: {
          originalName: newFile.originalName,
          s3Url: newFile.s3Url,
          _id: newFile._id,
          passwordProtected: newFile.passwordProtected, // Inform frontend
        },
      });
    } catch (error) {
      console.error("❌ Error saving file entry:", error);
      res.status(500).json({ message: "Internal server error", error });
    }
  });
};


export const getUserFiles = async (req, res) => {
  try {
    const userFiles = await User.findById(req.user.id)
      .populate("files", "originalName s3Url passwordProtected createdAt")
      .select("files");

    if (!userFiles) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ files: userFiles.files });
  } catch (error) {
    console.error("❌ Error fetching user files:", error);
    res.status(500).json({ message: "Failed to retrieve files", error });
  }
};

export const decryptFile = async (req, res) => {
  try {
    const { fileId, password } = req.body;

    if (!fileId || !password) {
      return res
        .status(400)
        .json({ message: "File ID and password are required" });
    }

    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    console.log("file", file);
    console.log("file pars ", !file.passwordProtected, !file.encryptedKey);

    if (!file.passwordProtected || !file.encryptedKey) {
      return res
        .status(400)
        .json({ message: "This file is not password protected" });
    }

    // ✅ Compare entered password with stored hashed password
    const isPasswordCorrect = bcrypt.compareSync(password, file.encryptedKey);

    console.log("🔍 Password Match:", isPasswordCorrect);

    if (!isPasswordCorrect) {
      return res.status(403).json({ message: "Incorrect password" });
    }

    res.status(200).json({ message: "Password is correct", fileUrl: file.s3Url });
  } catch (error) {
    console.error("❌ Error validating file password:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};


export const deleteFile = async (req, res) => {
  try {
    const { fileId } = req.params;

    const file = await File.findById(fileId);
    if (!file) return res.status(404).json({ message: "File not found" });

    // 🔹 Ensure the file belongs to the user
    if (file.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to delete this file" });
    }

    // Extract S3 key from the URL
    const s3Key = file.s3Url.split(".amazonaws.com/")[1];

    // 🔹 Delete from S3
    await s3.send(new DeleteObjectCommand({
      Bucket: process.env.AWS_STORE_BUCKET,
      Key: s3Key,
    }));

    // 🔹 Remove from DB
    await File.findByIdAndDelete(fileId);
    await User.findByIdAndUpdate(req.user.id, { $pull: { files: fileId } });

    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting file:", error);
    res.status(500).json({ message: "Failed to delete file", error });
  }
};


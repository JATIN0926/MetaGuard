import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../config/s3Config.js";
import streamToString from "../utils/streamToString.js"; // Utility to convert stream to string
import upload from "../config/multerConfig.js";
import File from "../models/file.model.js";
import User from "../models/user.model.js";

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

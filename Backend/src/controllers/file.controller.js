import multer from "multer";
import dotenv from "dotenv";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"; // ✅ AWS SDK v3
import File from "../models/file.model.js";
import User from "../models/user.model.js";

dotenv.config();

// ✅ Configure AWS SDK v3 S3 Client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// ✅ Configure Multer for Local Storage (NOT multer-s3)
const storage = multer.memoryStorage(); // Store file in memory for manual upload
const upload = multer({ storage });

// ✅ Upload File Controller with Manual S3 Upload
export const uploadFile = async (req, res) => {
  console.log("📥 Upload request received");

  upload.single("file")(req, res, async (err) => {
    if (err) {
      console.error("❌ Multer error:", err);
      return res.status(500).json({ message: "File upload failed", error: err });
    }

    try {
      if (!req.file) {
        console.log("❌ No file uploaded");
        return res.status(400).json({ message: "No file uploaded" });
      }

      const fileName = `uploads/${Date.now()}-${req.file.originalname}`;
      console.log("📂 Uploading file to S3 path:", fileName);

      // ✅ Upload file manually to S3
      const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      await s3.send(new PutObjectCommand(uploadParams));

      // ✅ Construct S3 file URL
      const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

      console.log("✅ File Uploaded Successfully:", { originalName: req.file.originalname, fileUrl });

      // ✅ Save file metadata in MongoDB
      const newFile = await File.create({
        user: req.user.id,
        originalName: req.file.originalname,
        s3Url: fileUrl,
      });

      // ✅ Link file to user
      await User.findByIdAndUpdate(req.user.id, { $push: { files: newFile._id } });

      console.log("✅ File entry saved in DB:", newFile);
      res.status(201).json({ message: "File uploaded successfully", file: newFile });

    } catch (error) {
      console.error("❌ Error saving file entry:", error);
      res.status(500).json({ message: "Internal server error", error });
    }
  });
};

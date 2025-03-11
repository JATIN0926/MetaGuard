import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";
import dotenv from "dotenv";
import File from "../models/file.model.js";
import User from "../models/user.model.js";

dotenv.config();

// AWS S3 Configuration
const s3 = new aws.S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION,
});

// Multer-S3 Storage Configuration
const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, `uploads/${Date.now()}-${file.originalname}`);
    },
  }),
});

// Upload File Controller
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { originalname, location } = req.file; // `location` contains S3 URL

    // Create a new file entry in MongoDB
    const newFile = await File.create({
      user: req.user.id,
      originalName: originalname,
      s3Url: location,
    });

    // Link the file to the user
    await User.findByIdAndUpdate(req.user.id, { $push: { files: newFile._id } });

    res.status(201).json({ message: "File uploaded successfully", file: newFile });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get User Files
export const getUserFiles = async (req, res) => {
  try {
    const userFiles = await File.find({ user: req.user.id });
    res.status(200).json(userFiles);
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

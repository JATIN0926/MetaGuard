import mongoose from "mongoose";

const FileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    originalName: { type: String, required: true },
    s3Url: { type: String, required: true },
    encrypted: { type: Boolean, default: false },
    passwordProtected: { type: Boolean, default: false },
    sanitized: { type: Boolean, default: false },
    sanitizedS3Url: { type: String, default: null },
    sanitizedMetadata: { type: [String], default: [] },
  },
  { timestamps: true }
);

const File = mongoose.model("File", FileSchema);
export default File;

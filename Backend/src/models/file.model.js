const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    originalName: { type: String, required: true },
    sanitizedName: { type: String, required: true },
    s3Url: { type: String, required: true },
    encrypted: { type: Boolean, default: false },
    passwordProtected: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("File", FileSchema);

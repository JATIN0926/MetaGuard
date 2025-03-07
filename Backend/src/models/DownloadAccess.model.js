const mongoose = require("mongoose");

const DownloadAccessSchema = new mongoose.Schema(
  {
    file: { type: mongoose.Schema.Types.ObjectId, ref: "File", required: true },
    grantedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    password: { type: String }, 
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DownloadAccess", DownloadAccessSchema);

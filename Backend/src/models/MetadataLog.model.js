const mongoose = require("mongoose");

const MetadataLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    file: { type: mongoose.Schema.Types.ObjectId, ref: "File", required: true },
    metadata: { type: Object, required: true }, 
    sanitized: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MetadataLog", MetadataLogSchema);

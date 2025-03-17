import multer from "multer";

// ✅ Configure Multer for Memory Storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

export default upload;

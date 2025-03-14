import "dotenv/config";
import express from "express";
import cors from "cors";
import AuthRoutes from "./src/routes/auth.routes.js"; 
import FileRoutes from "./src/routes/file.routes.js";
import connectDB from "./src/config/db.js"
const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("MetaGuard API is running...");
});

app.use("/api/auth", AuthRoutes);  
app.use("/api/files", FileRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

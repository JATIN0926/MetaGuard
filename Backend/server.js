import "dotenv/config";
import express from "express";
import cors from "cors";
import UserRoutes from "./src/routes/auth.routes.js"; 
import FileRoutes from "./src/routes/file.routes.js";
import connectDB from "./src/config/db.js"
const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("MetaGuard API is running...");
});

app.use("/api/user", UserRoutes);  
app.use("/api/files", FileRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

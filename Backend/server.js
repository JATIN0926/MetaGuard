import "dotenv/config";
import express from "express";
import cors from "cors";
import UserRoutes from "./src/routes/user.route.js"; 

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("MetaGuard API is running...");
});

app.use("/api/user", UserRoutes);  

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

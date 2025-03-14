import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token =  req.cookies?.access_token ||
  req.header("Authorization")?.replace("Bearer ", ""); //get token
  console.log("token", token);
  if (!token) return res.status(403).json({ message: "Unauthorized access" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

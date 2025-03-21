import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

// Update user profile (username, password, or both)
export const updateUserProfile = async (req, res) => {
  try {
    const { username, password } = req.body;
    const userId = req.user.id;

    console.log("userid", userId);
    if (!username && !password) {
      return res.status(400).json({ message: "No data to update" });
    }

    const updates = {};
    if (username) updates.username = username;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    });

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        username: updatedUser.username,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user", error: error.message });
  }
};

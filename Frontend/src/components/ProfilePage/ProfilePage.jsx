import React, { useState, useContext } from "react";
import axios from "axios";
import { Pencil, Check, Upload } from "lucide-react";
import { UserContext } from "../../context/UserContext";
import "./ProfilePage.css";

const ProfilePage = () => {
  const { user, setUser } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState({
    username: false,
    password: false,
  });

  console.log("user", user);
  const [userData, setUserData] = useState({
    email: user?.email || "user@example.com",
    username: user?.username || "JohnDoe",
    password: "*******",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleEditClick = (field) => {
    setIsEditing({ ...isEditing, [field]: true });
  };

  const handleSaveClick = async () => {
    try {
      setLoading(true);
      setMessage("");

      const updatedFields = {};
      if (isEditing.username && userData.username !== user.username) {
        updatedFields.username = userData.username;
      }
      if (isEditing.password && userData.password) {
        updatedFields.password = userData.password;
      }

      if (Object.keys(updatedFields).length === 0) {
        setLoading(false);
        setIsEditing({ username: false, password: false });
        return;
      }

      await axios.put("/api/users/edit", updatedFields, {
        withCredentials: true,
      });

      // Refetch updated user data
      const { data } = await axios.get("/api/users/me", {
        withCredentials: true,
      });
      setUser(data);

      setMessage("Profile updated successfully!");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
      setIsEditing({ username: false, password: false });
      setUserData({ ...userData, password: "" }); // Reset password field
    }
  };

  return (
    <div className="profile-container">
      <div className="sidebar">
        <div className="profile-header">
          <img
            src={user?.profilePicture || "/icons/user.png"}
            alt="User Icon"
            className="profile-icon"
          />
          <h2 className="profile-username">{userData.username}</h2>
        </div>

        <div className="border-line"></div>

        <button
          className={`tab ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          User Profile
        </button>
        <button
          className={`tab ${activeTab === "files" ? "active" : ""}`}
          onClick={() => setActiveTab("files")}
        >
          Files
        </button>
      </div>

      <div className="main-content">
        {activeTab === "profile" && (
          <div className="profile-details">
            {message && <p className="message">{message}</p>}

            <div className="field">
              <label>Email:</label>
              <div className="input-container">
                <input type="text" value={userData.email} readOnly />
              </div>
            </div>

            <div className="field">
              <label>Username:</label>
              <div className="input-container">
                <input
                  type="text"
                  value={userData.username}
                  onChange={(e) =>
                    setUserData({ ...userData, username: e.target.value })
                  }
                  readOnly={!isEditing.username}
                />
                {!isEditing.username ? (
                  <Pencil
                    className="edit-icon"
                    onClick={() => handleEditClick("username")}
                  />
                ) : (
                  <Check className="save-icon" onClick={handleSaveClick} />
                )}
              </div>
            </div>

            <div className="field">
              <label>Password:</label>
              <div className="input-container">
                <input
                  type="password"
                  value={userData.password}
                  onChange={(e) =>
                    setUserData({ ...userData, password: e.target.value })
                  }
                  readOnly={!isEditing.password}
                  placeholder="Enter new password"
                />
                {!isEditing.password ? (
                  <Pencil
                    className="edit-icon"
                    onClick={() => handleEditClick("password")}
                  />
                ) : (
                  <Check className="save-icon" onClick={handleSaveClick} />
                )}
              </div>
            </div>

            {(isEditing.username || isEditing.password) && (
              <button
                className="save-btn"
                onClick={handleSaveClick}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

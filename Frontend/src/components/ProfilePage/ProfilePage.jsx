import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { Pencil, Loader, Upload } from "lucide-react";
import { UserContext } from "../../context/UserContext";
import "./ProfilePage.css";
import toast from "react-hot-toast";
import FilesSection from "./FilesSection";

const ProfilePage = () => {
  const { user, setUser } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState({
    username: false,
    password: false,
  });

  // console.log("user", user);
  const [userData, setUserData] = useState({
    email: user?.email || "user@example.com",
    username: user?.username || "JohnDoe",
    password: "*******",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);


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

      // ✅ Correctly handle success messages
      if (updatedFields.username && updatedFields.password) {
        toast.success("Username and Password updated successfully!");
      } else if (updatedFields.username) {
        toast.success("Username updated successfully!");
      } else if (updatedFields.password) {
        toast.success("Password updated successfully!");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
      setIsEditing({ username: false, password: false });
      setUserData({ ...userData, password: "" });
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get("/api/users/me", { withCredentials: true });
        setUser(data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
  
    fetchUser();
  }, []);

  return (
    <div className="profile-container">
      <div className="sidebar">
        <div className="profile-header">
          <img
            src={user?.profilePicture}
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
                  <Loader className="save-icon" onClick={handleSaveClick} />
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
                  <Loader className="save-icon" onClick={handleSaveClick} />
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
        {activeTab === "files" && <FilesSection files={files} setFiles={setFiles} />}
      </div>
    </div>
  );
};

export default ProfilePage;

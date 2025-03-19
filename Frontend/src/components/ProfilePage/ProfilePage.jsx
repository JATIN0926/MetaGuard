import React, { useState } from "react";
import { Pencil, Check, Upload } from "lucide-react";
import "./ProfilePage.css";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState({ username: false, password: false });
  const [userData, setUserData] = useState({
    email: "user@example.com",
    username: "JohnDoe",
    password: "********",
  });

  const [files, setFiles] = useState([]);

  const handleEditClick = (field) => {
    setIsEditing({ ...isEditing, [field]: true });
  };

  const handleSaveClick = () => {
    setIsEditing({ username: false, password: false });
  };

  const handleFileUpload = (e) => {
    const uploadedFiles = Array.from(e.target.files).map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));
    setFiles([...files, ...uploadedFiles]);
  };

  return (
    <div className="profile-container">
      {/* Sidebar (Left) */}
      <div className="sidebar">
        {/* User Icon and Username */}
        <div className="profile-header">
          <img src="/icons/user.png" alt="User Icon" className="profile-icon" />
          <h2 className="profile-username">{userData.username}</h2>
        </div>

        {/* Border Line */}
        <div className="border-line"></div>

        {/* Tabs */}
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

      {/* Main Content (Right) */}
      <div className="main-content">
        {activeTab === "profile" && (
          <div className="profile-details">
            {/* Email Field */}
            <div className="field">
              <label>Email:</label>
              <div className="input-container">
                <input type="text" value={userData.email} readOnly />
              </div>
            </div>

            {/* Username Field */}
            <div className="field">
              <label>Username:</label>
              <div className="input-container">
                <input
                  type="text"
                  value={userData.username}
                  onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                  readOnly={!isEditing.username}
                />
                {!isEditing.username ? (
                  <Pencil className="edit-icon" onClick={() => handleEditClick("username")} />
                ) : (
                  <Check className="save-icon" onClick={handleSaveClick} />
                )}
              </div>
            </div>

            {/* Password Field */}
            <div className="field">
              <label>Password:</label>
              <div className="input-container">
                <input
                  type="password"
                  value={userData.password}
                  onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                  readOnly={!isEditing.password}
                />
                {!isEditing.password ? (
                  <Pencil className="edit-icon" onClick={() => handleEditClick("password")} />
                ) : (
                  <Check className="save-icon" onClick={handleSaveClick} />
                )}
              </div>
            </div>

            {/* Save Button (Conditional Rendering) */}
            {(isEditing.username || isEditing.password) && (
              <button className="save-btn" onClick={handleSaveClick}>
                Save Changes
              </button>
            )}
          </div>
        )}

        {activeTab === "files" && (
          <div className="files-section">
            <h2>Your Files</h2>
            <div className="file-grid">
              {files.map((file, index) => (
                <div key={index} className="file-item">
                  <img src={file.url} alt={file.name} />
                  <p>{file.name}</p>
                </div>
              ))}
            </div>
            <label className="upload-btn">
              <Upload />
              Upload More Files
              <input type="file" multiple onChange={handleFileUpload} hidden />
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
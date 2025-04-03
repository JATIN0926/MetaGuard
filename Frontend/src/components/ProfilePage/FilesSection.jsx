import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Upload, FileText, File, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { UserContext } from "../../context/UserContext";
import "./ProfilePage.css";

const FilesSection = ({ files, setFiles }) => {
  const { user } = useContext(UserContext);
  const [uploading, setUploading] = useState(false);
  const [password, setPassword] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filePassword, setFilePassword] = useState("");

  useEffect(() => {
    if (!user) return;

    const fetchUserFiles = async () => {
      try {
        const response = await axios.get("/api/files/user-files/get-files", {
          withCredentials: true,
        });
        setFiles(response.data.files);
      } catch (error) {
        console.error("Failed to fetch files:", error);
        toast.error("Failed to load files");
      }
    };

    fetchUserFiles();
  }, [user]);

  const handleFileUpload = async (e) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles.length) return;

    setUploading(true);
    const formData = new FormData();
    for (let file of uploadedFiles) {
      formData.append("file", file);
    }
    if (password) {
      formData.append("password", password);
    }

    try {
      const response = await axios.post(
        "/api/files/user-files/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      const newFile = response.data.file
        ? {
            originalName: response.data.file.originalName || "Unnamed File",
            s3Url: response.data.file.s3Url,
            createdAt: new Date().toISOString(),
            _id: response.data.file._id,
            passwordProtected: response.data.file.passwordProtected,
          }
        : null;

      if (newFile) {
        setFiles((prevFiles) => [...prevFiles, newFile]);
      }

      toast.success("Files uploaded successfully!");
    } catch (error) {
      console.error("File upload error:", error);
      toast.error("Failed to upload files");
    } finally {
      setUploading(false);
      setPassword("");
    }
  };

  const handleOpenFile = (file) => {
    if (!file.passwordProtected) {
      window.open(file.s3Url, "_blank");
      return;
    }
    setSelectedFile(file);
    setShowModal(true);
  };

  const handlePasswordSubmit = async () => {
    try {
      const response = await axios.post(
        "/api/files/user-files/decrypt",
        { fileId: selectedFile._id, password: filePassword },
        { withCredentials: true }
      );

      if (response.data.fileUrl) {
        window.open(response.data.fileUrl, "_blank");
        setShowModal(false);
        setFilePassword("");
      } else {
        toast.error("Incorrect password!");
      }
    } catch (error) {
      console.error("Error decrypting file:", error);
      toast.error("Failed to unlock file");
    }
  };

  const handleDeleteFile = async (event, fileId) => {
    event.stopPropagation();

    if (!window.confirm("Are you sure you want to delete this file?")) return;

    try {
      await axios.delete(`/api/files/user-files/delete/${fileId}`, {
        withCredentials: true,
      });

      setFiles((prevFiles) => prevFiles.filter((file) => file._id !== fileId));

      toast.success("File deleted successfully!");
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Failed to delete file");
    }
  };

  return (
    <div className="files-section">
      <h2>Your Files</h2>
      <div className="file-grid">
        {files.map((file, index) => (
          <div
            key={index}
            className="file-item-profile"
            onClick={() => handleOpenFile(file)}
          >
            <File size={40} color={file.passwordProtected ? "red" : "black"} />
            <p>
              {file.passwordProtected ? "🔒 " : ""}
              {file.originalName}
            </p>
            <Trash2
              size={20}
              className="delete-icon"
              onClick={(event) => handleDeleteFile(event, file._id)}
            />
          </div>
        ))}
      </div>
      <label className="upload-btn">
        <Upload /> {uploading ? "Uploading..." : "Upload More Files"}
        <input
          type="file"
          multiple
          onChange={handleFileUpload}
          hidden
          disabled={uploading}
        />
      </label>
      <input
        type="password"
        placeholder="Enter password (optional)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="password-input"
      />

      {/* Password Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Enter Password</h3>
            <input
              type="password"
              value={filePassword}
              onChange={(e) => setFilePassword(e.target.value)}
              placeholder="Password"
              className="password-input"
            />
            <button onClick={handlePasswordSubmit}>Unlock</button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilesSection;
